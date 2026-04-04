import { SynapseTranslationMessages } from "../types";

import common from "./common";
import mas from "./mas";
import misc_resources from "./misc_resources";
import reports from "./reports";
import rooms from "./rooms";
import users from "./users";

const zh: SynapseTranslationMessages = {
  ra: common.ra,
  ketesa: common.ketesa,
  import_users: common.import_users,
  delete_media: common.delete_media,
  purge_remote_media: common.purge_remote_media,
  etkecc: common.etkecc,
  resources: {
    users,
    rooms,
    reports,
    scheduled_tasks: misc_resources.scheduled_tasks,
    connections: misc_resources.connections,
    devices: misc_resources.devices,
    users_media: misc_resources.users_media,
    protect_media: misc_resources.protect_media,
    quarantine_media: misc_resources.quarantine_media,
    pushers: misc_resources.pushers,
    servernotices: misc_resources.servernotices,
    database_room_statistics: misc_resources.database_room_statistics,
    user_media_statistics: misc_resources.user_media_statistics,
    forward_extremities: misc_resources.forward_extremities,
    room_state: misc_resources.room_state,
    room_media: misc_resources.room_media,
    room_directory: misc_resources.room_directory,
    destinations: misc_resources.destinations,
    registration_tokens: misc_resources.registration_tokens,
    account_data: misc_resources.account_data,
    joined_rooms: misc_resources.joined_rooms,
    memberships: misc_resources.memberships,
    room_members: misc_resources.room_members,
    destination_rooms: misc_resources.destination_rooms,
    ...mas,
  },
};

export default zh;
