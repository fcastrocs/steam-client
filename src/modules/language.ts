/**
 * Load steam resources: protos and language
 */
import { ValueOf } from "type-fest";
import { EResult } from "../language/EResult.js";
import { EMsg } from "../language/enums_clientserver.proto.js";

const Language = createEnumMaps();

export { Language };

function createEnumMaps() {
  const maps: { [key: string]: Map<ValueOf<typeof EMsg>, keyof typeof EMsg> } = {};
  const enumsToMap = { EMsg, EResult };

  // enum maps for value:key instead of key:value
  for (const enumName in enumsToMap) {
    const constant = enumsToMap[enumName as keyof typeof enumsToMap];

    const map = new Map();
    for (const propertyName in constant) {
      map.set(constant[propertyName as keyof typeof constant], propertyName);
    }
    maps[enumName + "Map"] = map;
  }

  return {
    EMsgMap: maps.EMsgMap,
    EResultMap: maps.EResultMap,
  };
}
