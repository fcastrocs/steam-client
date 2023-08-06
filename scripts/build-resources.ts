/**
 * Fetch Steam Protos and Language constants
 */

import fs, { createWriteStream } from "fs";
import fetch from "node-fetch";

const LANGUAGE_PATH = "./src/language/";
const PROTOS_PATH = "./protos/";

const PROTOS = [
  "contenthubs.proto",
  "encrypted_app_ticket.proto",
  "steammessages_unified_base.steamclient.proto",
  "steammessages_base.proto",
  "enums_clientserver.proto",
  "enums.proto",
  "steammessages_store.steamclient.proto",
  "steammessages_player.steamclient.proto",
  "steammessages_market.steamclient.proto",
  "steammessages_inventory.steamclient.proto",
  "steammessages_econ.steamclient.proto",
  "steammessages_credentials.steamclient.proto",
  "steammessages_clientserver_login.proto",
  "steammessages_clientserver_2.proto",
  "steammessages_clientserver.proto",
  "steammessages_auth.steamclient.proto",
  "steammessages_clientserver_friends.proto",
  "steammessages_clientserver_appinfo.proto",
];

(async () => {
  await fetchProtos();
  const EResult = await fetchEResultFile();
  await parseEnums("EResult", EResult);

  const Commons = await fetchCommonEnums();
  await parseEnums('commons', Commons)

  await extractEnumsFromProtos();
  buildTypesFromEnums()

})();


async function extractEnumsFromProtos() {
  const files = fs.readdirSync(PROTOS_PATH + "steam");
  for (const fileName of files) {
    // skip these files
    if (fileName.includes("contenthubs") ||
      fileName.includes("steammessages_unified_base")) {
      continue
    }
    const file = fs.readFileSync(PROTOS_PATH + "steam/" + fileName, "utf-8").split(/\r?\n/);
    await parseEnums(fileName, file);
  }
}

/**
 * Fetch Protos
 */
async function fetchProtos() {
  const PROTOS_URL = "https://raw.githubusercontent.com/SteamDatabase/Protobufs/master/";
  // fetch steam protos
  for (const proto of PROTOS) {
    const text = await fetch(PROTOS_URL + "steam/" + proto).then((res) => res.text());
    if (!text) throw new Error("Failed to fetch proto " + proto)
    fs.writeFileSync(PROTOS_PATH + "steam/" + proto, text);
  }
  // fetch descriptor proto
  const text = await fetch(PROTOS_URL + "google/protobuf/descriptor.proto").then((res) => res.text());
  fs.writeFileSync(PROTOS_PATH + "google/protobuf/descriptor.proto", text);
}

/**
 * Fetch EResult enum
 */
async function fetchEResultFile(): Promise<string[]> {
  const url = "https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/eresult.steamd";
  const EResult = (await fetch(url).then((res) => res.text())).split(/\r?\n/);
  if (!EResult || !EResult.length) throw new Error("Failed to fetch EResult");
  return EResult
}

async function fetchCommonEnums(): Promise<string[]> {
  const url = "https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/enums.steamd";
  const Commons = (await fetch(url).then((res) => res.text())).split(/\r?\n/);
  if (!Commons || !Commons.length) throw new Error("Failed to fetch EResult");
  return Commons
}


function parseEnums(fileName: string, contents: string[]) {
  let enumName = "";
  let k_lineRegex = new RegExp("");

  // initiate file
  const stream = createWriteStream(LANGUAGE_PATH + fileName + ".ts")
  stream.write("//Auto-generated\n")

  // iterate lines
  for (let line of contents) {
    if (line.includes("import")) continue;

    if (line.includes("enum ")) {
      // get enum name
      line = line.replace(/<\S+>/, ""); // replace <byte> <uint>... etc
      const match = line.match(/(?=[^public])(?=[^enum])\b\S+\b/);
      if (!match) continue;
      enumName = match[0];

      stream.write(`\nexport const ${enumName} = {\n`)

      // build k_lineRegex
      let regexStr = "^(k_?"
      for (const char of enumName) {
        regexStr += char + "?"
      }

      regexStr += ")" + "(_?)"

      k_lineRegex = new RegExp(regexStr);
    }

    if (!enumName) continue;

    // add enum properties to the list

    // enum property line
    if (line.match(/\d+;$/)) {
      // fix case issue in EMsg enum
      if (line.includes("ClientLogOnResponse")) {
        line = line.replace("ClientLogOnResponse", "ClientLogonResponse");
      }

      // remove k_enamName
      line = line.replace(/\t/g, "").trim();
      line = line.replace(k_lineRegex, "")

      // transform to valid js object property
      line = line.replace(/\s?=/, ":");
      line = line.replace(";", ",");

      // fix issues in any of the enums
      if (enumName === "EMsg") {
        line = line.replace("ClientLogOnResponse", "ClientLogonResponse");
      }

      if (enumName === "EClientPersonaStateFlag") {
        line = line.replace('k_EClientPersonaStateGame', "");
      }

      stream.write("\t" + line + "\n")
    }

    // close constant
    if (line.includes("}")) {
      stream.write("};\n");
      enumName = "";
    }

  }

  stream.close();

  // remove file without any enums
  return new Promise(resolve => {
    stream.on("close", () => {
      if (stream.bytesWritten === 17) {
        fs.unlinkSync(LANGUAGE_PATH + fileName + ".ts")
      }
      resolve(null);
    })
  })
}

async function buildTypesFromEnums() {
  // get list of all enum files
  const fileNames = fs.readdirSync("./src/language/");

  for (let fileName of fileNames) {
    let data = "";

    //fileName = fileName.replace(".ts", ".js");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const enumFile = (await import(`../src/language/${fileName}`));
    for (const enumName in enumFile) {
      data += `export default interface ${enumName}\n` + JSON.stringify(enumFile[enumName], null, "\t") + "\n";
    }

    fileName = fileName.replace(".ts", ".d.ts");
    fs.writeFileSync(`./@types/enums/${fileName}`, data)
  }
}
