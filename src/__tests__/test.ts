import Steam from "../Steam.js";
import assert from "assert";
import { ConnectionOptions } from "../../@types/connection";
import ISteam from "../../@types/steam.js";

//https://api.steampowered.com/ISteamDirectory/GetCMList/v1/?format=json&cellid=0

const steamCM = { host: "162.254.192.71", port: 27017 };
const timeout = 15000;
let steam: ISteam = null;

describe("Test steam-client", () => {
  step("connect() should throw SteamClientError", async () => {
    steam = new Steam({ steamCM: { host: "0.0.0.0", port: 0 }, timeout });
    await assert.rejects(steam.connect(), (err: Error) => {
      assert.equal(err.name, "steam-client");
      return true;
    });

    // test with proxy
    steam = new Steam({ steamCM, timeout, proxy: { host: "0.0.0.0", port: 0, type: 4 } });
    await assert.rejects(steam.connect(), (err: Error) => {
      assert.equal(err.name, "steam-client");
      return true;
    });
  });

  // connect to steam
  step("connect()", async () => {
    const options: ConnectionOptions = { steamCM, timeout };
    steam = new Steam(options);
    await steam.connect();
  });

  step("loginViarQR()", async () => {
    steam.on("waitingForConfirmation", (res) => {
      console.log(res.qrCode);
    });

    const authTokens = await steam.service.auth.getAuthTokensViaQR("terminal");
    console.log(authTokens);

    const res = await steam.login({ accountName: "", accessToken: authTokens.refreshToken });
    console.log(res);
  });

  after(() => steam.disconnect());
});
