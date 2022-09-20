import Steam from "../Steam.js";
import { ConnectionOptions } from "../../@types/connection";
import fs from "fs";
import SteamClientError from "../SteamClientError.js";
import assert from "assert";
import { Language } from "../resources.js";

//https://api.steampowered.com/ISteamDirectory/GetCMList/v1/?format=json&cellid=0

let auth: {
  accountName: string;
  machineName: string;
  machineId: Buffer;
  machineIdHex: string;
  refreshToken: string;
  sentry: Buffer;
  sentryHex: string;
};

let steam: Steam;

describe("Test steam-client", () => {
  before("Load auth.json", () => {
    if (fs.existsSync("auth.json")) {
      auth = JSON.parse(fs.readFileSync("auth.json").toString());
      auth.sentry = Buffer.from(auth.sentryHex, "hex");
      auth.machineId = Buffer.from(auth.machineIdHex, "hex");
    }
  });

  step("Connect to Steam", async () => {
    const steamCM = { host: "162.254.192.71", port: 27017 };
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
    const res = await steam.login({
      accountName: authTokens.accountName,
      accessToken: authTokens.refreshToken,
      shouldRememberPassword: true,
    });

    const sentryHex = res.auth.sentry.toString("hex");
    const machineIdHex = res.auth.machineId.toString("hex");

    auth = {
      accountName: authTokens.accountName,
      machineName: authTokens.machineName,
      refreshToken: authTokens.refreshToken,
      sentryHex,
      machineIdHex,
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
      accessToken: auth.refreshToken,
      shouldRememberPassword: true,
      shaSentryfile: auth.sentry,
      machineId: auth.machineId,
      machineName: auth.machineName,
    });
  });

  step("gamesPlayed", async () => {
    try {
      await steam.client.gamesPlayed([730]);
    } catch (error) {
      if (error.message === "AlreadyPlayingElseWhere") {
        console.log("Playing elsewhere, forcing idle ...");
        await steam.client.gamesPlayed([730], { forcePlay: true });
      }
    }
  });

  step("changeStatus", async () => {
    // change player name
    let res = await steam.client.setPlayerName("Machiavelli");
    assert.equal(res.playerName, "Machiavelli");

    // change both
    res = await steam.client.setPersonaState("Invisible");
    assert.equal(res.personaState, Language.EPersonaState.Invisible);
  });

  step("requestFreeLicense", async () => {
    // tf2
    let games = await steam.client.requestFreeLicense([440, -12312]);
    assert.equal(games.length, 1);
    // non-existent game
    games = await steam.client.requestFreeLicense([-12312]);
    assert.equal(games.length, 0);
  });

  after(() => steam.disconnect());
});
