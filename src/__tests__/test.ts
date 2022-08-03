import { Options } from "../../@types";
import Steam from "../app.js";
import assert from "assert";

//https://api.steampowered.com/ISteamDirectory/GetCMList/v1/?format=json&cellid=0

const steamCM = { host: "162.254.192.71", port: 27017 };
const timeout = 10000;
let steam: Steam = null;
const accountName = "";
const password = "";

describe("steam-client", () => {
  // connect to steam
  step("should connect to steam", async () => {
    const options: Options = { steamCM, timeout };
    steam = new Steam(options);
    await steam.connect();
  });

  // test login
  step("login", async () => {
    await steam.login({ accountName, password });
  });

  it("cdkeyRedeem", async () => {
    await assert.rejects(steam.cdkeyRedeem("76CPE-E4CYG-5DXDG"), (err: Error) => {
      assert.equal(err.name, "steam-client");
      assert.equal(err.message, "DuplicateActivationCode");
      return true;
    });
  });

  it("getWebNonce - should return a string of length 19", async () => {
    const nonce = await steam.getWebNonce();
    assert.equal(nonce.length, 19);
  });

  it("changeName", () => {
    const name = "Someone" + Math.floor(Math.random() * 20);
    steam.changePlayerName(name);
  });

  it("changePersonaState", () => steam.changePersonaState("snooze"));

  it("idleGames", () => steam.idleGames([440]));

  it("activateFreeToPlayGames", async () => {
    const games = await steam.activateFreeToPlayGames([570, 440, 730]);

    const gameIds = games.map((game) => {
      return game.gameid;
    });
    assert.equal(gameIds.includes(570), true);
    assert.equal(gameIds.includes(440), true);
    assert.equal(gameIds.includes(730), true);
  });

  it("getPackagesInfo", async () => {
    const res = await steam.getPackagesInfo([1]);
    assert.equal(res[0].appids.includes(10), true);
    assert.equal(res[0].appids.includes(20), true);
    assert.equal(res[0].appids.includes(30), true);
  });

  it("getAppsInfo", async () => {
    const res = await steam.getAppsInfo([10]);
    assert.equal(res[0].name, "Counter-Strike");
  });

  after(() => steam.disconnect());
});
