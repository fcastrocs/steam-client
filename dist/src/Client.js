import Steam from "./Steam.js";
import { EMsg, EResult, EResultMap } from "./modules/language.js";
import { SteamClientError, isEmpty } from "./modules/common.js";
import { EOSType, EPersonaState } from "../language/enums.steamd.js";
import Long from "long";
export default class Client extends Steam {
    constructor(options) {
        super(options);
        this.personaState = {};
        this.firstPersonaName = "";
        this._playingSessionState = {};
        // catch changes to personaState, playerName or avatar
        this.conn.on("ClientPersonaState", (body) => {
            let assignNewState = false;
            const me = body.friends[0];
            // have never received status
            if (isEmpty(this.personaState) && this.firstPersonaName === me.playerName) {
                assignNewState = true;
            }
            // have received status before
            else if (!isEmpty(this.personaState) && me.friendid.equals(this.personaState.friendid)) {
                assignNewState = true;
            }
            if (assignNewState) {
                this.personaState = me;
                this.personaState.avatarString = this.getAvatar(this.personaState.avatarHash);
                this.emit("ClientPersonaState", this.personaState);
            }
        });
        // emitted after ClientGamesPlayed
        this.conn.on("ClientPlayingSessionState", (body) => {
            this._playingSessionState = body;
            this.emit("ClientPlayingSessionState", body);
        });
        this.conn.on("ClientConcurrentSessionsBase", (body) => {
            this._playingSessionState = body;
            this.emit("ClientPlayingSessionState", body);
        });
        this.conn.on("disconnected", (err) => this.emit("disconnected", err));
    }
    /**
     * login to steam via credentials or refresh_token
     */
    async login(options) {
        // verify refresh token
        if (options.refreshToken) {
            this.verifyRefreshToken(options.refreshToken);
        }
        options = {
            ...options,
            protocolVersion: 65580,
            cellId: 4294967295,
            clientPackageVersion: 1690583737,
            clientLanguage: "english",
            clientOsType: EOSType.Win11,
            shouldRememberPassword: true,
            obfuscatedPrivateIp: {
                ip: {
                    v4: await this.obfustucateIp(),
                },
            },
            qosLevel: 2,
            machineId: options.machineId || this.machineId,
            machineName: options.machineName || this.machineName,
            supportsRateLimitResponse: true,
            priorityReason: 11,
            accessToken: options.refreshToken,
        };
        delete options.refreshToken;
        const accountData = { inventory: {} };
        const accountAuth = {
            machineName: options.machineName,
        };
        let responses = ["ClientAccountInfo", "ClientEmailAddrInfo", "ClientIsLimitedAccount", "ClientVACBanStatus"];
        const receivedResponse = (response) => {
            // remove this response from array
            responses = responses.filter((item) => item !== response);
        };
        this.conn.once("ClientAccountInfo", async (body) => {
            this.firstPersonaName = body.personaName;
            accountData.personaState = await this.setPersonaState(EPersonaState.Online);
            receivedResponse("ClientAccountInfo");
        });
        this.conn.once("ClientEmailAddrInfo", (body) => {
            accountData.isEmailVerified = body.emailIsValidated;
            accountData.emailOrDomain = body.emailAddress;
            accountData.credentialChangeRequiresCode = body.credentialChangeRequiresCode;
            receivedResponse("ClientEmailAddrInfo");
        });
        this.conn.once("ClientIsLimitedAccount", (body) => {
            accountData.limited = body.bisLimitedAccount;
            accountData.communityBanned = body.bisCommunityBanned;
            accountData.locked = body.bisLockedAccount;
            receivedResponse("ClientIsLimitedAccount");
        });
        this.conn.once("ClientVACBanStatus", (body) => {
            accountData.vac = body.vac;
            receivedResponse("ClientVACBanStatus");
        });
        // send login request to steam
        const res = await this.conn.sendProtoPromise(EMsg.ClientLogon, options, EMsg.ClientLogOnResponse);
        if (res.eresult === EResult.OK) {
            accountData.steamId = res.clientSuppliedSteamid.toString();
            accountData.games = await this.service.player.getOwnedGames();
            accountData.inventory.steam = []; //await this.service.econ.getSteamContextItems();
        }
        else {
            this.disconnect();
            throw new SteamClientError(EResultMap.get(res.eresult));
        }
        return new Promise((resolve, reject) => {
            // expect responses to occur before timeout
            const timeout = setTimeout(() => {
                clearInterval(interval);
                this.disconnect();
                reject(new SteamClientError("Did not receive responses: " + responses.toString()));
            }, 15000);
            // check whether user is logged in every second
            const interval = setInterval(() => {
                if (responses.length)
                    return;
                clearTimeout(timeout);
                clearInterval(interval);
                resolve({ auth: accountAuth, data: { ...accountData, playingState: this._playingSessionState } });
            }, 1000);
        });
    }
    /**
     * Change player nickname
     */
    setPlayerName(playerName) {
        return this.changeStatus({ playerName });
    }
    /**
     * Change player persona state
     */
    setPersonaState(personaState) {
        return this.changeStatus({ personaState: personaState });
    }
    /**
     * Idle an array of appIds
     * Empty array stops idling
     * forcePlay truthy kicks another playing session
     */
    async gamesPlayed(gameIds, options) {
        const playingBlocked = this.isPlayingBlocked;
        const playingGame = this.isPlayingGame;
        if (playingBlocked && !options?.forcePlay) {
            throw new SteamClientError("AlreadyPlayingElseWhere");
        }
        // kick another playing session before attemping to play in this session
        if (playingBlocked) {
            this.conn.sendProto(EMsg.ClientKickPlayingSession, { onlyStopGame: true });
        }
        // not playing and trying to stop idle
        if (!playingGame && !gameIds.length) {
            return;
        }
        const body = {
            gamesPlayed: gameIds.map((id) => {
                return { gameId: Long.fromInt(id, true) };
            }),
            clientOsType: EOSType.Win11,
        };
        await this.conn.sendProtoPromise(EMsg.ClientGamesPlayedWithDataBlob, body, EMsg.ClientConcurrentSessionsBase);
    }
    /**
     * Activate free games
     */
    async requestFreeLicense(appids) {
        if (!appids.length)
            return [];
        const res = await this.conn.sendProtoPromise(EMsg.ClientRequestFreeLicense, {
            appids,
        }, EMsg.ClientRequestFreeLicenseResponse);
        if (res.eresult !== EResult.OK) {
            throw new SteamClientError(EResultMap.get(res.eresult));
        }
        if (!res.grantedAppids || !res.grantedAppids.length)
            return [];
        return this.service.player.getOwnedGames({ appidsFilter: res.grantedAppids, includePlayedFreeGames: true });
    }
    /**
     * Whether playing is blocked by another session
     */
    get isPlayingBlocked() {
        return !!this._playingSessionState.playingBlocked;
    }
    /**
     * Whether account is playing a game
     */
    get isPlayingGame() {
        return !!this._playingSessionState.playingApp;
    }
    get playingSessionState() {
        return JSON.parse(JSON.stringify(this._playingSessionState));
    }
    getAvatar(hash) {
        //default avatar
        const defaultHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb";
        let hashHex = hash.toString("hex");
        //default avatar
        if (hashHex === "0000000000000000000000000000000000000000") {
            hashHex = defaultHash;
        }
        return `https://avatars.akamai.steamstatic.com/${hashHex}_full.jpg`;
    }
    /**
     * Change player name or persona state
     */
    async changeStatus(payload) {
        let somethingChanged = false;
        if (this.personaState) {
            if (payload.personaState) {
                // whether a change is being made
                if (payload.personaState !== this.personaState.personaState)
                    somethingChanged = true;
            }
            else {
                // whether a change is being made
                if (payload.playerName !== this.personaState?.playerName)
                    somethingChanged = true;
            }
            // nothing changed return old state
            if (!somethingChanged)
                return this.personaState;
        }
        this.conn.sendProto(EMsg.ClientChangeStatus, payload);
        return new Promise((resolve) => {
            this.once("ClientPersonaState", (state) => {
                return resolve(state);
            });
        });
    }
    verifyRefreshToken(refreshToken) {
        try {
            const headerBase64 = refreshToken.split(".")[1];
            const header = JSON.parse(atob(headerBase64));
            if (header.iss !== "steam" || !header.aud.includes("renew")) {
                throw new SteamClientError("This is not a steam refresh token.");
            }
            if (!header.aud.includes("client")) {
                throw new SteamClientError("This is not a client refresh token.");
            }
            if (header.exp - Math.floor(Date.now() / 1000) < 30) {
                throw new SteamClientError("RefreshTokenExpired");
            }
            // all good supply steamid to base connection
            this.conn.setSteamId(header.sub);
        }
        catch (error) {
            if (error instanceof SteamClientError) {
                throw error;
            }
            throw new SteamClientError("Refresh token is bad.");
        }
    }
}
