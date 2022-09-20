import Steam from "../Steam.js";
import { ConnectionOptions } from "../../@types/connection";
import ISteam from "../../@types/steam.js";
import fs from "fs";
import SteamClientError from "../SteamClientError.js";

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

let steam: ISteam;

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

  step("Idle Game", async () => {
    try {
      await steam.client.idleGames([730]);
    } catch (error) {
      if (error.message === "AlreadyPlayingElseWhere") {
        console.log("Playing elsewhere, forcing idle ...");
        await steam.client.idleGames([730], { forcePlay: true });
      }
    }
  });

  step("Change persona state", async () => {
    await steam.client.changeStatus({ personaState: "Invisible" });
  });

  step("Change player name", async () => {
    await steam.client.changeStatus({ playerName: "Machiavelli" });
  });

  step("Change persona state and player name", async () => {
    await steam.client.changeStatus({ playerName: "Machiavelli1", personaState: "Invisible" });
  });

  after(() => steam.disconnect());
});
