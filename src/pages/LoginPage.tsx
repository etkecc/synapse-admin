import TranslateIcon from "@mui/icons-material/Translate";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CircularProgress,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  Form,
  FormDataConsumer,
  Notification,
  required,
  useLogin,
  useNotify,
  useLocaleState,
  useTranslate,
  PasswordInput,
  TextInput,
  SelectInput,
  useLocales,
} from "react-admin";
import { useFormContext } from "react-hook-form";

import { useAppContext } from "../Context";
import Footer from "../components/layout/Footer";
import LoginFormBox from "../components/layout/LoginFormBox";
import { EtkeAttribution } from "../components/etke.cc/EtkeAttribution";
import { useInstanceConfig } from "../components/etke.cc/InstanceConfig";
import { getServerVersion } from "../providers/data/synapse";
import {
  getSupportedFeatures,
  getWellKnownUrl,
  isValidBaseUrl,
  splitMxid,
  getSupportedLoginFlows,
  getAuthMetadata,
  resolveBaseUrlWithWellKnown,
} from "../providers/matrix";
import { GetConfig, SetExternalAuthProvider } from "../utils/config";
import createLogger from "../utils/logger";

const log = createLogger("login");

export type LoginMethod = "credentials" | "accessToken";

/**
 * Get restricted base URL(s) from app context
 * @returns tuple of (single URL or null, array of URLs or null)
 */
function useRestrictedBaseUrl(): [string | null, string[] | null] {
  const { restrictBaseUrl } = useAppContext();
  // no var set, allow any
  if (!restrictBaseUrl) {
    return [null, null];
  }
  if (typeof restrictBaseUrl === "string") {
    // empty string means allow any
    if (restrictBaseUrl === "") {
      return [null, null];
    }

    // any other string means single url
    return [restrictBaseUrl, null];
  }

  if (Array.isArray(restrictBaseUrl)) {
    // empty array means allow any
    if (restrictBaseUrl.length === 0) {
      return [null, null];
    }
    let items = restrictBaseUrl.filter(item => item && item.trim() !== "");
    items = Array.from(new Set(items)); // deduplicate
    // after filtering, empty array means allow any
    if (items.length === 0) {
      return [null, null];
    }

    // array with one element means single url
    if (items.length === 1) {
      return [items[0], null];
    }
    // array with multiple elements means multiple urls
    return [null, items];
  }

  // fallback to any
  return [null, null];
}

export const getDefaultProtocolForHomeserverInput = (value: string): "http" | "https" => {
  const normalizedValue = value.trim().replace(/\/+$/g, "");

  if (
    /^(localhost|127\.0\.0\.1)(:\d{1,5})?$/i.test(normalizedValue) ||
    /^::1$/i.test(normalizedValue) ||
    /^\[::1\](:\d{1,5})?$/i.test(normalizedValue)
  ) {
    return "http";
  }

  return "https";
};

const prependDefaultProtocol = (value: string): string => {
  if (value.match(/^https?:\/\//)) {
    return value;
  }

  return `${getDefaultProtocolForHomeserverInput(value)}://${value}`;
};

/**
 * Returns true when the issuer string is a well-formed HTTP(S) URL
 * with no query string or fragment (per RFC 8414 §2).
 * Does not enforce https — that is a deployment policy, not a format rule.
 */
export const isValidIssuer = (issuer: string): boolean => {
  try {
    const { protocol, search, hash } = new URL(issuer);
    return (protocol === "https:" || protocol === "http:") && search === "" && hash === "";
  } catch {
    return false;
  }
};

const LoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const [restrictBaseUrlSingle, restrictBaseUrlMultiple] = useRestrictedBaseUrl();
  const wellKnownDiscovery = GetConfig().wellKnownDiscovery ?? true;
  const baseUrlChoices = restrictBaseUrlMultiple ? restrictBaseUrlMultiple : [];
  const localStorageBaseUrl = localStorage.getItem("base_url");
  let base_url = restrictBaseUrlSingle
    ? restrictBaseUrlSingle
    : restrictBaseUrlMultiple
      ? restrictBaseUrlMultiple[0]
      : null;
  if (!base_url) {
    if (localStorageBaseUrl && restrictBaseUrlMultiple?.includes(localStorageBaseUrl)) {
      // set base_url if it is in the restrictBaseUrl array
      base_url = localStorageBaseUrl;
    }
  }
  const [loading, setLoading] = useState(false);
  const [supportPassAuth, setSupportPassAuth] = useState(false);
  const [locale, setLocale] = useLocaleState();
  const locales = useLocales();
  const translate = useTranslate();
  const hasInitializedUrlParams = useRef(false);

  const [authMetadata, setAuthMetadata] = useState({});
  const [oidcVisible, setOIDCVisible] = useState(true);
  const [oidcUrl, setOIDCUrl] = useState("");
  const [ssoBaseUrl, setSSOBaseUrl] = useState("");
  const [baseUrl, setBaseUrl] = useState(base_url || "");
  const [resolvedBaseUrl, setResolvedBaseUrl] = useState(base_url || "");
  const loginToken = new URLSearchParams(window.location.search).get("loginToken");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("credentials");
  const [serverVersion, setServerVersion] = useState("");
  const [matrixVersions, setMatrixVersions] = useState("");

  const initialBaseUrl = useRef(base_url);
  useEffect(() => {
    if (initialBaseUrl.current) {
      resolveAndCheckServerInfo(initialBaseUrl.current as string);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- resolveAndCheckServerInfo is stable within the mount

  useEffect(() => {
    if (!loginToken) {
      return;
    }

    // Prevent further requests
    const previousUrl = new URL(window.location.toString());
    previousUrl.searchParams.delete("loginToken");
    window.history.replaceState({}, "", previousUrl.toString());
    const sso_base_url = localStorage.getItem("sso_base_url");
    localStorage.removeItem("sso_base_url");
    if (sso_base_url) {
      const auth = {
        base_url: sso_base_url,
        username: null,
        password: null,
        loginToken,
      };
      login(auth).catch(error => {
        alert(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
              ? "ra.auth.sign_in_error"
              : error.message
        );
        log.error("login with token failed", error);
      });
    }
  }, [loginToken, login]);

  const validateBaseUrl = (value: string) => {
    if (!value.match(/^(https?):\/\//)) {
      return translate("ketesa.auth.protocol_error");
    } else if (!isValidBaseUrl(value)) {
      return translate("ketesa.auth.url_error");
    } else {
      return undefined;
    }
  };

  const handleSubmit = auth => {
    setLoading(true);
    const cleanUrl = window.location.href.replace(window.location.search, "");
    window.history.replaceState({}, "", cleanUrl);

    const authWithResolved = {
      ...auth,
      base_url: resolvedBaseUrl || auth.base_url,
    };

    login(authWithResolved).catch(error => {
      setLoading(false);
      notify(
        typeof error === "string"
          ? error
          : typeof error === "undefined" || !error.message
            ? "ra.auth.sign_in_error"
            : error.message,
        { type: "warning" }
      );
    });
  };

  const handleSSO = () => {
    localStorage.setItem("sso_base_url", ssoBaseUrl);
    const ssoFullUrl = `${ssoBaseUrl}/_matrix/client/v3/login/sso/redirect?redirectUrl=${encodeURIComponent(
      window.location.href
    )}`;
    window.location.href = ssoFullUrl;
  };

  const handleOIDC = () => {
    log.debug("OIDC login initiated", { baseUrl });
    login({
      base_url: baseUrl,
      clientUrl: window.location.origin + window.location.pathname,
      authMetadata: authMetadata,
    });
  };

  const checkServerInfo = async (url: string) => {
    if (!isValidBaseUrl(url)) {
      setServerVersion("");
      setMatrixVersions("");
      setOIDCUrl("");
      setBaseUrl("");
      setResolvedBaseUrl("");
      setSupportPassAuth(false);
      return;
    }

    try {
      const serverVersion = await getServerVersion(url);
      setServerVersion(`${translate("ketesa.auth.server_version")} ${serverVersion}`);
    } catch {
      setServerVersion("");
    }

    try {
      const features = await getSupportedFeatures(url);
      setMatrixVersions(`${translate("ketesa.auth.supports_specs")} ${features.versions.join(", ")}`);
    } catch {
      setMatrixVersions("");
    }

    // Probe login flows and auth_metadata in parallel.
    // auth_metadata (/_matrix/client/v1/auth_metadata) works even when /v3/login is disabled by MAS.
    const [loginFlowsResult, authMetadataResult] = await Promise.allSettled([
      getSupportedLoginFlows(url),
      getAuthMetadata(url),
    ]);

    const loginFlows = loginFlowsResult.status === "fulfilled" ? loginFlowsResult.value : [];
    const authMetadata = authMetadataResult.status === "fulfilled" ? authMetadataResult.value : null;

    const supportPass = loginFlows.find(f => f.type === "m.login.password") !== undefined;
    const supportSSO = loginFlows.find(f => f.type === "m.login.sso") !== undefined;
    const hasDelegatedOIDC =
      supportSSO &&
      !!loginFlows.find(
        f =>
          f.type === "m.login.sso" &&
          (f["org.matrix.msc3824.delegated_oidc_compatibility"] || f["delegated_oidc_compatibility"])
      );

    // Either the MSC3824 delegated_oidc flag OR a valid auth_metadata issuer triggers the OIDC path.
    // MAS servers typically disable /v3/login (returning 404), so auth_metadata is the only signal.
    if (hasDelegatedOIDC || authMetadata?.issuer) {
      if (!authMetadata || !isValidIssuer(authMetadata.issuer)) {
        // auth_metadata missing or issuer has an unsupported scheme — server misconfigured
        setSupportPassAuth(false);
        setSSOBaseUrl("");
        setOIDCUrl("");
        setOIDCVisible(false);
        setBaseUrl("");
        setResolvedBaseUrl("");
        return;
      }
      setBaseUrl(url);
      setResolvedBaseUrl(url);
      SetExternalAuthProvider(true);
      setSSOBaseUrl("");
      setAuthMetadata(authMetadata);
      setOIDCUrl(authMetadata.issuer);
      setSupportPassAuth(false);
    } else if (loginFlows.length > 0) {
      // Standard login flows — no delegated OIDC
      setBaseUrl(url);
      setResolvedBaseUrl(url);
      setSupportPassAuth(supportPass);
      setSSOBaseUrl(supportSSO ? url : "");
      setOIDCVisible(false);
      setOIDCUrl("");
      setAuthMetadata({});
    } else {
      // Both probes failed — unknown or unreachable server
      setSupportPassAuth(false);
      setSSOBaseUrl("");
      setOIDCUrl("");
      setOIDCVisible(false);
      setBaseUrl("");
      setResolvedBaseUrl("");
    }
  };

  const resolveAndCheckServerInfo = async (url: string, updateFormValue?: (nextUrl: string) => void) => {
    if (!url) {
      return;
    }

    if (!isValidBaseUrl(url)) {
      checkServerInfo(url);
      return;
    }

    const resolvedUrl = wellKnownDiscovery ? await resolveBaseUrlWithWellKnown(url) : url;
    if (resolvedUrl !== url && updateFormValue) {
      updateFormValue(resolvedUrl);
    }
    checkServerInfo(resolvedUrl);
  };

  const icfg = useInstanceConfig();
  let welcomeTo = "Ketesa";
  let logoUrl = "./images/logo.webp";
  let backgroundUrl = "";
  if (icfg.name) {
    welcomeTo = icfg.name;
  }
  if (icfg.logo_url) {
    logoUrl = icfg.logo_url;
  }
  if (icfg.background_url) {
    backgroundUrl = icfg.background_url;
  }

  const UserData = ({ formData }) => {
    const form = useFormContext();

    const handleUsernameChange = async () => {
      if (formData.base_url || restrictBaseUrlSingle) {
        return;
      }
      // check if username is a full qualified userId then set base_url accordingly
      const domain = splitMxid(formData.username)?.domain;
      if (domain) {
        const url = wellKnownDiscovery ? await getWellKnownUrl(domain) : `https://${domain}`;
        if (!restrictBaseUrlMultiple || restrictBaseUrlMultiple.includes(url)) {
          form.setValue("base_url", url, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setResolvedBaseUrl(url);
          checkServerInfo(url);
        }
      }
    };

    const handleBaseUrlBlurOrChange = event => {
      // Get the value either from the event (onChange) or from formData (onBlur)
      let value = event?.target?.value || formData.base_url;

      if (!value) {
        return;
      }

      if (!value.match(/^https?:\/\//)) {
        value = prependDefaultProtocol(value);
        if (!restrictBaseUrlMultiple && !restrictBaseUrlSingle) {
          form.setValue("base_url", value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }

      // Trigger validation only when user finishes typing/selecting
      form.trigger("base_url");
      const updateFormValue =
        restrictBaseUrlMultiple || restrictBaseUrlSingle
          ? undefined
          : (nextUrl: string) =>
              form.setValue("base_url", nextUrl, {
                shouldValidate: true,
                shouldDirty: true,
              });
      resolveAndCheckServerInfo(value, updateFormValue);
    };

    useEffect(() => {
      if (hasInitializedUrlParams.current) return;
      hasInitializedUrlParams.current = true;

      // Defer to ensure form is initialized
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
          const isFullUrl = serverURL.match(/^(http|https):\/\//);
          if (!isFullUrl) {
            serverURL = prependDefaultProtocol(serverURL);
          }

          form.setValue("base_url", serverURL, {
            shouldValidate: true,
            shouldDirty: true,
          });
          const updateFormValue =
            restrictBaseUrlMultiple || restrictBaseUrlSingle
              ? undefined
              : (nextUrl: string) =>
                  form.setValue("base_url", nextUrl, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
          resolveAndCheckServerInfo(serverURL, updateFormValue);
        }
      }, 0);

      return () => clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
              {...(loading ? { disabled: true } : {})}
              resettable={true}
              validate={[required(), validateBaseUrl]}
              onBlur={handleBaseUrlBlurOrChange}
            />
          )}
        </Box>
        {loginMethod === "credentials" && supportPassAuth && (
          <>
            <Box>
              <TextInput
                source="username"
                label="ra.auth.username"
                autoComplete="username"
                onBlur={handleUsernameChange}
                resettable
                validate={required()}
                {...(loading || !supportPassAuth ? { disabled: true } : {})}
              />
            </Box>
            <Box>
              <PasswordInput
                source="password"
                label="ra.auth.password"
                type="password"
                autoComplete="current-password"
                {...(loading || !supportPassAuth ? { disabled: true } : {})}
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
              {...(loading ? { disabled: true } : {})}
              resettable
              validate={required()}
            />
          </Box>
        )}
        <Typography className="serverVersion" sx={{ wordBreak: "break-word" }}>
          {serverVersion}
        </Typography>
        <Typography className="matrixVersions" sx={{ wordBreak: "break-word" }}>
          {matrixVersions}
        </Typography>
      </>
    );
  };

  return (
    <Form defaultValues={{ base_url: base_url }} onSubmit={handleSubmit} mode="onBlur">
      <LoginFormBox backgroundUrl={backgroundUrl}>
        {!backgroundUrl && (
          <>
            <div className="login-orb login-orb-1" />
            <div className="login-orb login-orb-2" />
            <div className="login-orb login-orb-3" />
          </>
        )}
        <Card className="card">
          <Box className="avatar">
            {loading ? (
              <CircularProgress size={25} thickness={2} />
            ) : (
              <Avatar sx={{ width: { xs: "80px", sm: "120px" }, height: { xs: "80px", sm: "120px" } }} src={logoUrl} />
            )}
          </Box>
          <Box className="hint">{translate("ketesa.auth.welcome", { name: welcomeTo })}</Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              color: "text.secondary",
              fontSize: "0.85rem",
              mt: -1,
              mb: 1.5,
              px: 2,
              textAlign: "center",
            }}
          >
            {translate("ketesa.auth.description")}
          </Box>
          <Box className="form">
            <FormDataConsumer>{formDataProps => <UserData {...formDataProps} />}</FormDataConsumer>
            {loginMethod === "credentials" && (
              <CardActions
                className="actions"
                sx={{ flexDirection: "column", gap: 1, "& > :not(:first-of-type)": { ml: 0 } }}
              >
                {supportPassAuth && (
                  <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
                    {translate("ra.auth.sign_in")}
                  </Button>
                )}
                {ssoBaseUrl !== "" && (
                  <Button variant="contained" color="secondary" onClick={handleSSO} disabled={loading} fullWidth>
                    {translate("ketesa.auth.sso_sign_in")}
                  </Button>
                )}
                {(oidcVisible || oidcUrl !== "") && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleOIDC}
                    disabled={loading || oidcUrl === ""}
                    fullWidth
                  >
                    {translate("ra.auth.sign_in")}
                  </Button>
                )}
              </CardActions>
            )}
            {loginMethod === "accessToken" && (
              <CardActions className="actions">
                <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
                  {translate("ra.auth.sign_in")}
                </Button>
              </CardActions>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.5,
              pb: 2,
              opacity: 0.6,
              "&:hover": { opacity: 0.85 },
              transition: "opacity 150ms ease",
            }}
          >
            <TranslateIcon sx={{ fontSize: "0.95rem", color: "text.secondary" }} />
            <Select
              variant="standard"
              value={locale}
              onChange={e => setLocale(e.target.value)}
              disabled={loading}
              disableUnderline
              sx={{
                fontSize: "0.8rem",
                color: "text.secondary",
                "& .MuiSelect-select": { py: 0 },
                "& .MuiSvgIcon-root": { color: "text.secondary", fontSize: "1rem" },
              }}
            >
              {locales.map(l => (
                <MenuItem key={l.locale} value={l.locale} dense>
                  {l.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Card>
      </LoginFormBox>
      <Notification />
      <EtkeAttribution>
        <Footer />
      </EtkeAttribution>
    </Form>
  );
};

export default LoginPage;
