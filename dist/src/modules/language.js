/**
 * Load steam resources: protos and language
 */
import { EResult } from "../../language/EResult.js";
import { EMsg } from "../../language/enums_clientserver.js";
const { EMsgMap, EResultMap } = createEnumMaps();
export { EMsgMap, EResultMap, EMsg, EResult };
function createEnumMaps() {
    const EnumsMap = new Map();
    const EResultMap = new Map();
    for (const key in EMsg) {
        const value = EMsg[key];
        EnumsMap.set(value, key);
    }
    for (const key in EResult) {
        const value = EResult[key];
        EResultMap.set(value, key);
    }
    return {
        EMsgMap: EnumsMap,
        EResultMap: EResultMap,
    };
}
