import { Identifier } from "ra-core";

import { GetConfig } from "../utils/config";

const mxidPattern = /^@[^@:]+:[^@:]+$/;

/*
 * Check if id is a valid Matrix ID (user)
 * @param id The ID to check
 * @returns Whether the ID is a valid Matrix ID
 */
export const isMXID = (id: string | Identifier): boolean => mxidPattern.test(id as string);

/**
 * Check if a user is managed by an application service
 * @param id The user ID to check
 * @returns Whether the user is managed by an application service
 */
export const isASManaged = (id: string | Identifier): boolean => {
  const managedUsers = GetConfig().asManagedUsers;
  if (!managedUsers) {
    return false;
  }
  return managedUsers.some(regex => regex.test(id as string));
};

/**
 * Generate a random MXID for current homeserver
 * @returns full MXID as string
 */
export function generateRandomMXID(): string {
  const homeserver = localStorage.getItem("home_server");
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  const localpart = Array.from(crypto.getRandomValues(new Uint32Array(8)))
    .map(x => characters[x % characters.length])
    .join("");
  return `@${localpart}:${homeserver}`;
}

/**
 * Return the full MXID from an arbitrary input
 * @param input  the input string
 * @returns full MXID as string
 */
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
