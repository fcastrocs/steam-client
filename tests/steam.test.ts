import SteamClient, { Confirmation, Language, SteamConnectionOptions } from '../';
import fs from 'fs';
import { describe, it, assert, expect, test } from 'vitest';
import { ValueOf } from 'type-fest';
import Long from 'long';

const steamCM = { host: 'cmp2-iad1.steamserver.net', port: 27018 };

type Auth = {
    accountName: string;
    refreshToken: string;
    accessToken: string;
    machineName: string;
    machineId: Buffer;
};

let auth = {} as Auth;
let steam: SteamClient;

if (fs.existsSync('auth.json')) {
    auth = JSON.parse(fs.readFileSync('auth.json').toString());
    auth.machineId = Buffer.from(auth.machineId as unknown as string, 'hex');
}

describe.sequential('Steam-Client', () => {
    it('connection', async () => await connectToSteam());

    it('QR Code', { timeout: 10000 }, async () => await getAuthTokensViaQR());

    //it("Get tokens via credentials", getAuthTokensViaCredentials, { timeout: 1 * 60 * 1000 });

    it('login', { timeout: 17 * 1000 }, login);

    // it('get SteamId', () => {
    //     expect(steam.steamId).not.toBe(Long.fromString('76561197960265728', true));
    // });

    // it('setPlayerName', async () => {
    //     changePlayerName('Makiaveli');
    //     await ClientPersonaState('Makiaveli');
    //     changePlayerName('Machiavelli');
    //     await ClientPersonaState('Machiavelli');
    // });

    // it('setPersonaState', async () => {
    //     await changePersonaState(Language.EPersonaState.Invisible);
    // });

    // it.concurrent('gamesPlayed', gamesPlayed);

    // it.concurrent('requestFreeLicense', requestFreeLicense);
});

// describe.sequential('Player Service', () => {
//     it('getOwnedGames', async () => {
//         const games = await steam.player.getOwnedGames();
//         expect(games).toBeDefined();
//         expect(Array.isArray(games)).toBeTruthy();
//         expect(games!.length).toBeGreaterThan(0);
//         expect(games![0]).toHaveProperty('gameid');
//     });
// });

// describe.sequential('Econ Service', () => {
//     it('getSteamContextItems', async () => {
//         const items = await steam.econ.getSteamContextItems();
//         expect(Array.isArray(items)).toBeTruthy();
//         // expect(items.length).toBeGreaterThan(0);
//         // expect(items[0].contextid).toBe("6");
//     });
// });

// describe.sequential('Credentials Service', () => {
//     it('getSteamGuardDetails', async () => {
//         const details = await steam.credentials.getSteamGuardDetails();
//         expect(details.isSteamguardEnabled).toBeTruthy();
//     });
// });

// describe.sequential('Auth Service', async () => {
//     it('accessTokenGenerateForApp', accessTokenGenerateForApp);
// });

// describe.sequential('Client Class continued', () => {
//     it.concurrent('disconnect', () => {
//         steam.disconnect();
//     });

//     it.concurrent('disconnected event', () => {
//         steam.on('disconnected', (err) => {
//             expect(err).toBe(undefined);
//         });
//     });
//     it('isLoggedIn toBeFalsy', () => {
//         expect(steam.isLoggedIn).toBeFalsy();
//     });
// });

const connectToSteam = async () => {
    steam = new SteamClient();
    const options: SteamConnectionOptions = { steamCM, timeout: 15000 };
    await steam.connect(options);
};

const getAuthTokensViaQR = async () => {
    if (auth.accountName) return;

    steam.on('waitingForConfirmation', (res: Confirmation) => {
        expect(res.qrCode?.terminal).toBeDefined();
        expect(res.qrCode?.image).toBeDefined();

        console.log(res.qrCode?.terminal);
    });

    steam.auth.getAuthTokensViaQR();

    return new Promise((resolve, reject) => {
        // catch and save authTokens
        steam.on('authTokens', (authTokens) => {
            auth = {
                accountName: authTokens.accountName,
                refreshToken: authTokens.refreshToken,
                accessToken: authTokens.accessToken,
                machineName: steam.rememberedMachine.name,
                machineId: steam.rememberedMachine.id
            } as typeof auth;
            fs.writeFileSync(
                'auth.json',
                JSON.stringify({
                    ...auth,
                    machineId: auth.machineId.toString('hex')
                })
            );
            resolve('success');
        });
    });
};

const login = async () => {
    const res = await steam.login({
        refreshToken: auth.refreshToken,
        rememberedMachine: {
            name: auth.machineName,
            id: auth.machineId
        }
    });

    expect(res.clientAccountInfo).toBeDefined();
    expect(res.clientEmailAddrInfo).toBeDefined();
    expect(res.clientIsLimitedAccount).toBeDefined();
    expect(res.clientVACBanStatus).toBeDefined();
    expect(res.clientPersonaState).toBeDefined();
    expect(res.clientPlayingSessionState).toBeDefined();
    expect(res.ownedGamesResponse).toBeInstanceOf(Array);
    expect(res.steamId).toBeDefined();
    expect(res.rememberedMachine).toBeDefined();
    expect(res.rememberedMachine.name).toHaveLength(18);
    expect(res.rememberedMachine.id).toBeInstanceOf(Buffer);
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
        steam.once('PersonaState', (state) => {
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
        steam.once('PlayingSessionState', (state) => {
            expect(state).toHaveProperty('playingApp');
            expect(state).toHaveProperty('playingBlocked');
            expect(state.playingApp).toBe(440);
            resolve(state);
        });

        try {
            await steam.gamesPlayed([440]);
        } catch (error) {
            if (error.message === 'AlreadyPlayingElseWhere') {
                console.log('Playing elsewhere, forcing idle ...');
                await steam.gamesPlayed([440], { forcePlay: false });
            } else {
                throw error;
            }
        }
    });
};

const getAuthTokensViaCredentials = async () => {
    // auth was preloaded

    steam.on('waitingForConfirmation', (res: Confirmation) => console.log(res));
    steam.auth.getAuthTokensViaCredentials('', '');

    return new Promise((resolve, reject) => {
        steam.on('authTokens', (authTokens) => {
            auth = {
                accountName: authTokens.accountName,
                machineName: steam.rememberedMachine.name,
                refreshToken: authTokens.refreshToken
            } as typeof auth;
            fs.writeFileSync('auth.json', JSON.stringify(auth));
            resolve('success');
        });

        steam.on('getAuthTokensTimeout', reject);
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
    const res = await steam.auth.accessTokenGenerateForApp(auth.refreshToken);
    expect(res.accessToken).toBeDefined();
    auth.accessToken = res.accessToken!;
    fs.writeFileSync('auth.json', JSON.stringify(auth));
};
