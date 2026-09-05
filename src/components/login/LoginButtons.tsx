import { Button, CardActions } from "@mui/material";
import { useLogin, useTranslate } from "react-admin";

import createLogger from "../../utils/logger";

import { LoginMethod, ProbeState } from "./types";

const log = createLogger("login-buttons");

interface LoginButtonsProps {
  probeState: ProbeState;
  loginMethod: LoginMethod;
  loading: boolean;
}

// Sign-in stays disabled until a probe resolves password support; SSO/OIDC buttons wait on a resolved server too.
export const LoginButtons = ({ probeState, loginMethod, loading }: LoginButtonsProps) => {
  const translate = useTranslate();
  const login = useLogin();

  const handleSSO = () => {
    if (probeState.tag !== "ready") {
      return;
    }
    const { ssoBaseUrl } = probeState.caps;
    localStorage.setItem("sso_base_url", ssoBaseUrl);
    // origin+pathname only (matches handleOIDC): the full href would leak query params, including loginToken.
    const redirectUrl = window.location.origin + window.location.pathname;
    const ssoFullUrl = `${ssoBaseUrl}/_matrix/client/v3/login/sso/redirect?redirectUrl=${encodeURIComponent(
      redirectUrl
    )}`;
    window.location.href = ssoFullUrl;
  };

  const handleOIDC = () => {
    if (probeState.tag !== "ready") {
      return;
    }
    log.debug("OIDC login initiated", { baseUrl: probeState.url });
    login({
      base_url: probeState.url,
      clientUrl: window.location.origin + window.location.pathname,
      authMetadata: probeState.caps.authMetadata,
    });
  };

  if (loginMethod === "accessToken") {
    return (
      <CardActions className="actions">
        <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
          {translate("ra.auth.sign_in")}
        </Button>
      </CardActions>
    );
  }

  const ready = probeState.tag === "ready";
  const caps = ready ? probeState.caps : null;
  // Password Sign-in hides once a resolved server rejects password auth; avoids a permanently-dead control.
  const showSignIn = !ready || !!caps?.password;
  const signInDisabled = loading || !caps || !caps.password || caps.suppressPassword;

  return (
    <CardActions className="actions" sx={{ flexDirection: "column", gap: 1, "& > :not(:first-of-type)": { ml: 0 } }}>
      {showSignIn && (
        <Button variant="contained" type="submit" color="primary" disabled={signInDisabled} fullWidth>
          {probeState.tag === "resolving"
            ? translate("ketesa.auth.server_state.checking")
            : translate("ra.auth.sign_in")}
        </Button>
      )}
      {/* Suppresses SSO only when OIDC is live (caps.oidc); otherwise SSO is the fallback so a button always shows. */}
      {caps && caps.sso && (!caps.suppressPassword || !caps.oidc) && (
        <Button variant="contained" color="secondary" onClick={handleSSO} disabled={loading} fullWidth>
          {translate("ketesa.auth.sso_sign_in")}
        </Button>
      )}
      {caps && caps.oidc && (
        // Only when caps.oidc confirms a usable issuer; handleOIDC needs that metadata to authenticate.
        <Button variant="contained" color="secondary" onClick={handleOIDC} disabled={loading} fullWidth>
          {translate("ketesa.auth.oidc_sign_in")}
        </Button>
      )}
    </CardActions>
  );
};
