/**
 * Load steam language
 */
import { EResult } from "../../resources/language/EResult.js";
import { EPersonaState } from "../../resources/language/enums.steamd.js";
import { EMsg } from "../../resources/language/enums_clientserver.js";
const { EMsgMap, EResultMap } = createEnumMaps();
export { EMsgMap, EResultMap, EMsg, EResult, EPersonaState };

function createEnumMaps() {
    const EnumsMap: Map<EMsg, keyof typeof EMsg> = new Map();
    const EResultMap: Map<EResult, keyof typeof EResult> = new Map();

    for (const key in EMsg) {
        const value = EMsg[key as keyof typeof EMsg];
        EnumsMap.set(value, key as keyof typeof EMsg);
    }

    for (const key in EResult) {
        const value = EResult[key as keyof typeof EResult];
        EResultMap.set(value, key as keyof typeof EResult);
    }

    return {
        EMsgMap: EnumsMap,
        EResultMap: EResultMap,
    };
}
