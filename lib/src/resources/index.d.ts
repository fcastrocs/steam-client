/**
 * Load steam protos and language
 */
import ProtoBuf from "protobufjs";
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
declare const resources: SteamResources;
export default resources;
