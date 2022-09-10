import fs from "fs";
import fetch from "node-fetch";
import readline from "readline";

const LANGUAGE_PATH = "./src/language/";
const PROTOS_PATH = "./protos/";

const PROTOS = [
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
  // fetch decriptor
  await fetchProtos();
  buildEMsgConstants();
  await buildEResultConstants();
})();

/**
 * Fetch Protos
 */
async function fetchProtos() {
  const PROTOS_URL = "https://raw.githubusercontent.com/SteamDatabase/Protobufs/master/";
  // fetch steam protos
  for (const proto of PROTOS) {
    const text = await fetch(PROTOS_URL + "steam/" + proto).then((res) => res.text());
    fs.writeFileSync(PROTOS_PATH + "steam/" + proto, text);
  }
  // fetch descriptor proto
  const text = await fetch(PROTOS_URL + "google/protobuf/descriptor.proto").then((res) => res.text());
  fs.writeFileSync(PROTOS_PATH + "google/protobuf/descriptor.proto", text);
}

/**
 * Fetch Steam Language
 */
async function buildEResultConstants() {
  const url = "https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/eresult.steamd";
  const text = await fetch(url).then((res) => res.text());
  fs.writeFileSync(LANGUAGE_PATH + "eresult.steamd", text);

  const file = LANGUAGE_PATH + "eresult.steamd";
  const stream = fs.createWriteStream(LANGUAGE_PATH + "EResult.ts");
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
  });
  rl.on("line", (line) => {
    if (line.includes("; removed") || line.includes("; obsolete") || !line) {
      return;
    }
    line = line.replace("enum EResult", "export default");
    line = line.replace("={", "{");
    line = line.replace(" =", ":");
    line = line.replace(";", ",");
    line = line.replace("},", "}");

    stream.write(line + "\n");
  });
  rl.on("close", () => fs.unlinkSync(file));
}

async function buildEMsgConstants() {
  const file = fs.readFileSync(PROTOS_PATH + "steam/" + "enums_clientserver.proto", "utf-8").split(/\r?\n/);

  // load enums into lists
  const lists = new Map();
  let currentList;
  let currKey;

  for (let line of file) {
    // key to list
    if (line.includes("enum ")) {
      line = line.replace("enum ", "");
      line = line.replace(" {", "");

      // skip other enums
      if (line !== "EMsg") break;

      currentList = lists.get(line);
      if (!currentList) {
        currentList = [];
        lists.set(line, currentList);
      }
      currKey = line;
    }
    if (line.includes("	k_")) {
      // fix case issue with protos
      if (line.includes("ClientLogOnResponse")) {
        line = line.replace("ClientLogOnResponse", "ClientLogonResponse");
      }

      line = line.replace("	k_", "\t");
      const regex = new RegExp("^\t" + currKey);
      line = line.replace(regex, "\t");
      line = line.replace(" =", ":");
      line = line.replace(";", ",");
      currentList.push(line);
    }
  }

  // write to file
  for (const [key, properties] of lists) {
    const string = "export default" + " {\n" + properties.join("\n") + "\n}";
    fs.writeFileSync(LANGUAGE_PATH + key + ".ts", string);
  }
}
