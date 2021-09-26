"use strict";
/**
 * Load steam protos and language
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobufjs_1 = __importDefault(require("protobufjs"));
const EMsg_1 = __importDefault(require("./language/EMsg"));
const EOSType_1 = __importDefault(require("./language/EOSType"));
const EPersonaState_1 = __importDefault(require("./language/EPersonaState"));
const EPrivacyState_1 = __importDefault(require("./language/EPrivacyState"));
const EResult_1 = __importDefault(require("./language/EResult"));
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
    protos: protobufjs_1.default.loadSync(protoFiles),
    language: {
        EMsg: EMsg_1.default,
        EOSType: EOSType_1.default,
        EPersonaState: EPersonaState_1.default,
        EPrivacyState: EPrivacyState_1.default,
        EResult: EResult_1.default,
    },
};
exports.default = resources;
