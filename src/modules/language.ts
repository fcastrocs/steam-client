/**
 * Load steam language
 */
import { LanguageType } from '../../@types/index';
import EResult from '../resources/language/EResult';
import { EPersonaState } from '../resources/language/enums.steamd';
import { EMsg } from '../resources/language/enums_clientserver';
import { EAuthSessionGuardType } from '../resources/language/steammessages_auth.steamclient';

function createEnumMaps() {
    const EnumsMap: Map<EMsg, keyof typeof EMsg> = new Map();
    const EResultMap: Map<EResult, keyof typeof EResult> = new Map();

    Object.entries(EMsg).forEach(([key, value]) => {
        EnumsMap.set(value as EMsg, key as keyof typeof EMsg);
    });

    Object.entries(EResult).forEach(([key, value]) => {
        EResultMap.set(value as EResult, key as keyof typeof EResult);
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
