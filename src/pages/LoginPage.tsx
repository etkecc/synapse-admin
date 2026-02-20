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
import Footer from "../components/Footer";
import LoginFormBox from "../components/LoginFormBox";
import { EtkeAttribution } from "../components/etke.cc/EtkeAttribution";
import { GetInstanceConfig } from "../components/etke.cc/InstanceConfig";
import {
  getServerVersion,
  getSupportedFeatures,
  getWellKnownUrl,
  isValidBaseUrl,
  splitMxid,
  getSupportedLoginFlows,
  getAuthMetadata,
} from "../synapse/matrix";
import { SetExternalAuthProvider } from "../utils/config";

export type LoginMethod = "credentials" | "accessToken";

/**
 * Get restricted base URL(s) from app context
 * @returns tuple of (single URL or null, array of URLs or null)
 */
function getRestrictedBaseUrl(): [string | null, string[] | null] {
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

const LoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const [restrictBaseUrlSingle, restrictBaseUrlMultiple] = getRestrictedBaseUrl();
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
  const loginToken = new URLSearchParams(window.location.search).get("loginToken");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("credentials");
  const [serverVersion, setServerVersion] = useState("");
  const [matrixVersions, setMatrixVersions] = useState("");

  useEffect(() => {
    if (base_url) {
      checkServerInfo(base_url as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        console.error(error);
      });
    }
  }, [loginToken, login]);

  const validateBaseUrl = value => {
    if (!value.match(/^(http|https):\/\//)) {
      return translate("synapseadmin.auth.protocol_error");
    } else if (!value.match(/^(http|https):\/\/[a-zA-Z0-9\-.]+(:\d{1,5})?[^?&\s]*$/)) {
      return translate("synapseadmin.auth.url_error");
    } else {
      return undefined;
    }
  };

  const handleSubmit = auth => {
    setLoading(true);
    const cleanUrl = window.location.href.replace(window.location.search, "");
    window.history.replaceState({}, "", cleanUrl);

    login(auth).catch(error => {
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
    console.log("baseUrl:", baseUrl);
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
      setSupportPassAuth(false);
      return;
    }

    try {
      const serverVersion = await getServerVersion(url);
      setServerVersion(`${translate("synapseadmin.auth.server_version")} ${serverVersion}`);
    } catch {
      setServerVersion("");
    }

    try {
      const features = await getSupportedFeatures(url);
      setMatrixVersions(`${translate("synapseadmin.auth.supports_specs")} ${features.versions.join(", ")}`);
    } catch {
      setMatrixVersions("");
    }

    // Set SSO Url
    try {
      const loginFlows = await getSupportedLoginFlows(url);
      const supportPass = loginFlows.find(f => f.type === "m.login.password") !== undefined;
      const supportSSO = loginFlows.find(f => f.type === "m.login.sso") !== undefined;
      setBaseUrl(url);
      setSupportPassAuth(supportPass);
      setSSOBaseUrl(supportSSO ? url : "");

      if (
        supportSSO &&
        loginFlows.find(
          f =>
            f.type === "m.login.sso" &&
            (f["org.matrix.msc3824.delegated_oidc_compatibility"] || f["delegated_oidc_compatibility"])
        )
      ) {
        SetExternalAuthProvider(true);
        // only OIDC SSO login is supported
        setSSOBaseUrl("");

        const authMetadata = await getAuthMetadata(url);
        if (!authMetadata) {
          throw new Error("Failed to fetch authentication metadata");
        }
        setAuthMetadata(authMetadata);
        setOIDCUrl(authMetadata.issuer);
        setSupportPassAuth(false);
      } else {
        setOIDCVisible(false);
      }
    } catch {
      setSupportPassAuth(false);
      setSSOBaseUrl("");
      setOIDCUrl("");
      setBaseUrl("");
    }
  };

  const icfg = GetInstanceConfig();
  let welcomeTo = "Synapse Admin";
  let logoUrl = "./images/logo.webp";
  let backgroundUrl = "./images/floating-cogs.svg";
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
        const url = await getWellKnownUrl(domain);
        if (!restrictBaseUrlMultiple || restrictBaseUrlMultiple.includes(url)) {
          form.setValue("base_url", url, {
            shouldValidate: true,
            shouldDirty: true,
          });
          checkServerInfo(url);
        }
      }
    };

    const handleBaseUrlBlurOrChange = event => {
      // Get the value either from the event (onChange) or from formData (onBlur)
      const value = event?.target?.value || formData.base_url;

      if (!value) {
        return;
      }

      // Trigger validation only when user finishes typing/selecting
      form.trigger("base_url");
      checkServerInfo(value);
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
            serverURL = `https://${serverURL}`;
          }

          form.setValue("base_url", serverURL, {
            shouldValidate: true,
            shouldDirty: true,
          });
          checkServerInfo(serverURL);
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
          centered
        >
          <Tab label={translate("synapseadmin.auth.credentials")} value="credentials" />
          <Tab label={translate("synapseadmin.auth.access_token")} value="accessToken" />
        </Tabs>
        <Box>
          {restrictBaseUrlMultiple && (
            <SelectInput
              source="base_url"
              label="synapseadmin.auth.base_url"
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
              label="synapseadmin.auth.base_url"
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
              label="synapseadmin.auth.access_token"
              {...(loading ? { disabled: true } : {})}
              resettable
              validate={required()}
            />
          </Box>
        )}
        <Typography className="serverVersion">{serverVersion}</Typography>
        <Typography className="matrixVersions">{matrixVersions}</Typography>
      </>
    );
  };

  return (
    <Form defaultValues={{ base_url: base_url }} onSubmit={handleSubmit} mode="onBlur">
      <LoginFormBox backgroundUrl={backgroundUrl}>
        <Card className="card">
          <Box className="avatar">
            {loading ? (
              <CircularProgress size={25} thickness={2} />
            ) : (
              <Avatar sx={{ width: "120px", height: "120px" }} src={logoUrl} />
            )}
          </Box>
          <Box className="hint">{translate("synapseadmin.auth.welcome", { name: welcomeTo })}</Box>
          <Box className="form">
            <Select
              fullWidth
              value={locale}
              onChange={e => setLocale(e.target.value)}
              disabled={loading}
              className="select"
            >
              {locales.map(l => (
                <MenuItem key={l.locale} value={l.locale}>
                  {l.name}
                </MenuItem>
              ))}
            </Select>
            <FormDataConsumer>{formDataProps => <UserData {...formDataProps} />}</FormDataConsumer>
            {loginMethod === "credentials" && (
              <CardActions className="actions">
                {supportPassAuth && (
                  <Button size="small" variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
                    {translate("ra.auth.sign_in")}
                  </Button>
                )}
                {ssoBaseUrl !== "" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={handleSSO}
                    disabled={loading}
                    fullWidth
                  >
                    {translate("synapseadmin.auth.sso_sign_in")}
                  </Button>
                )}
                {(oidcVisible || oidcUrl !== "") && (
                  <Button
                    size="small"
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
