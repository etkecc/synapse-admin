import { AuthProvider, HttpError, Options, fetchUtils } from "react-admin";

import storage from "../storage";
import { MatrixError, displayError } from "../components/error";
import { fetchAuthenticatedMedia } from "../utils/fetchMedia";
import { ClearConfig } from "../components/config";

const authProvider: AuthProvider = {
  // called when the user attempts to log in
  login: async ({
    base_url,
    username,
    password,
    loginToken,
    accessToken,
  }: {
    base_url: string;
    username: string;
    password: string;
    loginToken: string;
    accessToken: string;
  }) => {
    console.log("login ");
    let options: Options = {
      method: "POST",
      body: JSON.stringify(
        Object.assign(
          {
            device_id: storage.getItem("device_id"),
            initial_device_display_name: "Synapse Admin",
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

    // use the base_url from login instead of the well_known entry from the
    // server, since the admin might want to access the admin API via some
    // private address
    if (!base_url) {
      // there is some kind of bug with base_url being present in the form, but not submitted
      // ref: https://github.com/etkecc/synapse-admin/issues/14
      storage.removeItem("base_url")
      throw new Error("Homeserver URL is required.");
    }
    base_url = base_url.replace(/\/+$/g, "");
    storage.setItem("base_url", base_url);

    const decoded_base_url = window.decodeURIComponent(base_url);
    let login_api_url = decoded_base_url + (accessToken ? "/_matrix/client/v3/account/whoami" : "/_matrix/client/v3/login");

    let response;

    try {
      if (accessToken) {
        // this a login with an already obtained access token, let's just validate it
        options = {
          headers: new Headers({
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          }),
        };
      }

      response = await fetchUtils.fetchJson(login_api_url, options);
      const json = response.json;
      storage.setItem("home_server", accessToken ? json.user_id.split(":")[1] : json.home_server);
      storage.setItem("user_id", json.user_id);
      storage.setItem("access_token", accessToken ? accessToken : json.access_token);
      storage.setItem("device_id", json.device_id);
      storage.setItem("login_type", accessToken ? "accessToken" : "credentials");

      return Promise.resolve({redirectTo: "/"});
    } catch(err) {
      const error = err as HttpError;
      const errorStatus = error.status;
      const errorBody = error.body as MatrixError;
      const errMsg = !!errorBody?.errcode ? displayError(errorBody.errcode, errorStatus, errorBody.error) : displayError("M_INVALID", errorStatus, error.message);

      return Promise.reject(
        new HttpError(
          errMsg,
          errorStatus,
        )
      );
    }
  },
  getIdentity: async () => {
    const access_token = storage.getItem("access_token");
    const user_id = storage.getItem("user_id");
    const base_url = storage.getItem("base_url");

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
  // called when the user clicks on the logout button
  logout: async () => {
    console.log("logout");

    const logout_api_url = storage.getItem("base_url") + "/_matrix/client/v3/logout";
    const access_token = storage.getItem("access_token");

    const options: Options = {
      method: "POST",
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

    if (status === 401 || status === 403) {
      return Promise.reject({message: displayError(errorBody.errcode, status, errorBody.error)});
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    const access_token = storage.getItem("access_token");
    console.log("checkAuth " + access_token);
    return typeof access_token === "string" ? Promise.resolve() : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};

export default authProvider;
