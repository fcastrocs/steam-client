/**
 * Load steam resources: protos and language
 */
import fs from "fs";
import * as url from "url";
import ProtoBuf from "protobufjs";
import { EResult } from "./language/EResult.js";
import { EMsg } from "./language/enums_clientserver.proto.js";
const rootDir = url.fileURLToPath(new URL("..", import.meta.url));

// load protos
const Protos = loadProtos();
const Language = createEnumMaps();

export { Protos, Language };

function loadProtos() {
  const protoFileNames = fs.readdirSync(rootDir + "protos/steam");

  const root = new ProtoBuf.Root();
  root.resolvePath = (origin, target) => {
    if (target.includes("google/protobuf")) {
      return rootDir + "protos/" + target;
    } else {
      return rootDir + "protos/steam/" + target;
    }
  };

  root.loadSync(protoFileNames);
  return root;
}

function createEnumMaps() {
  const maps: { [key: string]: Map<number, string> } = {};
  const enumsToMap = { EMsg, EResult };

  // enum maps for value:key instead of key:value
  for (const enumName in enumsToMap) {
    const constant = enumsToMap[enumName as keyof typeof enumsToMap];

    const map = new Map<number, string>();
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
