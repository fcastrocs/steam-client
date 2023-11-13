import SteamClient, { Language } from "../";
import fs from "fs";
import { describe, it, assert, expect } from "vitest";
import { ConnectionOptions } from "../@types/connections/Base";
import { Confirmation } from "../@types/services/Auth";
import { ValueOf } from "type-fest";

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
    auth.machineId = Buffer.from(auth.machineId as unknown as string, "hex");
}

describe.sequential("Steam-Client", () => {
    /**
     * Test Steam connection
     */
    describe.sequential("Connection", () => {
        it("TCP", async () => {
            await connectToSteam("tcp");
        });

        it("destroyConnection", () => {
            steam.conn.destroyConnection();
        });

        it("WS", async () => {
            await connectToSteam("ws");
        });
    });

    /**
     * Get auth via QR
     */
    describe.sequential("Auth", () => {
        it("QR Code", async () => await getAuthTokensViaQR(), { timeout: 1 * 60 * 1000 });
    });

    /**
     * Test client class
     */
    describe.sequential("Client Class", () => {
        it("login", async () => await login(), { timeout: 17 * 1000 });

        it("setPlayerName", async () => {
            changePlayerName("Makiaveli");
            await ClientPersonaState("Makiaveli");
            changePlayerName("Machiavelli");
            await ClientPersonaState("Machiavelli");
        });

        it("setPersonaState", async () => {
            await changePersonaState(Language.EPersonaState.Invisible);
        });

        it.concurrent("gamesPlayed", async () => await gamesPlayed());

        it.concurrent("requestFreeLicense", async () => await requestFreeLicense());
    });

    // describe.sequential("Steam Class", () => {
    //   it("get obfustucatedIp", () => {
    //     expect(steam.obfustucatedIp).toBeDefined();
    //     expect(steam.obfustucatedIp).toBeGreaterThan(0)
    //   })
    //   it("get SteamId", () => {
    //     expect(steam.steamId).not.toBe(Long.fromString("76561197960265728", true))
    //   })
    // })

    describe.sequential("Player Service", () => {
        it("getOwnedGames", async () => {
            const games = await steam.service.player.getOwnedGames();
            expect(games).toBeDefined();
            expect(Array.isArray(games)).toBeTruthy();
            expect(games!.length).toBeGreaterThan(0);
            expect(games![0]).toHaveProperty("gameid");
        });
    });

    describe.sequential("Econ Service", () => {
        it("getSteamContextItems", async () => {
            const items = await steam.service.econ.getSteamContextItems();
            expect(Array.isArray(items)).toBeTruthy();
            expect(items.length).toBeGreaterThan(0);
            expect(items[0].contextid).toBe("6");
        });
    });

    describe.sequential("Credentials Service", () => {
        it("getSteamGuardDetails", async () => {
            const details = await steam.service.credentials.getSteamGuardDetails();
            expect(details.isSteamguardEnabled).toBeTruthy();
        });
    });

    describe.sequential("Auth Service", async () => {
        it("accessTokenGenerateForApp", async () => await accessTokenGenerateForApp());
    });

    // describe.sequential("Client Class continued", () => {
    //     it.concurrent("disconnect", () => {
    //         steam.conn.destroyConnection(new SteamClientError("simulation"));
    //     });
    //     it.concurrent("disconnected event", () => {
    //         steam.on("disconnected", (error) => {
    //             expect(error.message).toBe("simulation");
    //         });
    //     });
    //     it("isLoggedIn toBeFalsy", () => {
    //         expect(steam.isLoggedIn).toBeFalsy();
    //     });
    // });

    //it("Get tokens via credentials", async () => await getAuthTokensViaCredentials(), { timeout: 1 * 60 * 1000 });
});

const connectToSteam = async (type: ConnectionOptions["type"]) => {
    let steamCM;
    let proxy: ConnectionOptions["proxy"];
    const timeout = 15000;

    if (type === "tcp") {
        steamCM = { host: steamIP_tcp, port: steamPort_tcp };
    } else if (type === "ws") {
        steamCM = { host: steamIP_ws, port: steamPort_ws };
        // proxy = { type: "", host: "", port: 0, user: "", pass: "" };
    }
    const options: ConnectionOptions = { steamCM, timeout, type, proxy };
    steam = new SteamClient(options);
    await steam.conn.connect();
};

const getAuthTokensViaQR = async () => {
    if (auth.accountName) return;

    steam.service.auth.on("waitingForConfirmation", (res: Confirmation) => {
        expect(res.qrCode?.terminal).toBeDefined();
        expect(res.qrCode?.image).toBeDefined();

        console.log(res.qrCode?.terminal);
    });

    steam.service.auth.getAuthTokensViaQR();

    return new Promise((resolve, reject) => {
        // catch and save authTokens
        steam.service.auth.on("authTokens", (authTokens) => {
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

        steam.service.auth.on("getAuthTokensTimeout", reject);
    });
};

const login = async () => {
    const res = await steam.login({
        refreshToken: auth.refreshToken,
        machineName: auth.machineName,
        machineId: auth.machineId,
    });

    // console.log(res.clientAccountInfo);
    // console.log(res.clientEmailAddrInfo);
    // console.log(res.clientIsLimitedAccount);
    // console.log(res.clientVACBanStatus);
    // console.log(res.clientPersonaState);
    // console.log(res.clientPlayingSessionState);
    // console.log(res.steamId);
    // console.log(res.games)
    // console.log(res.inventory);
    // console.log(res.machineName);
    // console.log(res.machineId);

    expect(res.clientAccountInfo).toBeDefined();
    expect(res.clientEmailAddrInfo).toBeDefined();
    expect(res.clientIsLimitedAccount).toBeDefined();
    expect(res.clientVACBanStatus).toBeDefined();
    expect(res.clientPersonaState).toBeDefined();
    expect(res.clientPlayingSessionState).toBeDefined();
    expect(res.steamId).toHaveLength(17);
    expect(res.games).toBeInstanceOf(Array);
    expect(res.inventory).toBeDefined();
    expect(res.inventory).toHaveProperty("steam");
    expect(res.inventory.steam).toBeInstanceOf(Array);
    expect(res.machineName).toHaveLength(18);
    expect(res.machineId).toBeInstanceOf(Buffer);
    expect(steam.isLoggedIn).toBeTruthy();
};

const changePlayerName = async (playerName: string) => {
    const res = await steam.setPlayerName(playerName);
    expect(res.playerName).toBe(playerName);
};

const changePersonaState = async (state: ValueOf<typeof Language.EPersonaState>) => {
    const res = await steam.setPersonaState(state);
    expect(res.personaState).toBe(state);
};

const ClientPersonaState = (playerName: string) => {
    return new Promise((resolve, reject) => {
        steam.once("ClientPersonaState", (state) => {
            try {
                expect(state.playerName).toBe(playerName);
            } catch (error) {
                reject(error);
            }
            resolve(state);
        });
    });
};

const gamesPlayed = async () => {
    expect(steam.isPlayingGame).toBeFalsy();

    return new Promise(async (resolve) => {
        steam.once("ClientPlayingSessionState", (state) => {
            expect(state).toHaveProperty("playingApp");
            expect(state).toHaveProperty("playingBlocked");
            expect(state.playingApp).toBe(440);
            resolve(state);
        });

        try {
            await steam.gamesPlayed([440]);
        } catch (error) {
            if (error.message === "AlreadyPlayingElseWhere") {
                console.log("Playing elsewhere, forcing idle ...");
                await steam.gamesPlayed([440], { forcePlay: false });
            } else {
                throw error;
            }
        }
    });
};

const getAuthTokensViaCredentials = async () => {
    // auth was preloaded

    steam.service.auth.on("waitingForConfirmation", (res: Confirmation) => console.log(res));
    steam.service.auth.getAuthTokensViaCredentials("", "");

    return new Promise((resolve, reject) => {
        steam.service.auth.on("authTokens", (authTokens) => {
            auth = {
                accountName: authTokens.accountName,
                machineName: steam.machineName,
                refreshToken: authTokens.refreshToken,
            } as typeof auth;
            fs.writeFileSync("auth.json", JSON.stringify(auth));
            resolve("success");
        });

        steam.service.auth.on("getAuthTokensTimeout", reject);
    });
};

const requestFreeLicense = async () => {
    // tf2
    let games = await steam.requestFreeLicense([440, -12312]);
    assert.equal(games!.length, 1);
    // non-existent game
    games = await steam.requestFreeLicense([-12312]);
    assert.equal(games!.length, 0);
};

const accessTokenGenerateForApp = async () => {
    const res = await steam.service.auth.accessTokenGenerateForApp(auth.refreshToken);
    expect(res.accessToken).toBeDefined();
    auth.accessToken = res.accessToken!;
    fs.writeFileSync("auth.json", JSON.stringify(auth));
};

// it("registerKey", async () => {
//   const res = await steam.client.registerKey("");
//   console.log(res);

//   assert.equal(res.length, 1);
// });
