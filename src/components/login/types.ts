import { AuthMetadata } from "../../providers/matrix";

/** Which sign-in surface the form is showing. */
export type LoginMethod = "credentials" | "accessToken";

// Homeserver capabilities from login flows, versions, and OIDC metadata; password and sso can coexist.
export interface ServerCapabilities {
  password: boolean;
  sso: boolean;
  oidc: boolean;
  oidcIssuer: string | null;
  // OR of three suppress-password signals: msc3824/stable delegated_oidc_compatibility, oauth_aware_preferred.
  suppressPassword: boolean;
  serverVersion: string;
  matrixVersions: string[];
  authMetadata: AuthMetadata | null;
  ssoBaseUrl: string;
}

// Discriminated union for probe lifecycle; input visibility follows loginMethod alone (the keyboard-trap fix).
export type ProbeState =
  | { tag: "idle" }
  | { tag: "resolving"; url: string }
  | { tag: "ready"; url: string; caps: ServerCapabilities }
  | { tag: "incompatible"; url: string; advertisedFlows: string[] } // server responded but advertises no method Ketesa can drive
  | { tag: "unreachable"; url: string };

export type ProbeAction =
  | { type: "START"; url: string }
  | { type: "RESOLVED"; url: string; caps: ServerCapabilities }
  | { type: "INCOMPATIBLE"; url: string; advertisedFlows: string[] }
  | { type: "UNREACHABLE"; url: string }
  | { type: "RESET" };
