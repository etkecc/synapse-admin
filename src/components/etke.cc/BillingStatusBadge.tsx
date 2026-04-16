import PaymentIcon from "@mui/icons-material/Payment";
import { Badge, Theme } from "@mui/material";
import { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useDataProvider, useLocale, useStore } from "react-admin";

import { useAppContext } from "../../Context";
import { PaymentStatus } from "../../providers/types";
import createLogger from "../../utils/logger";

const log = createLogger("billing-status");

interface StyledBadgeProps extends BadgeProps {
  backgroundColor: string;
  badgeColor: string;
  theme?: Theme;
}

const StyledBadge = styled(Badge, {
  shouldForwardProp: prop => !["badgeColor", "backgroundColor"].includes(prop as string),
})<StyledBadgeProps>(({ theme, backgroundColor, badgeColor }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: backgroundColor,
    color: badgeColor,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 2.5s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

/** Returns true if the status data should be treated as missing/corrupt. */
const isStatusSentinel = (status: PaymentStatus): boolean => {
  if (status.expected_price === 0) {
    log.warn("payment status: expected_price is 0, treating as missing data");
    return true;
  }
  const dueAt = new Date(status.due_at);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  if (dueAt < twoMonthsAgo) {
    log.warn("payment status: due_at is more than 2 months in the past, treating as stale data", status.due_at);
    return true;
  }
  return false;
};

const useBillingStatus = () => {
  const [billingStatus, setBillingStatus] = useStore<PaymentStatus | null>("billingStatus", null);
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const locale = useLocale();

  useEffect(() => {
    if (!etkeccAdmin) {
      setBillingStatus(null);
      return;
    }

    dataProvider
      .getPayments(etkeccAdmin, locale)
      .then((response: { status?: PaymentStatus }) => {
        const status = response.status;
        if (!status) {
          setBillingStatus(null);
          return;
        }
        if (isStatusSentinel(status)) {
          setBillingStatus(null);
          return;
        }
        if (!status.overdue && !status.mismatch) {
          setBillingStatus(null);
          return;
        }
        setBillingStatus(status);
      })
      .catch((err: unknown) => {
        log.warn("failed to fetch billing status for badge", err);
        setBillingStatus(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etkeccAdmin]);

  return billingStatus;
};

/** Null-render component; mounts in AdminMenu to trigger the status fetch on app load. */
export const BillingStatusPoller = () => {
  useBillingStatus();
  return null;
};

/** Wraps PaymentIcon with a red ripple badge dot when there is a payment issue. Hidden otherwise. */
export const BillingStatusBadge = () => {
  const theme = useTheme();
  const [billingStatus] = useStore<PaymentStatus | null>("billingStatus", null);

  if (!billingStatus) {
    return <PaymentIcon aria-hidden="true" />;
  }

  const color = theme.palette.error.main;

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      backgroundColor={color}
      badgeColor={color}
    >
      <PaymentIcon aria-hidden="true" />
    </StyledBadge>
  );
};
