import { Identifier } from "ra-core";
import { GetConfig } from "./config";

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
  return GetConfig().asManagedUsers.some(regex => regex.test(id as string));
};
