import { RegistrationTokensResource } from "./types";
import {
  synapseResourceMap,
  synapseRegistrationTokensResource,
  CACHED_MANY_REF,
  invalidateManyRefCache,
} from "./synapse";
import { roomDirectoryResource } from "./matrix";

export { CACHED_MANY_REF, invalidateManyRefCache };

export const resourceMap = {
  ...synapseResourceMap,
  room_directory: roomDirectoryResource,
  // Default to Synapse API; patched to MAS API at login/page-load via initRegistrationTokens()
  registration_tokens: synapseRegistrationTokensResource as RegistrationTokensResource,
};
