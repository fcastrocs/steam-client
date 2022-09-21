/**
 * Load steam protos and language
 */
import fs from "fs";
import ProtoBuf from "protobufjs";
import EMsg from "./language/EMsg.js";
import EResult from "./language/EResult.js";
import * as LangConstants from "./language/constants.js";
import { resolve } from "path";

const rootDir = resolve("./");

const LangConstantsExtended = { ...LangConstants, EMsg, EResult };

// load protos
const Protos = loadProtos();
const Language = createLanguage();
testLanguage();

export { Protos, Language };

function loadProtos() {
  const protoFileNames = fs.readdirSync(rootDir + "/protos/steam");

  const root = new ProtoBuf.Root();
  root.resolvePath = (origin, target) => {
    if (target.includes("google/protobuf")) {
      return rootDir + "/protos/" + target;
    } else {
      return rootDir + "/protos/steam/" + target;
    }
  };

  root.loadSync(protoFileNames);
  return root;
}

function createLanguage() {
  const maps: { [key: string]: Map<number, string> } = {};

  // build language maps for [key: number]: string constants
  for (const constantName in LangConstantsExtended) {
    const constant = LangConstantsExtended[constantName as keyof typeof LangConstantsExtended];

    const map = new Map<number, string>();
    for (const propertyName in constant) {
      map.set(constant[propertyName as keyof typeof constant], propertyName);
    }

    maps[constantName + "Map"] = map;
  }

  return {
    EMsg,
    EResult,
    ...LangConstants,
    EMsgMap: maps.EMsgMap,
    EResultMap: maps.EResultMap,
    EPurchaseResultMap: maps.EPurchaseResultMap,
    EPersonaStateMap: maps.EPersonaStateMap,
    ETradeOfferStateMap: maps.ETradeOfferStateMap,
    EAuthSessionGuardTypeMap: maps.EAuthSessionGuardTypeMap,
  };
}

function testLanguage() {
  if (Language.EMsgMap.get(Language.EMsg.ClientLogon) !== "ClientLogon") {
    throw new Error();
  }

  if (Language.EResultMap.get(Language.EResult.AccessDenied) !== "AccessDenied") {
    throw new Error();
  }

  if (Language.EPurchaseResultMap.get(Language.EPurchaseResult.ContactSupport) !== "ContactSupport") {
    throw new Error();
  }

  if (Language.EPersonaStateMap.get(Language.EPersonaState.LookingToPlay) !== "LookingToPlay") {
    throw new Error();
  }

  if (Language.ETradeOfferStateMap.get(Language.ETradeOfferState.Countered) !== "Countered") {
    throw new Error();
  }

  if (Language.EAuthSessionGuardTypeMap.get(Language.EAuthSessionGuardType.machineToken) !== "machineToken") {
    throw new Error();
  }
}
