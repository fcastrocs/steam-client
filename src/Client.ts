import Long from 'long';
import { ValueOf } from 'type-fest';
import Steam from './Steam.js';
import Language from './modules/language.js';
import { PromiseTimeout, SteamClientError, allWithTimeout, isEmpty } from './modules/common.js';
import { EOSType } from '../resources/language/enums.steamd.js';
import type {
    CMsgClientAccountInfo,
    CMsgClientEmailAddrInfo,
    CMsgClientGamesPlayed,
    CMsgClientIsLimitedAccount,
    CMsgClientLogOnResponse,
    CMsgClientLogon,
    CMsgClientPersonaState,
    CMsgClientPlayingSessionState,
    CMsgClientRequestFreeLicense,
    CMsgClientRequestFreeLicenseResponse,
    CMsgClientVACBanStatus,
    CPlayerGetOwnedGamesResponse,
    ConnectionOptions,
    Friend,
    JsonWebToken,
    LoginOptions,
    SteamAccount
} from '../@types/index.js';

const { EMsg, EResult, EResultMap, EPersonaState } = Language;

export default class Client extends Steam {
    private personaState: Friend = {};

    private playingSessionState: CMsgClientPlayingSessionState = {};

    constructor(options: ConnectionOptions) {
        super(options);

        // catch changes to personaState, playerName or avatar
        this.conn.on('ClientPersonaState', (body: CMsgClientPersonaState) => {
            const me = body.friends[0];

            if (me.friendid.equals(this.steamId)) {
                this.personaState = me;
                this.personaState.avatarString = getAvatar(this.personaState.avatarHash);
                this.emit('ClientPersonaState', this.personaState);
            }
        });

        // emitted after ClientGamesPlayed
        this.conn.on('ClientPlayingSessionState', (body: CMsgClientPlayingSessionState) => {
            this.playingSessionState = body;
            this.emit('ClientPlayingSessionState', body);
        });

        this.conn.on('ClientConcurrentSessionsBase', (body: CMsgClientPlayingSessionState) => {
            this.playingSessionState = body;
            this.emit('ClientPlayingSessionState', body);
        });

        this.conn.on('disconnected', (err) => this.emit('disconnected', err));
    }

    /**
     * login to steam via credentials or refresh_token
     */
    public async login(options: LoginOptions): Promise<SteamAccount> {
        // verify refresh token
        if (options.refreshToken) {
            const token = verifyRefreshToken(options.refreshToken);
            // supply steamid to base connection
            this.conn.setSteamId(token.sub);
        }

        this.rememberedMachine = options.rememberedMachine ? options.rememberedMachine : this.rememberedMachine;

        // configure options
        const logonOptions: CMsgClientLogon = {
            ...options,
            protocolVersion: 65580,
            cellId: 4294967295,
            clientPackageVersion: 1698777785,
            clientLanguage: 'english',
            clientOsType: EOSType.Win11,
            shouldRememberPassword: true,
            // comment this out for now, it's not necessary
            /* obfuscatedPrivateIp: {
                ip: {
                    v4: await this.obfustucateIp(),
                },
            }, */
            qosLevel: 2,
            machineId: this.rememberedMachine.id,
            machineName: this.rememberedMachine.name,
            supportsRateLimitResponse: true,
            priorityReason: 11,
            accessToken: options.refreshToken
        };

        // register all events for SteamAccount properties
        const getClientAccountInfo = new Promise<CMsgClientAccountInfo>((done) => {
            this.conn.once('ClientAccountInfo', async (body) => {
                done(body);
            });
        });

        const getClientEmailAddrInfo = new Promise<CMsgClientEmailAddrInfo>((done) => {
            this.conn.once('ClientEmailAddrInfo', (body) => {
                done(body);
            });
        });

        const getClientIsLimitedAccount = new Promise<CMsgClientIsLimitedAccount>((done) => {
            this.conn.once('ClientIsLimitedAccount', (body) => {
                done(body);
            });
        });

        const ClientVACBanStatus = new Promise<CMsgClientVACBanStatus>((done) => {
            this.conn.once('ClientVACBanStatus', (body) => {
                done(body);
            });
        });

        const getClientPlayingSessionState = new Promise<CMsgClientPlayingSessionState>((done) => {
            this.once('ClientPlayingSessionState', (body) => {
                done(body);
            });
        });

        const setOnlineStatus = () =>
            new Promise<Friend>((done, fail) => {
                this.setPersonaState(EPersonaState.Online)
                    .then((res) => done(res))
                    .catch((error) => fail(error));
            });

        // send login request to steam
        const loginRes: CMsgClientLogOnResponse = await PromiseTimeout(
            this.conn.sendProtoPromise(EMsg.ClientLogon, logonOptions, EMsg.ClientLogOnResponse),
            { ms: this.conn.timeout, timeOutErrMsg: 'ClientLogon took too long' }
        );

        // bad login
        if (loginRes.eresult !== EResult.OK) {
            this.disconnect();
            throw new SteamClientError(EResultMap.get(loginRes.eresult));
        }

        // obtain all SteamAccount properties
        const accountInfo = await allWithTimeout(
            [
                this.service.player.getOwnedGames(),
                this.service.econ.getSteamContextItems(),
                getClientAccountInfo,
                getClientEmailAddrInfo,
                getClientIsLimitedAccount,
                ClientVACBanStatus,
                setOnlineStatus(),
                getClientPlayingSessionState
            ],
            {
                ms: this.conn.timeout,
                timeOutErrMsg: 'Steam failed to send all steam account properties before timeout.'
            }
        );

        const steamAccount: SteamAccount = {
            steamId: loginRes.clientSuppliedSteamid.toString(),
            rememberedMachine: this.rememberedMachine,
            clientLogOnResponse: loginRes,
            ownedGamesResponse: accountInfo[0],
            inventory: {
                steam: accountInfo[1]
            },
            clientAccountInfo: accountInfo[2],
            clientEmailAddrInfo: accountInfo[3],
            clientIsLimitedAccount: accountInfo[4],
            clientVACBanStatus: accountInfo[5],
            clientPersonaState: accountInfo[6],
            clientPlayingSessionState: accountInfo[7]
        };

        return steamAccount;
    }

    /**
     * Change player nickname
     */
    public setPlayerName(playerName: string): Promise<Friend> {
        return this.changeStatus({ playerName });
    }

    /**
     * Change player persona state
     */
    public setPersonaState(personaState: ValueOf<typeof EPersonaState>): Promise<Friend> {
        return this.changeStatus({ personaState });
    }

    /**
     * Idle an array of appIds
     * Empty array stops idling
     * forcePlay truthy kicks another playing session
     */
    public async gamesPlayed(gameIds: number[], options?: { forcePlay?: boolean }): Promise<CMsgClientPlayingSessionState> {
        const playingBlocked = this.isPlayingBlocked;
        const playingGame = this.isPlayingGame;

        if (playingBlocked && !options?.forcePlay) {
            throw new SteamClientError('AlreadyPlayingElseWhere');
        }

        // kick another playing session before attemping to play in this session
        if (playingBlocked) {
            this.conn.sendProto(EMsg.ClientKickPlayingSession, {
                onlyStopGame: true
            });
        }

        // not playing and trying to stop idle
        if (!playingGame && !gameIds.length) {
            throw new SteamClientError('CurrentlyNotPlaying');
        }

        const body: CMsgClientGamesPlayed = {
            gamesPlayed: gameIds.map((id) => ({
                gameId: Long.fromInt(id, true)
            })),
            clientOsType: EOSType.Win11
        };

        const res = await this.conn.sendProtoPromise(EMsg.ClientGamesPlayed, body, EMsg.ClientPlayingSessionState);
        this.playingSessionState = res;
        return res;
    }

    /**
     * Activate free games
     */
    public async requestFreeLicense(appids: number[]): Promise<CPlayerGetOwnedGamesResponse['games']> {
        if (!appids.length) return [];

        const res: CMsgClientRequestFreeLicenseResponse = await this.conn.sendProtoPromise(
            EMsg.ClientRequestFreeLicense,
            {
                appids
            } as CMsgClientRequestFreeLicense,
            EMsg.ClientRequestFreeLicenseResponse
        );

        if (res.eresult !== EResult.OK) {
            throw new SteamClientError(EResultMap.get(res.eresult));
        }

        if (!res.grantedAppids || !res.grantedAppids.length) return [];

        return this.service.player.getOwnedGames({
            appidsFilter: res.grantedAppids,
            includePlayedFreeGames: true
        });
    }

    /**
     * Whether playing is blocked by another session
     */
    public get isPlayingBlocked() {
        return !!this.playingSessionState.playingBlocked;
    }

    /**
     * Whether account is playing a game
     */
    public get isPlayingGame() {
        return !!this.playingSessionState.playingApp;
    }

    public getPlayingSessionState() {
        return { ...this.playingSessionState };
    }

    /**
     * Change player name or persona state
     */
    private async changeStatus(body: { personaState?: ValueOf<typeof EPersonaState>; playerName?: string }): Promise<Friend> {
        let somethingChanged = false;

        //  make sure something is actually changing
        if (!isEmpty(this.personaState)) {
            if (body.personaState) {
                if (body.personaState !== this.personaState.personaState) somethingChanged = true;
            }

            if (body.playerName) {
                if (body.playerName !== this.personaState.playerName) somethingChanged = true;
            }

            // nothing changed return old state
            if (!somethingChanged) return this.personaState;
        }

        const res = await this.conn.sendProtoPromise(EMsg.ClientChangeStatus, body, EMsg.ClientPersonaState);
        const friends = res.friends as Friend[];

        // return the status for this account
        const me = friends.find((friend) => {
            if (friend.friendid.equals(this.steamId)) {
                return friend;
            }
            return null;
        });

        if (me) {
            return me;
        }

        throw new SteamClientError('ClientPersonaState did not return friend status.');
    }
}

function getAvatar(hash: Friend['avatarHash']): string {
    // default avatar
    const defaultHash = 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb';

    let hashHex = hash.toString('hex');

    // default avatar
    if (hashHex === '0000000000000000000000000000000000000000') {
        hashHex = defaultHash;
    }

    return `https://avatars.akamai.steamstatic.com/${hashHex}_full.jpg`;
}

function verifyRefreshToken(refreshToken: string): JsonWebToken {
    try {
        const headerBase64 = refreshToken.split('.')[1];
        const token: JsonWebToken = JSON.parse(atob(headerBase64));

        if (token.iss !== 'steam' || !token.aud.includes('renew')) {
            throw new SteamClientError('This is not a steam refresh token.');
        }

        if (!token.aud.includes('client')) {
            throw new SteamClientError('This is not a client refresh token.');
        }

        if (token.exp - Math.floor(Date.now() / 1000) < 30) {
            throw new SteamClientError('RefreshTokenExpired');
        }

        return token;
    } catch (error) {
        if (error instanceof SteamClientError) {
            throw error;
        }
        throw new SteamClientError('Refresh token is bad.');
    }
}
