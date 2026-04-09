/**
 * MAS (Matrix Authentication Service) admin API action helpers.
 * Direct async wrappers around MAS admin endpoints for user management actions.
 */

import { HttpError } from "react-admin";

import { jsonClient } from "../http";
import { MASPolicyData, MASPolicyDataResource } from "../types";
import { getMASBaseUrl } from "./mas-utils";

export const masLockUser = async (id: string, lock: boolean): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  const action = lock ? "lock" : "unlock";
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/users/${encodeURIComponent(id)}/${action}`, { method: "POST" });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masDeactivateUser = async (id: string, active: boolean): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  const action = active ? "reactivate" : "deactivate";
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/users/${encodeURIComponent(id)}/${action}`, { method: "POST" });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masSetAdmin = async (id: string, admin: boolean): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/users/${encodeURIComponent(id)}/set-admin`, {
      method: "POST",
      body: JSON.stringify({ admin }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masSetPassword = async (id: string, password: string): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/users/${encodeURIComponent(id)}/set-password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masFinishSession = async (
  resource: "mas_compat_sessions" | "mas_oauth2_sessions",
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  const apiPath = resource === "mas_compat_sessions" ? "compat-sessions" : "oauth2-sessions";
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/${apiPath}/${encodeURIComponent(id)}/finish`, { method: "POST" });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masRevokePersonalSession = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/personal-sessions/${encodeURIComponent(id)}/revoke`, {
      method: "POST",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masFinishUserSession = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/user-sessions/${encodeURIComponent(id)}/finish`, { method: "POST" });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const getMASPolicyData = async (): Promise<MASPolicyData | null> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return null;
  try {
    const { json } = await jsonClient(`${masBaseUrl}/api/admin/v1/policy-data/latest`);
    const d = json.data as MASPolicyDataResource;
    return { id: d.id, data: d.attributes.data, created_at: d.attributes.created_at };
  } catch {
    return null;
  }
};

export const setMASPolicyData = async (data: unknown): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/policy-data`, {
      method: "POST",
      body: JSON.stringify({ data }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masRegeneratePersonalSession = async (
  id: string
): Promise<{ success: boolean; token?: string; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    const { json } = await jsonClient(
      `${masBaseUrl}/api/admin/v1/personal-sessions/${encodeURIComponent(id)}/regenerate`,
      { method: "POST" }
    );
    return { success: true, token: json?.data?.attributes?.token };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};
