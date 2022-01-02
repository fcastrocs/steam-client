/**
 * Load steam protos and language
 */
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import ProtoBuf from "protobufjs";
import EMsg from "./language/EMsg.js";
import EOSType from "./language/EOSType.js";
import EPersonaState from "./language/EPersonaState.js";
import EPrivacyState from "./language/EPrivacyState.js";
import EResult from "./language/EResult.js";
const protosDir = __dirname + "/protobufs/";
const protoFiles = [
    protosDir + "steammessages_base.proto",
    protosDir + "encrypted_app_ticket.proto",
    protosDir + "steammessages_player.steamclient.proto",
    protosDir + "steammessages_clientserver.proto",
    protosDir + "steammessages_clientserver_2.proto",
    protosDir + "steammessages_clientserver_friends.proto",
    protosDir + "steammessages_clientserver_login.proto",
];
const resources = {
    protos: ProtoBuf.loadSync(protoFiles),
    language: {
        EMsg,
        EOSType,
        EPersonaState,
        EPrivacyState,
        EResult,
    },
};
export default resources;
