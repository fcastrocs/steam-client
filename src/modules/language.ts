/**
 * Load steam resources: protos and language
 */
import { EResult } from "../language/EResult.js";
import { EMsg } from "../language/enums_clientserver.js";
import { ValueOf } from "type-fest";
const Language = createEnumMaps();
export { Language };

function createEnumMaps() {
  const enumsMap: Map<ValueOf<typeof EMsg>, keyof typeof EMsg> = new Map();
  const EResultMap: Map<ValueOf<typeof EResult>, keyof typeof EResult> = new Map();

  for (const key in EMsg) {
    enumsMap.set(EMsg[key as keyof typeof EMsg], key as keyof typeof EMsg);
  }

  for (const key in EResult) {
    EResultMap.set(EResult[key as keyof typeof EResult], key as keyof typeof EResult);
  }

  return {
    EMsgMap: enumsMap,
    EResultMap: EResultMap,
  };
}
