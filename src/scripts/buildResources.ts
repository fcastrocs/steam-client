/**
 * Fetch Steam Protos and Language constants
 */

import fs, { createWriteStream } from "fs";
import fetch from "node-fetch";
import extractEnumsAndTypes from "./extractEnumsAndTypes.js";
const PROTOS_PATH = "./protos/";
const HEADER = `/**
 * Auto-generated file
 * ${new Date()}
 */`;

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
  await fetchEResult();
  await fetchEnumsSteamd();
  extractEnumsAndTypes();
  declareEnumConstants();
})();

/**
 * Fetch Protos
 */
async function fetchProtos() {
  const PROTOS_URL = "https://raw.githubusercontent.com/SteamDatabase/Protobufs/master/";
  // fetch steam protos
  for (const proto of PROTOS) {
    let text = await fetch(PROTOS_URL + "steam/" + proto).then((res) => res.text());

    // bug fix, incorrectly named proto
    if (proto === "steammessages_clientserver_login.proto") {
      text = text.replace("CMsgClientLogonResponse", "CMsgClientLogOnResponse");
    }

    if (!text) throw new Error("Failed to fetch proto " + proto);
    fs.writeFileSync(PROTOS_PATH + "steam/" + proto, text);
  }
  // fetch descriptor proto
  const text = await fetch(PROTOS_URL + "google/protobuf/descriptor.proto").then((res) => res.text());
  fs.writeFileSync(PROTOS_PATH + "google/protobuf/descriptor.proto", text);
}

/**
 * Fetch EResult enum
 */
async function fetchEResult() {
  const url = "https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/eresult.steamd";
  const EResult = (await fetch(url).then((res) => res.text())).split(/\r?\n/);
  const stream = createWriteStream("./src/language/EResult.ts");
  stream.write(HEADER + "\n\n");

  for (let line of EResult) {
    if (line.match(/^enum /)) {
      stream.write(line.replace("enum ", "export const ") + " = {\n");
      continue;
    }

    if (line.includes("=") && !line.includes("; removed")) {
      line = line.replace(/\s/g, "").replace("=", ": ").replace(";", ",");
      stream.write(`\t${line}\n`);
    }

    if (line.includes("}")) stream.write(`}\n\n`);
  }
}

async function fetchEnumsSteamd() {
  const url = "https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/enums.steamd";
  const enumsSteamd = (await fetch(url).then((res) => res.text())).split(/\r?\n/);
  const stream = createWriteStream("./src/language/enums.steamd.ts");
  stream.write(HEADER + "\n\n");

  for (let line of enumsSteamd) {
    if (line.match(/^enum /) || line.match("public enum")) {
      line =
        line
          .replace("public enum", "export const ")
          .replace("enum ", "export const ")
          .replace(/ flags$/, "")
          .replace(/<.+>/, "") + " = {\n";
      stream.write(line);
      continue;
    }

    if (line.includes("=") && !line.includes("; removed") && !line.includes("; obsolete") && !line.match(/deprecated/i) && !line.includes("|") && line.match(/=\s\d+;/)) {
      line = line.replace(/\s/g, "").replace("=", ": ").replace(";", ",");

      stream.write(`\t${line}\n`);
    }

    if (line.includes("}")) stream.write(`${line}\n\n`);
  }
}

function declareEnumConstants() {
  const filenames = fs.readdirSync("./src/language/");

  for (const filename of filenames) {
    let file = fs.readFileSync("./src/language/" + filename).toString();
    file = file.replaceAll("export const", "declare const");
    fs.writeFileSync("./@types/language/" + filename.replace(".ts", ".d.ts"), file);
  }
}
