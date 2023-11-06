import { EResult } from "../resources/language/EResult.ts";
import { EMsg } from "../resources/language/enums_clientserver.ts";
import { EPersonaState } from "../resources/language/enums.steamd.js";

import Client from "./Client.js";
import { SteamClientError } from "./modules/common.js";

export declare const Language = {
    EMsgMap: Map<EMsg, keyof EMsg>,
    EResultMap: Map<EResult, keyof EResult>,
    EResult: EResult,
    EMsg: EMsg,
    EPersonaState: EPersonaState,
};

export default Client;
export { Language, SteamClientError };
