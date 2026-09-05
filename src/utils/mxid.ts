import { Identifier } from "ra-core";

import { GetConfig, SubscribeConfig } from "../utils/config";

// Structural guard only: server-name class admits "/" and control chars; JSON body use only, URL paths need encoding.
const mxidPattern = /^@[^@:]+:[^@]+$/;

export const isMXID = (id: string | Identifier): boolean => mxidPattern.test(id as string);

// Cache for isSystemUser results; cleared when config changes
const asManagedCache = new Map<string, boolean>();
SubscribeConfig(() => asManagedCache.clear());

export const isSystemUser = (id: string | Identifier): boolean => {
  const key = id as string;
  const cached = asManagedCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const managedUsers = GetConfig().asManagedUsers;
  if (!managedUsers || managedUsers.length === 0) {
    return false;
  }
  const result = managedUsers.some((regex: string | RegExp) =>
    (regex instanceof RegExp ? regex : new RegExp(regex)).test(key)
  );
  asManagedCache.set(key, result);
  return result;
};

export function generateRandomMXID(): string {
  const homeserver = localStorage.getItem("home_server");
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  const localpart = Array.from(crypto.getRandomValues(new Uint32Array(8)))
    .map(x => characters[x % characters.length])
    .join("");
  return `@${localpart}:${homeserver}`;
}

// Extracts localpart from a MXID (e.g. @localpart:homeserver), without the @ prefix or :homeserver suffix.
export function getLocalpart(id: string | Identifier): string {
  const str = id as string;
  if (!str.startsWith("@") || !str.includes(":")) {
    return str;
  }
  return str.slice(1, str.indexOf(":"));
}

export function returnMXID(input: string | Identifier): string {
  const inputStr = input as string;
  const homeserver = localStorage.getItem("home_server") || "";

  // when homeserver is not (just) a domain name, but a domain:port or even an IPv6 address
  if (homeserver != "" && inputStr.endsWith(homeserver) && inputStr.startsWith("@")) {
    return inputStr; // Already a valid MXID
  }

  // Check if the input already looks like a valid MXID (i.e., starts with "@" and contains ":")
  if (isMXID(input)) {
    return inputStr; // Already a valid MXID
  }

  // If input is not a valid MXID, assume it's a localpart and construct the MXID
  const localpart = typeof input === "string" && inputStr.startsWith("@") ? inputStr.slice(1) : inputStr;
  return `@${localpart}:${homeserver}`;
}
