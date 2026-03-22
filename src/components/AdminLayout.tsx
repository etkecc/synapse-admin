import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Divider, ListItemIcon, ListItemText, MenuItem, Typography } from "@mui/material";
import { useEffect, useState, Suspense } from "react";
import {
  CheckForApplicationUpdate,
  AppBar,
  TitlePortal,
  InspectorButton,
  Confirm,
  Layout,
  Logout,
  Menu,
  useLogout,
  UserMenu,
  useStore,
  useLocaleState,
  useLocale,
} from "react-admin";

import { AdminClientConfigItems } from "./AdminClientConfigItems";
import Footer from "./Footer";
import { LoginMethod } from "../pages/LoginPage";
import { ServerProcessResponse, ServerStatusResponse } from "../providers/types";
import { useServerVersions } from "../providers/serverVersion";
import { ClearConfig } from "../utils/config";
import { Icons, DefaultIcon } from "../utils/icons";
import { EtkeAttribution } from "./etke.cc/EtkeAttribution";
import { ClearInstanceConfig, useInstanceConfig } from "./etke.cc/InstanceConfig";
import { ServerNotificationsBadge } from "./etke.cc/ServerNotificationsBadge";
import { EtkeStatusPoller, ServerStatusStyledBadge } from "./etke.cc/ServerStatusBadge";
import { useAppContext } from "../Context";

const ServerVersionItems = () => {
  const serverVersions = useServerVersions();
  if (!serverVersions.synapse && !serverVersions.mas) return null;

  return (
    <>
      {serverVersions.synapse && (
        <MenuItem dense sx={{ pointerEvents: "none" }}>
          <ListItemIcon>
            <InfoOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Synapse v{serverVersions.synapse}</Typography>
          </ListItemText>
        </MenuItem>
      )}
      {serverVersions.mas && (
        <MenuItem dense sx={{ pointerEvents: "none" }}>
          <ListItemIcon>
            <InfoOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">MAS {serverVersions.mas}</Typography>
          </ListItemText>
        </MenuItem>
      )}
      <Divider sx={{ my: 0.5 }} />
    </>
  );
};

const AdminUserMenu = () => {
  const [open, setOpen] = useState(false);
  const logout = useLogout();
  const checkLoginType = (ev: React.MouseEvent<HTMLDivElement>) => {
    const loginType: LoginMethod = (localStorage.getItem("login_type") || "credentials") as LoginMethod;
    if (loginType === "accessToken") {
      ev.stopPropagation();
      setOpen(true);
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    ClearConfig();
    ClearInstanceConfig();
    logout();
  };

  const handleDialogClose = () => {
    setOpen(false);
    ClearConfig();
    ClearInstanceConfig();
    window.location.reload();
  };

  return (
    <UserMenu>
      <ServerVersionItems />
      <AdminClientConfigItems />
      <div onClickCapture={checkLoginType}>
        <Logout />
      </div>
      <Confirm
        isOpen={open}
        title="synapseadmin.auth.logout_acces_token_dialog.title"
        content="synapseadmin.auth.logout_acces_token_dialog.content"
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="synapseadmin.auth.logout_acces_token_dialog.confirm"
        cancel="synapseadmin.auth.logout_acces_token_dialog.cancel"
      />
    </UserMenu>
  );
};

const AdminAppBar = () => {
  const icfg = useInstanceConfig();
  return (
    <AppBar userMenu={<AdminUserMenu />}>
      <TitlePortal />
      {!icfg.disabled.notifications && <ServerNotificationsBadge />}
      <InspectorButton />
    </AppBar>
  );
};

const AdminMenu = props => {
  const locale = useLocale();
  const icfg = useInstanceConfig();
  const { menu, etkeccAdmin } = useAppContext();
  const etkeRoutesEnabled = Boolean(etkeccAdmin);
  const [serverProcess, _setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
  });
  const [serverStatus, _setServerStatus] = useStore<ServerStatusResponse>("serverStatus", {
    success: false,
    ok: false,
    host: "",
    results: [],
  });

  return (
    <Menu
      {...props}
      sx={theme => ({
        color: theme.palette.mode === "dark" ? "#E0E0E0" : "#FFFFFF",
        "& .RaMenuItemLink-root": {
          justifyContent: "center",
          padding: "0px 2px 0px 0px",
          marginBottom: 0,
          borderLeft: "3px solid transparent",
          color: "inherit",
          transition: "background-color 150ms ease, border-color 150ms ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
        "& .RaMenuItemLink-icon": {
          minWidth: 44,
          width: 44,
          height: 44,
          backgroundColor: "transparent",
          color: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "box-shadow 150ms ease, transform 150ms ease",
        },
        "& .MuiSvgIcon-root": {
          color: "inherit",
        },
        "& .RaMenuItemLink-active": {
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          borderLeftColor: theme.palette.mode === "dark" ? theme.palette.primary.main : "#FFFFFF",
          color: (theme.palette.mode === "dark" ? "#E0E0E0" : "#FFFFFF") + " !important",
        },
      })}
    >
      {etkeRoutesEnabled && <EtkeStatusPoller />}
      {etkeRoutesEnabled && !icfg.disabled.monitoring && (
        <Menu.Item
          key="server_status"
          to="/server_status"
          leftIcon={
            <ServerStatusStyledBadge
              inSidebar={true}
              command={serverProcess.command}
              locked_at={serverProcess.locked_at}
              isOkay={serverStatus.ok}
              isLoaded={serverStatus.success}
            />
          }
          primaryText="etkecc.status.name"
        />
      )}
      {etkeRoutesEnabled && !icfg.disabled.actions && (
        <Menu.Item
          key="server_actions"
          to="/server_actions"
          leftIcon={<ManageHistoryIcon />}
          primaryText="etkecc.actions.name"
        />
      )}
      <Menu.ResourceItems />
      {etkeRoutesEnabled && !icfg.disabled.payments && (
        <Menu.Item key="billing" to="/billing" leftIcon={<PaymentIcon />} primaryText="etkecc.billing.name" />
      )}
      {etkeRoutesEnabled && !icfg.disabled.support && (
        <Menu.Item
          key="support"
          to="/support"
          leftIcon={<SupportAgentIcon />}
          primaryText="etkecc.support.menu_label"
        />
      )}
      {menu &&
        menu.map((item, index) => {
          const { url, icon, label, i18n } = item;
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const IconComponent = Icons[icon] as React.ComponentType<any> | undefined;

          let primaryText = label;
          if (i18n && i18n[locale]) {
            primaryText = i18n[locale];
          }

          return (
            <Suspense key={index}>
              <Menu.Item
                to={url}
                target="_blank"
                primaryText={primaryText}
                leftIcon={IconComponent ? <IconComponent /> : <DefaultIcon />}
                onClick={props.onMenuClick}
              />
            </Suspense>
          );
        })}
    </Menu>
  );
};

export const AdminLayout = ({ children }) => {
  // Set the document language based on the selected locale
  const [locale, _setLocale] = useLocaleState();
  const icfg = useInstanceConfig();
  useEffect(() => {
    document.documentElement.lang = locale;

    // copy of the code from index.tsx to set base title dynamically
    document.head.dataset.baseTitle = icfg.name || "Synapse Admin";
    // set <title> based on instance name, only if it's not already set
    if (icfg.name && !document.title.includes(icfg.name)) {
      document.title = icfg.name;
    }

    if (icfg.favicon_url) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = icfg.favicon_url;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = icfg.favicon_url;
        document.getElementsByTagName("head")[0].appendChild(newLink);
      }
    }
  }, [locale, icfg.name, icfg.favicon_url]);

  return (
    <>
      <Layout
        appBar={AdminAppBar}
        menu={AdminMenu}
        sx={theme => ({
          ["& .RaLayout-appFrame"]: {
            minHeight: "90vh",
            height: "90vh",
          },
          ["& .RaLayout-content"]: {
            marginBottom: "3rem",
          },
          ["& .RaLayout-contentWithSidebar > .MuiDrawer-root"]: {
            "& .MuiPaper-root": {
              backgroundColor: (theme.palette.mode === "dark" ? "#080D12" : "#334258") + " !important",
            },
            "& .RaSidebar-fixed": {
              backgroundColor: theme.palette.mode === "dark" ? "#080D12" : "#334258",
            },
          },
        })}
      >
        {children}
        <CheckForApplicationUpdate />
      </Layout>
      <EtkeAttribution>
        <Footer />
      </EtkeAttribution>
    </>
  );
};

export default AdminLayout;
