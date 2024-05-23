import { EMsg } from '../resources/language/enums_clientserver';
import { EPersonaState } from '../resources/language/enums.steamd';
import Client from './Client';
import { SteamClientError } from './modules/common';
import { EResult } from '../resources/language/EResult';
import { EAuthSessionGuardType } from '../resources/language/steammessages_auth.steamclient';

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
