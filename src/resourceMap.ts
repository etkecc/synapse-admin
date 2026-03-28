import { RegistrationTokensResource } from "./providers/types";
import {
  synapseResourceMap,
  synapseRegistrationTokensResource,
  CACHED_MANY_REF,
  invalidateManyRefCache,
} from "./providers/data/synapse";
import { roomDirectoryResource } from "./providers/matrix";

export { CACHED_MANY_REF, invalidateManyRefCache };

export const resourceMap = {
  ...synapseResourceMap,
  room_directory: roomDirectoryResource,
  // Default to Synapse API; patched to MAS API at login/page-load via initResources()
  registration_tokens: synapseRegistrationTokensResource as RegistrationTokensResource,
};
