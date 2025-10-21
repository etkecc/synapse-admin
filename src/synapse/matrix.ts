import { fetchUtils } from "react-admin";

import { generateDeviceId } from "../utils/password";

export const splitMxid = mxid => {
  const re = /^@(?<name>[a-zA-Z0-9._=\-/]+):(?<domain>[a-zA-Z0-9\-.]+\.[a-zA-Z]+)$/;
  return re.exec(mxid)?.groups;
};

export const isValidBaseUrl = baseUrl => /^(http|https):\/\/[a-zA-Z0-9\-.]+(:\d{1,5})?$/.test(baseUrl);

/**
 * Resolve the homeserver URL using the well-known lookup
 * @param domain  the domain part of an MXID
 * @returns homeserver base URL
 */
export const getWellKnownUrl = async domain => {
  const wellKnownUrl = `https://${domain}/.well-known/matrix/client`;
  try {
    const response = await fetchUtils.fetchJson(wellKnownUrl, { method: "GET" });
    return response.json["m.homeserver"].base_url;
  } catch {
    // if there is no .well-known entry, return the domain itself
    return `https://${domain}`;
  }
};

/**
 * Get synapse server version
 * @param base_url  the base URL of the homeserver
 * @returns server version
 */
export const getServerVersion = async baseUrl => {
  const versionUrl = `${baseUrl}/_synapse/admin/v1/server_version`;
  const response = await fetchUtils.fetchJson(versionUrl, { method: "GET" });
  return response.json.server_version;
};

/** Get supported Matrix features */
export const getSupportedFeatures = async baseUrl => {
  const versionUrl = `${baseUrl}/_matrix/client/versions`;
  const response = await fetchUtils.fetchJson(versionUrl, { method: "GET" });
  return response.json;
};

/**
 * Get supported login flows
 * @param baseUrl  the base URL of the homeserver
 * @returns array of supported login flows
 */
export const getSupportedLoginFlows = async (baseUrl: string) => {
  const loginFlowsUrl = `${baseUrl}/_matrix/client/v3/login`;
  const response = await fetchUtils.fetchJson(loginFlowsUrl, { method: "GET" });
  return response.json.flows;
};

export const getAuthMetadata = async (baseUrl: string): Promise<AuthMetadata | null> => {
  let authMetadataUrl = `${baseUrl}/_matrix/client/unstable/org.matrix.msc2965/auth_metadata`;
  try {
    let response = await fetchUtils.fetchJson(authMetadataUrl, { method: "GET" });
    if (response.status !== 200) {
      // Fallback to stable endpoint
      authMetadataUrl = `${baseUrl}/_matrix/client/auth_metadata`;
      response = await fetchUtils.fetchJson(authMetadataUrl, { method: "GET" });
    }

    return response.json;
  } catch {
    return null;
  }
};

/**
 * Refresh the access token using the refresh token
 * Based on: https://github.com/authts/oidc-client-ts/blob/main/docs/protocols/refresh-token-grant.md
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem("refresh_token");
  const tokenEndpoint = localStorage.getItem("token_endpoint");
  const clientId = localStorage.getItem("clientId");

  if (!refreshToken || !tokenEndpoint || !clientId) {
    console.error("Missing refresh token, token endpoint, or client ID");
    return false;
  }

  try {
    console.log("Refreshing access token...");
    const tokenParams = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    });

    const response = await fetchUtils.fetchJson(tokenEndpoint, {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: tokenParams.toString(),
    });

    const { access_token, refresh_token: new_refresh_token, id_token, expires_in } = response.json;

    // Update tokens in localStorage
    if (access_token) {
      localStorage.setItem("access_token", access_token);
      console.log("Access token refreshed successfully");
    }

    // Some providers return a new refresh token
    if (new_refresh_token) {
      localStorage.setItem("refresh_token", new_refresh_token);
    }

    if (id_token) {
      localStorage.setItem("id_token", id_token);
    }

    // Update token expiration time
    if (expires_in) {
      const expiresAt = Date.now() + expires_in * 1000;
      localStorage.setItem("access_token_expires_at", expiresAt.toString());
    }

    return true;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return false;
  }
};

interface ClientRegistration {
  client_id: string;
  client_name: string;
  client_uri: string;
  redirect_uris: string[];
  grant_types: string[];
  response_types: string[];
  token_endpoint_auth_method: string;
  id_token_signed_response_alg: string;
  application_type: string;
  logo_uri: string;
}

export const registerClient = async (registrationEndpoint: string, clientUrl: string): Promise<ClientRegistration> => {
  const registerOpts = {
    method: "POST",
    body: JSON.stringify({
      client_name: "Synapse Admin",
      client_uri: clientUrl,
      response_types: ["code"],
      grant_types: ["authorization_code", "refresh_token"],
      redirect_uris: [`${clientUrl}/auth-callback`],
      id_token_signed_response_alg: "RS256",
      token_endpoint_auth_method: "none",
      application_type: "web",
      logo_uri: `${clientUrl}/images/logo.webp`,
    }),
  };
  const registerResponse = await fetchUtils.fetchJson(`${registrationEndpoint}`, registerOpts);
  const json = registerResponse.json;
  return json;
};

export interface AuthMetadata {
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint: string;
  issuer: string;
}

export interface OIDCAuthParams {
  clientId: string;
  redirectUri: string;
  issuer: string;
  scope: string;
  responseType: string;
}

export const handleOIDCAuth = async (authMetadata: AuthMetadata, clientUrl: string): Promise<OIDCAuthParams> => {
  const registrationJson = await registerClient(authMetadata.registration_endpoint, clientUrl);
  const clientId = registrationJson.client_id;

  localStorage.setItem("clientId", clientId);
  localStorage.setItem("token_endpoint", authMetadata.token_endpoint);
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem("device_id", deviceId);
  }

  const scopes = [
    "openid",
    "urn:matrix:org.matrix.msc2967.client:api:*",
    `urn:matrix:org.matrix.msc2967.client:device:${deviceId}`,
    "urn:synapse:admin:*",
  ];

  return {
    clientId,
    redirectUri: registrationJson.redirect_uris[0],
    issuer: authMetadata.issuer,
    scope: scopes.join(" "),
    responseType: "code",
  };
};
