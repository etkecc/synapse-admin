import InboxIcon from "@mui/icons-material/Inbox";
import { Box, Typography, keyframes } from "@mui/material";
import { CreateButton, useResourceContext, useResourceDefinition, useTranslate } from "react-admin";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg) scale(1); }
  25% { transform: translateY(-12px) rotate(2deg) scale(1.03); }
  50% { transform: translateY(-4px) rotate(-1deg) scale(0.98); }
  75% { transform: translateY(-14px) rotate(1.5deg) scale(1.02); }
  100% { transform: translateY(0) rotate(0deg) scale(1); }
`;

const glow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-200%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(244,147,0,0.25), 0 0 0 0 rgba(244,147,0,0); }
  50% { box-shadow: 0 0 20px rgba(244,147,0,0.35), 0 0 40px rgba(244,147,0,0.12); }
`;

const EmptyState = ({ resource: resourceProp }: { resource?: string } = {}) => {
  const translate = useTranslate();
  const contextResource = useResourceContext();
  const resource = resourceProp ?? contextResource;
  const { hasCreate } = useResourceDefinition({ resource });
  const resourceLabel = translate(`resources.${resource}.name`, { smart_count: 2, _: resource || "" }).toLowerCase();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 12,
        px: 3,
        animation: `${fadeIn} 500ms ease-out`,
      }}
    >
      {/* Orb container with glow backdrop */}
      <Box sx={{ position: "relative", mb: 4 }}>
        {/* Glow ring behind the orb */}
        <Box
          sx={theme => ({
            position: "absolute",
            inset: -16,
            borderRadius: "50%",
            background:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle, rgba(244,147,0,0.12) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(24,88,213,0.10) 0%, transparent 70%)",
            animation: `${glow} 4s ease-in-out infinite`,
            pointerEvents: "none",
          })}
        />
        {/* Floating orb */}
        <Box
          sx={theme => ({
            width: 140,
            height: 140,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            background:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle at 40% 35%, rgba(244,147,0,0.18) 0%, rgba(244,147,0,0.05) 60%, transparent 100%)"
                : "radial-gradient(circle at 40% 35%, rgba(24,88,213,0.12) 0%, rgba(24,88,213,0.03) 60%, transparent 100%)",
            border: theme.palette.mode === "dark" ? "1px solid rgba(244,147,0,0.12)" : "1px solid rgba(24,88,213,0.08)",
            animation: `${float} 5s ease-in-out infinite`,
          })}
        >
          <InboxIcon
            sx={theme => ({
              fontSize: 64,
              color: theme.palette.mode === "dark" ? "rgba(244,147,0,0.5)" : "rgba(24,88,213,0.4)",
            })}
          />
        </Box>
      </Box>
      <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
        {translate("ra.page.empty", { name: resourceLabel })}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, opacity: 0.7 }}>
        {hasCreate
          ? translate("ra.page.invite", { _: `Create your first ${resourceLabel} to get started.` })
          : translate("ra.navigation.no_results", { name: resourceLabel })}
      </Typography>
      {hasCreate && (
        <Box
          sx={theme => ({
            position: "relative",
            overflow: "hidden",
            borderRadius: "6px",
            animation: `${pulseGlow} 3s ease-in-out infinite`,
            "& .MuiButton-root": {
              px: 4,
              py: 1,
              fontSize: "0.95rem",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "60%",
              height: "100%",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              animation: `${shimmer} 3s ease-in-out infinite`,
              pointerEvents: "none",
            },
          })}
        >
          <CreateButton variant="contained" resource={resource} />
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
