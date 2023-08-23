import SteamClient, { SteamClientError } from "../../"
import fs from "fs";
import { describe, it, assert, expect } from 'vitest'
import { EPersonaState } from "../language/commons.js";
import { ConnectionOptions } from "../../@types/connections/Base.js";
import { Confirmation } from "../../@types/protos/auth.protos";
import Long from "long";

//https://api.steampowered.com/ISteamDirectory/GetCMList/v1/?format=json&cellid=0

let auth: {
  accountName: string;
  refreshToken: string;
  accessToken: string;
  machineName: string;
  machineId: Buffer;
};

let steam: SteamClient;

const steamIP_tcp = "162.254.192.71";
const steamPort_tcp = 27017;
const steamIP_ws = "ext4-iad1.steamserver.net";
const steamPort_ws = 27019;

if (fs.existsSync("auth.json")) {
  auth = JSON.parse(fs.readFileSync("auth.json").toString());
  auth.machineId = Buffer.from(auth.machineId as unknown as string, "hex")
}

describe.sequential("Steam-Client", () => {
  describe.sequential("Connection Classes", () => {
    it("Connect to Steam - TCP", async () => await connectToSteam("tcp"));
    it("destroyConnection", () => { steam.conn.destroyConnection() })
    it("Connect to Steam - WS", async () => await connectToSteam("ws"));
  })

  describe.sequential("Client Class", () => {
    it.concurrent("login", async () => await login(), { timeout: 10 * 1000 });
    it.concurrent("ClientPersonaState", async () => {
      await expect(ClientPersonaState()).resolves.not.toThrow()
    })
    it.concurrent("ClientPlayingSessionState", async () => {
      await expect(ClientPlayingSessionState()).resolves.not.toThrow()
    })
    it("isLoggedIn toBeTruthy", () => { expect(steam.isLoggedIn).toBeTruthy() });
    it.concurrent("setPlayerName", async () => await changePlayerName());
    it.concurrent("setPersonaState", async () => await changePersonaState());
    it.concurrent("requestFreeLicense", async () => await requestFreeLicense());
    it("isPlayingGame toBeFalsy", () => { expect(steam.isPlayingGame).toBeFalsy() })
    it("gamesPlayed", async () => await gamesPlayed());
    it("isPlayingGame toBeTruthy", () => { expect(steam.isPlayingGame).toBeTruthy() })
  })

  describe.sequential("Steam Class", () => {
    it("get obfustucatedIp", () => {
      expect(steam.obfustucatedIp).toBeDefined();
      expect(steam.obfustucatedIp).toBeGreaterThan(0)
    })
    it("get SteamId", () => {
      expect(steam.steamId).not.toBe(Long.fromString("76561197960265728", true))
    })
  })

  describe.sequential("Player Service", () => {
    it("getOwnedGames", async () => {
      const games = await steam.service.player.getOwnedGames();
      expect(Array.isArray(games)).toBeTruthy();
      expect(games.length).toBeGreaterThan(0);
      expect(games[0]).toHaveProperty("gameid")
    })
  })

  describe.sequential("Econ Service", () => {
    it("getSteamContextItems", async () => {
      const items = await steam.service.econ.getSteamContextItems();
      expect(Array.isArray(items)).toBeTruthy();
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].contextid).toBe('6');
    })
  })

  describe.sequential("Credentials Service", () => {
    it("getSteamGuardDetails", async () => {
      const details = await steam.service.credentials.getSteamGuardDetails();
      expect(details.EResult).toBe(1);
      expect(details.isSteamguardEnabled).toBeTruthy();
    })
  })

  describe.sequential("Auth Service", async () => {
    it("accessTokenGenerateForApp", async () => await accessTokenGenerateForApp())
  })

  describe.sequential("Client Class continued", () => {
    it.concurrent("disconnect", () => { steam.conn.destroyConnection(new SteamClientError("simulation")) });
    it.concurrent("disconnected event", () => {
      steam.on("disconnected", error => {
        expect(error.message).toBe("simulation")
      })
    });
    it("isLoggedIn toBeFalsy", () => { expect(steam.isLoggedIn).toBeFalsy() });
  })

  // it("Get tokens via QR Code", async () => await getAuthTokensViaQR(), { timeout: 1 * 60 * 1000 });
  // //it("Get tokens via credentials", async () => await getAuthTokensViaCredentials(), { timeout: 1 * 60 * 1000 });
});

/**
 * Test ClientPersonaState returns account's state correctly
 */
const ClientPersonaState = () => {
  return new Promise((resolve, reject) => {
    steam.once("ClientPersonaState", (state) => {
      try {
        expect(state.playerName).toBe("Machiavelli")
      } catch (error) {
        reject(error);
      }
      resolve(true)
    })
  })
}

/**
 * Test ClientPlayingSessionState has the correct properties
 */
const ClientPlayingSessionState = () => {
  return new Promise((resolve, reject) => {
    steam.once("ClientPlayingSessionState", (state) => {
      try {
        expect(state).toHaveProperty("playingApp");
        expect(state).toHaveProperty("playingBlocked");
      } catch (error) {
        reject(error);
      }
      resolve(true)
    })
  })
}

const connectToSteam = async (type: ConnectionOptions["type"]) => {
  let steamCM;
  const timeout = 15000;

  if (type === "tcp") {
    steamCM = { host: steamIP_tcp, port: steamPort_tcp };
  } else if (type === "ws") {
    steamCM = { host: steamIP_ws, port: steamPort_ws };
  }

  const options: ConnectionOptions = { steamCM, timeout, type };
  steam = new SteamClient(options);
  await steam.conn.connect();
}

const getAuthTokensViaQR = async () => {
  // auth was preloaded
  if (auth) return;

  steam.service.auth.on("waitingForConfirmation", (res: Confirmation) => console.log(res.qrCode?.terminal));
  steam.service.auth.getAuthTokensViaQR();

  return new Promise((resolve, reject) => {
    // catch and save authTokens
    steam.service.auth.on("authTokens", authTokens => {
      auth = {
        accountName: authTokens.accountName,
        refreshToken: authTokens.refreshToken,
        accessToken: authTokens.accessToken,
        machineName: steam.machineName,
        machineId: steam.machineId,
      } as typeof auth;
      fs.writeFileSync("auth.json", JSON.stringify({ ...auth, machineId: auth.machineId.toString("hex") }));
      resolve("success");
    });

    steam.service.auth.on("getAuthTokensTimeout", reject)
  })

}

const getAuthTokensViaCredentials = async () => {
  // auth was preloaded

  steam.service.auth.on("waitingForConfirmation", (res: Confirmation) => console.log(res));
  steam.service.auth.getAuthTokensViaCredentials("sky111222333@hotmail.com", "Chivas10@");

  return new Promise((resolve, reject) => {
    steam.service.auth.on("authTokens", authTokens => {
      auth = {
        accountName: authTokens.accountName,
        machineName: steam.machineName,
        refreshToken: authTokens.refreshToken,
      } as typeof auth;
      fs.writeFileSync("auth.json", JSON.stringify(auth));
      resolve("success");
    });

    steam.service.auth.on("getAuthTokensTimeout", reject)
  })

}

const login = async () => {
  return steam.login({
    refreshToken: auth.refreshToken,
    machineName: auth.machineName,
    machineId: auth.machineId
  })
}

const gamesPlayed = async () => {
  try {
    return steam.gamesPlayed([730]);
  } catch (error) {
    if (error.message === "AlreadyPlayingElseWhere") {
      console.log("Playing elsewhere, forcing idle ...");
      return steam.gamesPlayed([730], { forcePlay: false });
    }
  }

  return new Promise((resolve) => {
    steam.once("ClientPlayingSessionState", state => {
      expect(state.playingApp).toBe(730);
      resolve("");
    })
  })
}

const changePlayerName = async () => {
  const res = await steam.setPlayerName("Machiavelli");
  assert.equal(res.playerName, "Machiavelli");
}

const changePersonaState = async () => {
  const res = await steam.setPersonaState("Invisible");
  assert.equal(res.personaState, EPersonaState.Invisible);
}

const requestFreeLicense = async () => {
  // tf2
  let games = await steam.requestFreeLicense([1449850, -12312]);
  assert.equal(games.length, 1);
  // non-existent game
  games = await steam.requestFreeLicense([-12312]);
  assert.equal(games.length, 0);
}

const accessTokenGenerateForApp = async () => {
  const res = await steam.service.auth.accessTokenGenerateForApp(auth.refreshToken);
  expect(res.accessToken).toBeDefined();
  auth.accessToken = res.accessToken;
  fs.writeFileSync("auth.json", JSON.stringify(auth));
}

  // it("registerKey", async () => {
  //   const res = await steam.client.registerKey("");
  //   console.log(res);

  //   assert.equal(res.length, 1);
  // });