/* eslint-disable import/prefer-default-export */
/**
 * Load steam language
 */
import { ValueOf } from 'type-fest';
import { EResult } from '../../resources/language/EResult.js';
import { EPersonaState } from '../../resources/language/enums.steamd.js';
import { EMsg } from '../../resources/language/enums_clientserver.js';
import { EAuthSessionGuardType } from '../../resources/language/steammessages_auth.steamclient.js';

declare const Language: {
    readonly EMsgMap: Map<ValueOf<typeof EMsg>, keyof typeof EMsg>;
    readonly EResultMap: Map<ValueOf<typeof EResult>, keyof typeof EResult>;
    readonly EMsg: typeof EMsg;
    readonly EResult: typeof EResult;
    readonly EPersonaState: typeof EPersonaState;
    readonly EAuthSessionGuardType: typeof EAuthSessionGuardType;
};
export { Language };
