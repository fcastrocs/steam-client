import Steam, { SteamClientError } from "../Steam.js";
import fs from "fs";
import assert from "assert";
import { Language } from "../resources.js";
import { ConnectionOptions } from "../../@types/connection.js";

//https://api.steampowered.com/ISteamDirectory/GetCMList/v1/?format=json&cellid=0

let auth: {
  accountName: string;
  machineName: string;
  refreshToken: string;
};

let steam: Steam;

const steamIP = "162.254.192.71";
const steamPort = 27017;

describe("Test steam-client", () => {
  before("Load auth.json", () => {
    if (fs.existsSync("auth.json")) {
      auth = JSON.parse(fs.readFileSync("auth.json").toString());
    }
  });

  step("Connect to Steam", async () => {
    const steamCM = { host: steamIP, port: steamPort };
    const timeout = 15000;

    const options: ConnectionOptions = { steamCM, timeout };
    steam = new Steam(options);
    await steam.connect();
  });

  // login via QR
  step("loginViarQR()", async () => {
    // auth was preloaded
    if (auth) return;

    steam.on("waitingForConfirmation", (res) => console.log(res.qrCode));

    const authTokens = await steam.service.auth.getAuthTokensViaQR("terminal");

    // attempt login
    const res = await steam.login({
      accountName: authTokens.accountName,
      refreshToken: authTokens.refreshToken,
    });

    auth = {
      accountName: authTokens.accountName,
      machineName: authTokens.machineName,
      refreshToken: authTokens.refreshToken,
    } as typeof auth;

    fs.writeFileSync("auth.json", JSON.stringify(auth));
  });

  step("login", async () => {
    if (!auth) {
      throw new SteamClientError("No credentials.");
    }

    // already logged in
    if (steam.isLoggedIn) return;

    await steam.login({
      accountName: auth.accountName,
      refreshToken: auth.refreshToken,
      machineName: auth.machineName,
    });
  });

  it("gamesPlayed", async () => {
    try {
      await steam.client.gamesPlayed([730]);
    } catch (error) {
      if (error.message === "AlreadyPlayingElseWhere") {
        console.log("Playing elsewhere, forcing idle ...");
        await steam.client.gamesPlayed([730], { forcePlay: false });
      }
    }
  });

  it("changeStatus", async () => {
    // change player name
    let res = await steam.client.setPlayerName("Machiavelli");
    assert.equal(res.playerName, "Machiavelli");

    // change both
    res = await steam.client.setPersonaState("Invisible");
    assert.equal(res.personaState, Language.EPersonaState.Invisible);
  });

  it("requestFreeLicense", async () => {
    // tf2
    let games = await steam.client.requestFreeLicense([1449850, -12312]);
    assert.equal(games.length, 1);
    // non-existent game
    games = await steam.client.requestFreeLicense([-12312]);
    assert.equal(games.length, 0);
  });

  it("registerKey", async () => {
    const res = await steam.client.registerKey("");
    console.log(res);

    assert.equal(res.length, 1);
  });

  after(() => {
    if (steam) steam.disconnect();
  });
});
