import { DeleteParams, RaRecord, UpdateParams } from "react-admin";

import {
  MASRegistrationToken,
  MASRegistrationTokenListResponse,
  MASRegistrationTokenResource,
  RegistrationToken,
} from "./types";
import {
  checkMasAdminApiAvailable,
  convertMasTokenToSynapse,
  getMasTokenResource,
  isMasInstance,
  toRfc3339,
} from "./masUtils";

export interface BaseRegistrationTokensResource {
  path: string;
  data: string;
  create: (params: RaRecord) => { endpoint: string; body: object; method: string };
  delete: (params: DeleteParams) => { endpoint: string; method?: string; body?: object };
}

export interface SynapseRegistrationTokensResourceType extends BaseRegistrationTokensResource {
  isMas: false;
  map: (token: RegistrationToken) => object;
  total: (json: { registration_tokens: unknown[] }) => number;
}

export interface MASRegistrationTokensResourceType extends BaseRegistrationTokensResource {
  isMas: true;
  map: (token: MASRegistrationToken | MASRegistrationTokenResource) => object;
  total: (json: MASRegistrationTokenListResponse) => number;
  handleCreateResponse: (token: MASRegistrationToken) => object;
  update: (params: UpdateParams) => { endpoint: string; body: object; method: string };
}

export type RegistrationTokensResource = SynapseRegistrationTokensResourceType | MASRegistrationTokensResourceType;

export const synapseRegistrationTokensResource: SynapseRegistrationTokensResourceType = {
  path: "/_synapse/admin/v1/registration_tokens",
  isMas: false,
  map: (rt: RegistrationToken) => ({
    ...rt,
    id: rt.token,
  }),
  data: "registration_tokens",
  total: json => json.registration_tokens.length,
  create: (params: RaRecord) => ({
    endpoint: "/_synapse/admin/v1/registration_tokens/new",
    body: params,
    method: "POST",
  }), // Synapse accepts Unix timestamps as-is
  delete: (params: DeleteParams) => ({
    endpoint: `/_synapse/admin/v1/registration_tokens/${params.id}`,
  }),
};

export const getRegistrationTokensResource = async (): Promise<RegistrationTokensResource> => {
  if (!isMasInstance()) {
    return synapseRegistrationTokensResource;
  }

  if (!(await checkMasAdminApiAvailable())) {
    return synapseRegistrationTokensResource;
  }

  // Use MAS API
  return {
    path: "/api/admin/v1/user-registration-tokens",
    isMas: true,
    map: (token: MASRegistrationToken | MASRegistrationTokenResource) => {
      // Handle JSONAPI format for list and single responses
      const resource = getMasTokenResource(token);
      const converted = convertMasTokenToSynapse(resource);
      return {
        ...converted,
        id: resource.id || converted.token,
      };
    },
    data: "data",
    total: (json: MASRegistrationTokenListResponse) => json.meta?.count || 0,
    create: (params: RaRecord) => ({
      endpoint: "/api/admin/v1/user-registration-tokens",
      body: {
        token: params.token || undefined,
        usage_limit: params.uses_allowed ?? undefined,
        expires_at: toRfc3339(params.expiry_time),
      },
      method: "POST",
    }),
    handleCreateResponse: (token: MASRegistrationToken) => {
      const resource = getMasTokenResource(token);
      const converted = convertMasTokenToSynapse(resource);
      return {
        ...converted,
        id: resource.id || converted.token,
      };
    },
    delete: (params: DeleteParams) => ({
      endpoint: `/api/admin/v1/user-registration-tokens/${params.id}/revoke`,
      method: "POST",
    }),
    update: (params: UpdateParams) => ({
      endpoint: `/api/admin/v1/user-registration-tokens/${params.id}`,
      body: {
        usage_limit: params.data.uses_allowed ?? undefined,
        expires_at: toRfc3339(params.data.expiry_time),
      },
      method: "PUT",
    }),
  };
};
