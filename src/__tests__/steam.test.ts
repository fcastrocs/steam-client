import SteamClient from "../../"
import fs from "fs";
import { describe, it, afterAll, assert } from 'vitest'
import { EPersonaState } from "../language/commons.js";
import { ConnectionOptions } from "../../@types/connections/Base.js";
import { Confirmation } from "../../@types/protos/auth";

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

describe.sequential("Test steam-client - TCP", () => {
  it("Connect to Steam", async () => await connectToSteam("tcp"));
  it("Get tokens via QR Code", async () => await getAuthTokensViaQR(), { timeout: 1 * 60 * 1000 });
  //it("Get tokens via credentials", async () => await getAuthTokensViaCredentials(), { timeout: 1 * 60 * 1000 });
  it("login", async () => await login(), { timeout: 15 * 1000 });
  //it("accessTokenGenerateForApp", async () => await accessTokenGenerateForApp());
  //it.concurrent("getSteamGuardDetails", async () => await getSteamGuardDetails());
  it.concurrent("Get games", async () => await getGames());
  it.concurrent("gamesPlayed", async () => await gamesPlayed());
  it.concurrent("changePlayerName", async () => await changePlayerName());
  it.concurrent("changePersonaState", async () => await changePersonaState());
  it.concurrent("requestFreeLicense", async () => await requestFreeLicense());
  afterAll(() => {
    if (steam) steam.disconnect();
  });
});

// describe.sequential("Test steam-client - WS", () => {
//   it("Connect to Steam", async () => await connectToSteam("ws"));
//   it("Get tokens via QR Code", async () => await getAuthTokensViaQR(), { timeout: 2 * 60 * 1000 });
//   it("login", async () => await login(), { timeout: 15 * 1000 });
//   it.concurrent("Get games", async () => await getGames());
//   it.concurrent("gamesPlayed", async () => await gamesPlayed());
//   it.concurrent("changePlayerName", async () => await changePlayerName());
//   it.concurrent("changePersonaState", async () => await changePersonaState());
//   it.concurrent("requestFreeLicense", async () => await requestFreeLicense());
//   afterAll(() => {
//     if (steam) steam.disconnect();
//   });
// });


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

const getGames = async () => {
  return steam.service.player.getOwnedGames()
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

const getSteamGuardDetails = async () => {
  await steam.service.credentials.getSteamGuardDetails();
}

const accessTokenGenerateForApp = async () => {
  const res = await steam.service.auth.accessTokenGenerateForApp(auth.refreshToken);
  console.log(res);
}


  // it("registerKey", async () => {
  //   const res = await steam.client.registerKey("");
  //   console.log(res);

  //   assert.equal(res.length, 1);
  // });