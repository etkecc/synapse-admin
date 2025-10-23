import { UserManager } from "oidc-client-ts";
import { AuthProvider, HttpError, Options, fetchUtils } from "react-admin";

import { AuthMetadata, handleOIDCAuth, refreshAccessToken } from "./matrix";
import { GetInstanceConfig } from "../components/etke.cc/InstanceConfig";
import { ClearConfig, GetConfig, SetExternalAuthProvider } from "../utils/config";
import decodeURLComponent from "../utils/decodeURLComponent";
import { MatrixError, displayError } from "../utils/error";
import { fetchAuthenticatedMedia } from "../utils/fetchMedia";

const authProvider: AuthProvider = {
  // called when the user attempts to log in
  login: async ({
    base_url,
    username,
    password,
    loginToken,
    accessToken,
    clientUrl,
    authMetadata,
  }: {
    base_url: string;
    username: string;
    password: string;
    loginToken: string;
    accessToken: string;
    clientUrl: string;
    authMetadata: AuthMetadata;
  }) => {
    console.log("login ");
    // use the base_url from login instead of the well_known entry from the
    // server, since the admin might want to access the admin API via some
    // private address
    if (!base_url) {
      // there is some kind of bug with base_url being present in the form, but not submitted
      // ref: https://github.com/etkecc/synapse-admin/issues/14
      localStorage.removeItem("base_url");
      throw new Error("Homeserver URL is required.");
    }
    base_url = base_url.replace(/\/+$/g, "");
    localStorage.setItem("base_url", base_url);

    const decoded_base_url = decodeURLComponent(base_url);
    localStorage.setItem("decoded_base_url", decoded_base_url);

    if (clientUrl && authMetadata) {
      // this is a OIDC login
      const authParams = await handleOIDCAuth(authMetadata, clientUrl);
      const userManager = new UserManager({
        authority: authParams.issuer,
        client_id: authParams.clientId,
        redirect_uri: authParams.redirectUri,
        response_type: authParams.responseType,
        scope: authParams.scope,
      });

      await userManager.signinRedirect();
      return;
    }

    const config = GetConfig();
    const icfg = GetInstanceConfig();
    let deviceName = "Synapse Admin";
    if (icfg.name) {
      deviceName = icfg.name;
    }

    let options: Options = {
      method: "POST",
      credentials: config.corsCredentials as RequestCredentials,
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(
        Object.assign(
          {
            device_id: localStorage.getItem("device_id"),
            initial_device_display_name: deviceName,
          },
          loginToken
            ? {
                type: "m.login.token",
                token: loginToken,
              }
            : {
                type: "m.login.password",
                identifier: {
                  type: "m.id.user",
                  user: username,
                },
                password: password,
              }
        )
      ),
    };

    const login_api_url =
      decoded_base_url + (accessToken ? "/_matrix/client/v3/account/whoami" : "/_matrix/client/v3/login");

    let response;

    try {
      if (accessToken) {
        // this a login with an already obtained access token, let's just validate it
        options = {
          headers: new Headers({
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          }),
        };
      }

      response = await fetchUtils.fetchJson(login_api_url, options);
      const json = response.json;

      let homeserverFromMXID = "";
      if (accessToken) {
        // just split(":")[1] is not enough, because there are homeservers with ports or IPv6 addresses,
        // like "@user:example.com:8008" or "@user:[2001:db8::1]"
        const mxidParts = json.user_id.split(":");
        mxidParts.shift();
        homeserverFromMXID = mxidParts.join(":");
      }

      localStorage.setItem("home_server", accessToken ? homeserverFromMXID : json.home_server);
      localStorage.setItem("user_id", json.user_id);
      localStorage.setItem("access_token", accessToken ? accessToken : json.access_token);
      localStorage.setItem("device_id", json.device_id);
      localStorage.setItem("login_type", accessToken ? "accessToken" : "credentials");
      let pageToRedirectTo = "/";

      if (config.etkeccAdmin && icfg && !icfg.disabled.monitoring) {
        pageToRedirectTo = "/server_status";
      }

      return Promise.resolve({ redirectTo: pageToRedirectTo });
    } catch (err) {
      const error = err as HttpError;
      const errorStatus = error.status;
      const errorBody = error.body as MatrixError;
      const errMsg = errorBody?.errcode
        ? displayError(errorBody.errcode, errorStatus, errorBody.error)
        : displayError("M_INVALID", errorStatus, error.message);

      return Promise.reject(new HttpError(errMsg, errorStatus));
    }
  },
  getIdentity: async () => {
    const access_token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");
    const base_url = localStorage.getItem("base_url");

    if (typeof access_token !== "string" || typeof user_id !== "string" || typeof base_url !== "string") {
      return Promise.reject();
    }

    const options: Options = {
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      }),
    };

    const whoami_api_url = base_url + `/_matrix/client/v3/profile/${user_id}`;

    try {
      let avatar_url = "";
      const response = await fetchUtils.fetchJson(whoami_api_url, options);
      if (response.json.avatar_url) {
        const mediaresp = await fetchAuthenticatedMedia(response.json.avatar_url, "thumbnail");
        const blob = await mediaresp.blob();
        avatar_url = URL.createObjectURL(blob);
      }

      return Promise.resolve({
        id: user_id,
        fullName: response.json.displayname,
        avatar: avatar_url,
      });
    } catch (err) {
      console.log("Error getting identity", err);
      return Promise.reject();
    }
  },
  handleCallback: async () => {
    console.log("handleCallback");
    // Get the authorization code and state from the callback URL
    const { searchParams } = new URL(window.location.href);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Error during authentication:", error);
      return Promise.reject(new Error(`Authentication error: ${error}`));
    }

    if (!code) {
      console.error("No authorization code in callback");
      return Promise.reject(new Error("No authorization code received"));
    }

    const stateKey = `oidc.${state}`;
    const { code_verifier } = JSON.parse(localStorage.getItem(stateKey) || "{}");

    if (!code_verifier) {
      console.error("No code verifier found in storage");
      return Promise.reject(new Error("PKCE code verifier not found"));
    }

    const tokenEndpoint = localStorage.getItem("token_endpoint");
    const clientId = localStorage.getItem("clientId");

    if (!tokenEndpoint || !clientId) {
      console.error("Missing token endpoint or client ID");
      return Promise.reject(new Error("Missing OAuth configuration"));
    }

    // Build form-urlencoded body (OAuth 2.0 token endpoints require this format)
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code: code,
      code_verifier: code_verifier,
      redirect_uri: `${window.location.origin}/auth-callback`,
    });

    // Exchange code for tokens
    const response = await fetchUtils.fetchJson(tokenEndpoint, {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: tokenParams.toString(),
    });

    // Save tokens to localStorage
    const { access_token, refresh_token, id_token, expires_in } = response.json;

    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }

    if (refresh_token) {
      SetExternalAuthProvider(true); // refresh token is only present for external auth providers
      localStorage.setItem("refresh_token", refresh_token);
    }

    if (id_token) {
      localStorage.setItem("id_token", id_token);
    }

    // Save token expiration time
    if (expires_in) {
      const expiresAt = Date.now() + expires_in * 1000;
      localStorage.setItem("access_token_expires_at", expiresAt.toString());
    }

    const decoded_base_url = localStorage.getItem("decoded_base_url") || "";

    if (!decoded_base_url) {
      console.error("No base_url found in storage");
      return Promise.reject(new Error("Base URL not found"));
    }

    // Get user_id from whoami endpoint
    if (access_token && decoded_base_url) {
      const whoamiUrl = `${decoded_base_url}/_matrix/client/v3/account/whoami`;
      try {
        const whoamiResponse = await fetchUtils.fetchJson(whoamiUrl, {
          headers: new Headers({
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          }),
        });
        const json = whoamiResponse.json;
        const userId = json.user_id;
        const deviceId = json.device_id;

        if (userId) {
          localStorage.setItem("user_id", userId);
        }
        if (deviceId) {
          localStorage.setItem("device_id", deviceId);
        }

        // just split(":")[1] is not enough, because there are homeservers with ports or IPv6 addresses,
        // like "@user:example.com:8008" or "@user:[2001:db8::1]"
        const mxidParts = userId.split(":");
        mxidParts.shift();
        localStorage.setItem("home_server", mxidParts.join(":"));
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("login_type", "credentials"); // OIDC login is basically credentials login, just via external provider

        const cfg = GetConfig();
        const icfg = GetInstanceConfig();
        let pageToRedirectTo = "/";
        if (cfg.etkeccAdmin && icfg && !icfg.disabled.monitoring) {
          pageToRedirectTo = "/server_status";
        }

        return Promise.resolve({ redirectTo: pageToRedirectTo });
      } catch (err) {
        console.error("Failed to get user info:", err);
      }
    }
  },
  // called when the user clicks on the logout button
  logout: async () => {
    console.log("logout");

    const logout_api_url = localStorage.getItem("base_url") + "/_matrix/client/v3/logout";
    const access_token = localStorage.getItem("access_token");

    const options: Options = {
      method: "POST",
      credentials: GetConfig().corsCredentials as RequestCredentials,
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      user: {
        authenticated: true,
        token: `Bearer ${access_token}`,
      },
    };

    if (typeof access_token === "string") {
      try {
        await fetchUtils.fetchJson(logout_api_url, options);
      } catch (err) {
        console.log("Error logging out", err);
      } finally {
        ClearConfig();
      }
    }
  },
  // called when the API returns an error
  checkError: (err: HttpError) => {
    const errorBody = err.body as MatrixError;
    const status = err.status;

    if (status === 401) {
      return Promise.reject({ message: displayError(errorBody.errcode, status, errorBody.error) });
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: async () => {
    const access_token = localStorage.getItem("access_token");

    if (typeof access_token !== "string") {
      return Promise.reject();
    }

    // Check if token has expired
    const expiresAt = localStorage.getItem("access_token_expires_at");
    if (expiresAt) {
      SetExternalAuthProvider(true); // presence of expiration time indicates external auth provider

      const expirationTime = parseInt(expiresAt, 10);
      const now = Date.now();

      if (now >= expirationTime) {
        console.log("Access token has expired, attempting refresh...");

        // Attempt to refresh the token
        const refreshSuccess = await refreshAccessToken();

        if (refreshSuccess) {
          console.log("Token refreshed successfully");
          return Promise.resolve();
        } else {
          console.log("Token refresh failed, redirecting to login");
          return Promise.reject();
        }
      }
    }

    return Promise.resolve();
  },
};

export default authProvider;
