import { EMsg } from '../resources/language/enums_clientserver.ts';
import { EPersonaState } from '../resources/language/enums.steamd.js';

import Client from './Client.js';
import { SteamClientError } from './modules/common.js';
import { EResult } from '../resources/language/EResult.js';
import { EAuthSessionGuardType } from '../resources/language/steammessages_auth.steamclient.js';

export interface LanguageType {
    EMsgMap: Map<EMsg, keyof typeof EMsg>;
    EResultMap: Map<EResult, keyof typeof EResult>;
    EResult: typeof EResult;
    EMsg: typeof EMsg;
    EPersonaState: typeof EPersonaState;
    EAuthSessionGuardType: typeof EAuthSessionGuardType;
}

declare const Language: LanguageType;

export { Language, SteamClientError };
export default Client;
