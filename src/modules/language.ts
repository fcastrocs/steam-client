/**
 * Load steam language
 */
import { ValueOf } from 'type-fest';
import { LanguageType } from '../../@types/index.js';
import { EResult } from '../../resources/language/EResult.js';
import { EPersonaState } from '../../resources/language/enums.steamd.js';
import { EMsg } from '../../resources/language/enums_clientserver.js';
import { EAuthSessionGuardType } from '../../resources/language/steammessages_auth.steamclient.js';

function createEnumMaps() {
    const EnumsMap: Map<ValueOf<typeof EMsg>, keyof typeof EMsg> = new Map();
    const EResultMap: Map<ValueOf<typeof EResult>, keyof typeof EResult> = new Map();

    Object.entries(EMsg).forEach(([key, value]) => {
        EnumsMap.set(value as ValueOf<typeof EMsg>, key as keyof typeof EMsg);
    });

    Object.entries(EResult).forEach(([key, value]) => {
        EResultMap.set(value as ValueOf<typeof EResult>, key as keyof typeof EResult);
    });

    return {
        EMsgMap: EnumsMap,
        EResultMap
    };
}

const { EMsgMap, EResultMap } = createEnumMaps();

const Language: LanguageType = {
    EMsgMap,
    EResultMap,
    EMsg,
    EResult,
    EPersonaState,
    EAuthSessionGuardType
} as const;

export default Language;
