import { useCallback, useEffect, useReducer, useRef } from "react";

import { getServerVersion } from "../../providers/data/synapse";
import {
  AuthMetadata,
  getAuthMetadata,
  getSupportedFeatures,
  getSupportedLoginFlows,
  isValidBaseUrl,
  resolveBaseUrlWithWellKnown,
} from "../../providers/matrix";
import { GetConfig, SetExternalAuthProvider } from "../../utils/config";
import createLogger from "../../utils/logger";

import { ProbeAction, ProbeState, ServerCapabilities } from "./types";
import { isValidIssuer } from "./urls";

const log = createLogger("login-probe");

/** Per-flow flags that mark a server as delegating auth to OIDC. */
const OIDC_DELEGATION_FLAGS = ["org.matrix.msc3824.delegated_oidc_compatibility", "delegated_oidc_compatibility"];
/** Per-flow flags that ask OIDC-aware clients to suppress password sign-in (v1.18 adds oauth_aware_preferred). */
const SUPPRESS_PASSWORD_FLAGS = [...OIDC_DELEGATION_FLAGS, "oauth_aware_preferred"];

/** A login flow object with its type plus arbitrary advertised flags. */
interface LoginFlow {
  type: string;
  [key: string]: unknown;
}

// Staleness is handled in start() via AbortController; reducer just transitions on tag. START/RESOLVED urls differ.
function probeReducer(state: ProbeState, action: ProbeAction): ProbeState {
  switch (action.type) {
    case "START":
      return { tag: "resolving", url: action.url };
    case "RESOLVED":
      return { tag: "ready", url: action.url, caps: action.caps };
    case "INCOMPATIBLE":
      return { tag: "incompatible", url: action.url, advertisedFlows: action.advertisedFlows };
    case "UNREACHABLE":
      return { tag: "unreachable", url: action.url };
    case "RESET":
      return { tag: "idle" };
    default:
      return state;
  }
}

// Derives capabilities from a resolved probe; OIDC counts as usable only with a well-formed issuer present.
function deriveCapabilities(
  url: string,
  flows: LoginFlow[],
  authMetadata: AuthMetadata | null,
  serverVersion: string,
  matrixVersions: string[]
): ServerCapabilities {
  const password = flows.some(f => f.type === "m.login.password");
  const sso = flows.some(f => f.type === "m.login.sso");
  const hasDelegatedOIDC = flows.some(f => f.type === "m.login.sso" && OIDC_DELEGATION_FLAGS.some(flag => !!f[flag]));
  const suppressPassword = flows.some(f => f.type === "m.login.sso" && SUPPRESS_PASSWORD_FLAGS.some(flag => !!f[flag]));
  const oidcUsable =
    (hasDelegatedOIDC || authMetadata?.issuer != null) && authMetadata != null && isValidIssuer(authMetadata.issuer);
  const meta = oidcUsable && authMetadata ? authMetadata : null;

  return {
    password,
    sso,
    oidc: oidcUsable,
    oidcIssuer: meta ? meta.issuer : null,
    suppressPassword,
    serverVersion,
    matrixVersions,
    authMetadata: meta,
    ssoBaseUrl: sso ? url : "",
  };
}

export interface UseLoginProbe {
  state: ProbeState;
  // Probes a homeserver, resolving via well-known; calls onResolved if the url changed. Aborts any prior probe.
  start: (rawUrl: string, onResolved?: (resolvedUrl: string) => void) => void;
  /** Cancel any in-flight probe and return to idle. */
  abort: () => void;
}

// Owns the probe lifecycle (one AbortController probe at a time); input visibility ignores timing (keyboard trap).
export function useLoginProbe(initialUrl?: string): UseLoginProbe {
  const [state, dispatch] = useReducer(probeReducer, { tag: "idle" });
  const controllerRef = useRef<AbortController | null>(null);

  const start = useCallback((rawUrl: string, onResolved?: (resolvedUrl: string) => void) => {
    if (!rawUrl) {
      return;
    }
    if (!isValidBaseUrl(rawUrl)) {
      // Invalid input clears the probe; the form's own validator shows the error.
      controllerRef.current?.abort();
      controllerRef.current = null;
      dispatch({ type: "RESET" });
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;
    dispatch({ type: "START", url: rawUrl });

    void (async () => {
      let resolvedUrl = rawUrl;
      try {
        const wellKnownDiscovery = GetConfig().wellKnownDiscovery ?? true;
        resolvedUrl = wellKnownDiscovery ? await resolveBaseUrlWithWellKnown(rawUrl, signal) : rawUrl;
        if (signal.aborted) {
          return;
        }
        if (resolvedUrl !== rawUrl) {
          onResolved?.(resolvedUrl);
        }

        const [featuresR, flowsR, metaR, versionR] = await Promise.allSettled([
          getSupportedFeatures(resolvedUrl, signal),
          getSupportedLoginFlows(resolvedUrl, signal),
          getAuthMetadata(resolvedUrl, signal),
          getServerVersion(resolvedUrl, signal),
        ]);
        if (signal.aborted) {
          return;
        }

        // getAuthMetadata resolves null on failure; reachability comes from the three probes that reject instead.
        const reachable =
          featuresR.status === "fulfilled" || flowsR.status === "fulfilled" || versionR.status === "fulfilled";
        if (!reachable) {
          dispatch({ type: "UNREACHABLE", url: resolvedUrl });
          return;
        }

        const flows: LoginFlow[] = flowsR.status === "fulfilled" && Array.isArray(flowsR.value) ? flowsR.value : [];
        const authMetadata = metaR.status === "fulfilled" ? metaR.value : null;
        const serverVersion = versionR.status === "fulfilled" ? versionR.value : "";
        // features.versions is an untyped server response; Array.isArray guards the shape.
        const matrixVersions: string[] =
          featuresR.status === "fulfilled" && Array.isArray(featuresR.value?.versions)
            ? (featuresR.value.versions as string[])
            : [];

        const caps = deriveCapabilities(resolvedUrl, flows, authMetadata, serverVersion, matrixVersions);

        if (!caps.password && !caps.sso && !caps.oidc) {
          dispatch({ type: "INCOMPATIBLE", url: resolvedUrl, advertisedFlows: flows.map(f => f.type) });
          return;
        }

        // Always sets external-auth, even false, so a later password-only server can't stay stuck on prior OIDC.
        SetExternalAuthProvider(caps.oidc);
        dispatch({ type: "RESOLVED", url: resolvedUrl, caps });
      } catch (error) {
        if (signal.aborted) {
          return;
        }
        log.error("server probe failed", error);
        dispatch({ type: "UNREACHABLE", url: resolvedUrl });
      }
    })();
  }, []);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    dispatch({ type: "RESET" });
  }, []);

  useEffect(() => {
    if (initialUrl) {
      start(initialUrl);
    }
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only probe; start is stable
  }, []);

  return { state, start, abort };
}
