import { useEffect, useRef } from "react";
import { Box, Collapse, Tab, Tabs, Typography } from "@mui/material";
import { PasswordInput, required, SelectInput, TextInput, useTranslate } from "react-admin";
import { useFormContext } from "react-hook-form";

import { getWellKnownUrl, isValidBaseUrl, splitMxid } from "../../providers/matrix";
import { GetConfig } from "../../utils/config";

import { LoginMethod, ProbeState } from "./types";
import { prependDefaultProtocol } from "./urls";
import { UseLoginProbe } from "./useLoginProbe";

interface LoginFormSectionsProps {
  formData: { base_url?: string; username?: string };
  probeState: ProbeState;
  loginMethod: LoginMethod;
  setLoginMethod: (method: LoginMethod) => void;
  loading: boolean;
  restrictBaseUrlSingle: string | null;
  restrictBaseUrlMultiple: string[] | null;
  baseUrlChoices: string[];
  start: UseLoginProbe["start"];
}

// Credential inputs always render, ungated on the probe (keyboard-trap fix); disabled once server rejects password.
export const LoginFormSections = ({
  formData,
  probeState,
  loginMethod,
  setLoginMethod,
  loading,
  restrictBaseUrlSingle,
  restrictBaseUrlMultiple,
  baseUrlChoices,
  start,
}: LoginFormSectionsProps) => {
  const translate = useTranslate();
  const form = useFormContext();
  const hasInitializedUrlParams = useRef(false);
  const wellKnownControllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => wellKnownControllerRef.current?.abort(), []);

  const validateBaseUrl = (value: string) => {
    if (!value.match(/^(https?):\/\//)) {
      return translate("ketesa.auth.protocol_error");
    } else if (!isValidBaseUrl(value)) {
      return translate("ketesa.auth.url_error");
    }
    return undefined;
  };

  const handleUsernameChange = async () => {
    if (formData.base_url || restrictBaseUrlSingle) {
      return;
    }
    // If the username is a full MXID, derive the homeserver from its domain.
    const domain = splitMxid(formData.username ?? "")?.domain;
    if (domain) {
      const wellKnownDiscovery = GetConfig().wellKnownDiscovery ?? true;
      let url: string;
      if (wellKnownDiscovery) {
        // Abort an earlier lookup; bail if this one cancels on unmount so we never setValue on a dead form.
        wellKnownControllerRef.current?.abort();
        const controller = new AbortController();
        wellKnownControllerRef.current = controller;
        url = await getWellKnownUrl(domain, controller.signal);
        if (controller.signal.aborted) {
          return;
        }
      } else {
        url = `https://${domain}`;
      }
      if (!restrictBaseUrlMultiple || restrictBaseUrlMultiple.includes(url)) {
        form.setValue("base_url", url, { shouldValidate: true, shouldDirty: true });
        start(url);
      }
    }
  };

  const handleBaseUrlBlurOrChange = (event?: { target?: { value?: string } }) => {
    // onChange passes the event; onBlur falls back to the current form value.
    let value = event?.target?.value || formData.base_url;
    if (!value) {
      return;
    }

    if (!value.match(/^https?:\/\//)) {
      value = prependDefaultProtocol(value);
      if (!restrictBaseUrlMultiple && !restrictBaseUrlSingle) {
        form.setValue("base_url", value, { shouldValidate: true, shouldDirty: true });
      }
    }

    form.trigger("base_url");
    // Only sync to the well-known-resolved url in free-text mode; fixed/choice modes keep their configured value.
    const onResolved =
      restrictBaseUrlMultiple || restrictBaseUrlSingle
        ? undefined
        : (nextUrl: string) => form.setValue("base_url", nextUrl, { shouldValidate: true, shouldDirty: true });
    start(value, onResolved);
  };

  useEffect(() => {
    if (hasInitializedUrlParams.current) return;
    hasInitializedUrlParams.current = true;

    // Defer to ensure the form is initialized before seeding from URL params.
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const hostname = window.location.hostname;
      const username = params.get("username");
      const password = params.get("password");
      const accessToken = params.get("accessToken");
      let serverURL = params.get("server");

      if (username) {
        form.setValue("username", username);
      }

      if (hostname === "localhost" || hostname === "127.0.0.1") {
        if (password) {
          form.setValue("password", password);
        }
        if (accessToken) {
          setLoginMethod("accessToken");
          form.setValue("accessToken", accessToken);
        }
      }

      if (serverURL) {
        if (!serverURL.match(/^(http|https):\/\//)) {
          serverURL = prependDefaultProtocol(serverURL);
        }
        form.setValue("base_url", serverURL, { shouldValidate: true, shouldDirty: true });
        const onResolved =
          restrictBaseUrlMultiple || restrictBaseUrlSingle
            ? undefined
            : (nextUrl: string) => form.setValue("base_url", nextUrl, { shouldValidate: true, shouldDirty: true });
        start(serverURL, onResolved);
      }
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time URL-param seeding on mount
  }, []);

  // Disabled only once a resolved server rejects password or asks to suppress it; errors stay enabled (keyboard trap).
  const inputsDisabled =
    loading || (probeState.tag === "ready" && (!probeState.caps.password || probeState.caps.suppressPassword));

  // Clears stale required-validation errors when fields go disabled, else a greyed-out field still shows required.
  useEffect(() => {
    if (inputsDisabled) {
      form.clearErrors(["username", "password"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputsDisabled]); // form's methods are stable in identity; only re-run when the disabled state toggles.

  const serverVersionText =
    probeState.tag === "ready" && probeState.caps.serverVersion
      ? `${translate("ketesa.auth.server_version")} ${probeState.caps.serverVersion}`
      : "";
  const matrixVersionsText =
    probeState.tag === "ready" && probeState.caps.matrixVersions.length > 0
      ? `${translate("ketesa.auth.supports_specs")} ${probeState.caps.matrixVersions.join(", ")}`
      : "";

  // Retains the last advertised flows so the incompatible message can animate out after probeState clears them.
  const lastFlowsRef = useRef("");
  if (probeState.tag === "incompatible") {
    lastFlowsRef.current = probeState.advertisedFlows.join(", ");
  }

  return (
    <>
      <Tabs
        value={loginMethod}
        onChange={(_, newValue) => setLoginMethod(newValue as LoginMethod)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label={translate("ketesa.auth.credentials")} value="credentials" />
        <Tab label={translate("ketesa.auth.access_token")} value="accessToken" />
      </Tabs>
      <Box>
        {restrictBaseUrlMultiple && (
          <SelectInput
            source="base_url"
            label="ketesa.auth.base_url"
            select={true}
            autoComplete="url"
            fullWidth
            {...(loading ? { disabled: true } : {})}
            onChange={handleBaseUrlBlurOrChange}
            validate={[required(), validateBaseUrl]}
            choices={baseUrlChoices}
          />
        )}
        {!restrictBaseUrlSingle && !restrictBaseUrlMultiple && (
          <TextInput
            source="base_url"
            label="ketesa.auth.base_url"
            autoComplete="url"
            fullWidth
            {...(loading ? { disabled: true } : {})}
            resettable={true}
            validate={[required(), validateBaseUrl]}
            onBlur={handleBaseUrlBlurOrChange}
          />
        )}
      </Box>
      {/* One aria-live region wraps status messages, even repeats; per-message live would nest and double-read. */}
      <Box aria-live="polite">
        <Collapse in={probeState.tag === "resolving"} unmountOnExit>
          <Typography className="serverState" color="text.secondary" sx={{ wordBreak: "break-word" }}>
            {translate("ketesa.auth.server_state.resolving")}
          </Typography>
        </Collapse>
        <Collapse in={probeState.tag === "unreachable"} unmountOnExit>
          <Typography className="serverState" color="error" sx={{ wordBreak: "break-word" }}>
            {translate("ketesa.auth.server_state.unreachable")}
          </Typography>
        </Collapse>
        <Collapse in={probeState.tag === "incompatible"} unmountOnExit>
          <Typography className="serverState" color="error" sx={{ wordBreak: "break-word" }}>
            {translate("ketesa.auth.server_state.incompatible", { flows: lastFlowsRef.current })}
          </Typography>
        </Collapse>
        <Collapse in={probeState.tag === "ready" && probeState.caps.suppressPassword} unmountOnExit>
          <Typography className="serverState" color="text.secondary" sx={{ wordBreak: "break-word" }}>
            {translate("ketesa.auth.server_state.suppress_password_notice")}
          </Typography>
        </Collapse>
      </Box>
      {loginMethod === "credentials" && (
        <>
          <Box>
            <TextInput
              source="username"
              label="ra.auth.username"
              autoComplete="username"
              fullWidth
              onBlur={handleUsernameChange}
              resettable
              validate={required()}
              {...(inputsDisabled ? { disabled: true } : {})}
            />
          </Box>
          <Box>
            <PasswordInput
              source="password"
              label="ra.auth.password"
              type="password"
              autoComplete="current-password"
              fullWidth
              {...(inputsDisabled ? { disabled: true } : {})}
              resettable
              validate={required()}
            />
          </Box>
        </>
      )}
      {loginMethod === "accessToken" && (
        <Box>
          <TextInput
            source="accessToken"
            label="ketesa.auth.access_token"
            fullWidth
            {...(loading ? { disabled: true } : {})}
            resettable
            validate={required()}
          />
        </Box>
      )}
      <Collapse in={!!serverVersionText || !!matrixVersionsText} unmountOnExit>
        <Box>
          {serverVersionText && (
            <Typography className="serverVersion" sx={{ wordBreak: "break-word" }}>
              {serverVersionText}
            </Typography>
          )}
          {matrixVersionsText && (
            <Typography className="matrixVersions" sx={{ wordBreak: "break-word" }}>
              {matrixVersionsText}
            </Typography>
          )}
        </Box>
      </Collapse>
    </>
  );
};
