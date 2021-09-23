/**
 * Load steam protos and language
 */

import ProtoBuf from "protobufjs";

import EMsg from "./language/EMsg";
import EOSType from "./language/EOSType";
import EPersonaState from "./language/EPersonaState";
import EPrivacyState from "./language/EPrivacyState";
import EResult from "./language/EResult";

const protosDir = __dirname + "/protobufs/";

interface SteamResources {
  protos: ProtoBuf.Root;
  language: {
    EMsg: any;
    EOSType: any;
    EPersonaState: any;
    EPrivacyState: any;
    EResult: any;
  };
}

const protoFiles = [
  protosDir + "steammessages_base.proto",
  protosDir + "encrypted_app_ticket.proto",
  protosDir + "steammessages_player.steamclient.proto",
  protosDir + "steammessages_clientserver.proto",
  protosDir + "steammessages_clientserver_2.proto",
  protosDir + "steammessages_clientserver_friends.proto",
  protosDir + "steammessages_clientserver_login.proto",
];

const resources: SteamResources = {
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
