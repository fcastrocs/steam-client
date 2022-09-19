/**
 * Manages high-level Steam operations
 *
 * Emits the following:
 * 'disconnected' when connection is lost.
 * 'loginkey' loginkey when it is accepted.
 *
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
const VDF = require("vdf");
import SteamCrypto from "@machiavelli/steam-client-crypto";
import Connection from "./Connection.js";
import Auth from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Actions from "./Actions.js";
import { Language } from "./resources.js";
import SteamClientError from "./SteamClientError.js";
export default class Steam extends Connection {
    service;
    action;
    machineName;
    loggedIn = false;
    playingBlocked = false;
    constructor(options) {
        super(options);
        // inject dependencies
        this.service = {
            auth: new Auth(this),
            credentials: new Credentials(this),
        };
        this.action = new Actions(this);
        // create machine name
        this.machineName = this.createMachineName();
        this.on("ClientPlayingSessionState", (body) => {
            this.playingBlocked = body.playingBlocked;
        });
        this.once("ClientLoggedOff", (body) => {
            this.disconnect();
            this.emit("ClientLoggedOff", Language.EResultMap.get(body.eresult));
        });
    }
    /**
     * login to steam via credentials or refresh_token
     */
    async login(options) {
        // set up default login options
        options.clientOsType = Language.EOSType.Win11;
        options.protocolVersion = 65580;
        options.supportsRateLimitResponse = true;
        options.shouldRememberPassword = options.shouldRememberPassword === false ? false : true;
        options.machineName = options.machineName || this.machineName;
        options.machineId = options.machineId || this.createMachineId(options.machineName);
        const accountData = {
            games: [],
        };
        const accountAuth = {
            machineName: options.machineName,
            machineId: options.machineId,
        };
        let responses = [
            "ClientAccountInfo",
            "ClientEmailAddrInfo",
            "ClientLicenseList",
            "ClientIsLimitedAccount",
            "ClientVACBanStatus",
            "ClientPersonaState",
        ];
        const receivedResponse = (response) => {
            // remove this response from array
            responses = responses.filter((item) => item !== response);
        };
        this.once("ClientUpdateMachineAuth", (body) => {
            // don't respond to sentry when not remembering password
            if (options.shouldRememberPassword) {
                accountAuth.sentry = this.clientUpdateMachineAuthResponse(body.bytes);
            }
            receivedResponse("ClientUpdateMachineAuth");
        });
        this.once("ClientAccountInfo", (body) => {
            accountData.personaName = body.personaName;
            receivedResponse("ClientAccountInfo");
        });
        this.once("ClientEmailAddrInfo", (body) => {
            accountData.isEmailVerified = body.emailIsValidated;
            accountData.emailOrDomain = body.emailAddress;
            accountData.credentialChangeRequiresCode = body.credentialChangeRequiresCode;
            receivedResponse("ClientEmailAddrInfo");
        });
        this.once("ClientLicenseList", async (body) => {
            const packageIds = [];
            for (const license of body.licenses) {
                packageIds.push(license.packageId);
            }
            // get packages Info
            const appIds = await this.getAppIds(packageIds);
            if (!appIds.length)
                return receivedResponse("ClientLicenseList");
            // get apps info
            const appsInfo = await this.getAppsInfo(appIds);
            if (!appsInfo.length)
                return receivedResponse("ClientLicenseList");
            accountData.games = this.getGames(appsInfo);
            receivedResponse("ClientLicenseList");
        });
        this.once("ClientIsLimitedAccount", (body) => {
            accountData.limited = body.bisLimitedAccount;
            accountData.communityBanned = body.bisCommunityBanned;
            accountData.locked = body.bisLockedAccount;
            receivedResponse("ClientIsLimitedAccount");
        });
        this.once("ClientVACBanStatus", (body) => {
            accountData.vac = body.vac;
            receivedResponse("ClientVACBanStatus");
        });
        this.on("ClientPersonaState", (body) => {
            if (body.friends[0].playerName !== accountData.personaName) {
                return;
            }
            accountData.avatar = this.getAvatar(body.friends[0]);
            receivedResponse("ClientPersonaState");
        });
        // send login request to steam
        const res = await this.sendProtoPromise(Language.EMsg.ClientLogon, options);
        if (res.eresult === Language.EResult.OK) {
            this.startHeartBeat(res.heartbeatSeconds);
            accountAuth.webNonce = res.webapiAuthenticateUserNonce;
            accountData.steamId = res.clientSuppliedSteamid.toString();
            accountData.isSteamGuardEnabled = !!(options.accessToken ||
                (options.password && (options.authCode || options.twoFactorCode)));
            // sentry is emitted if guard is enabled, and when sentry not passed
            if (accountData.isSteamGuardEnabled && !options.shaSentryfile && !options.accessToken) {
                responses.push("ClientUpdateMachineAuth");
            }
            this.action.changePersonaState("Online");
            this.loggedIn = true;
        }
        else {
            this.disconnect();
            throw new SteamClientError(Language.EResultMap.get(res.eresult));
        }
        return new Promise((resolve, reject) => {
            // expect responses to occur before timeout
            const timeout = setTimeout(() => {
                clearInterval(interval);
                this.disconnect();
                reject(new SteamClientError(responses.toString()));
            }, this.timeout);
            // check whether user is logged in every second
            const interval = setInterval(() => {
                if (responses.length)
                    return;
                clearTimeout(timeout);
                clearInterval(interval);
                resolve({ auth: accountAuth, data: accountData });
            }, 1000);
        });
    }
    /**
     * Disconnect user from Steam and kill connection
     */
    disconnect() {
        this.destroyConnection();
    }
    /**
     * Whether user is logged in
     */
    get isLoggedIn() {
        return this.loggedIn;
    }
    /**
     * Whether playing is blocked by another session
     */
    get isPlayingBlocked() {
        return this.playingBlocked;
    }
    /**
     * Get all appIds from packages
     */
    getAppIds(packageIds) {
        // don't include default steam package id === 0
        packageIds = packageIds.filter((id) => id !== 0);
        if (!packageIds.length)
            return Promise.resolve([]);
        const packages = packageIds.map((id) => {
            return { packageid: id };
        });
        // send packge info request to steam
        this.sendProto(Language.EMsg.ClientPICSProductInfoRequest, { packages });
        // wait for all(Multi response) packages info
        return new Promise((resolve) => {
            const appIds = [];
            this.on("ClientPICSProductInfoResponse", (res) => {
                if (res.packages) {
                    for (const pkg of res.packages) {
                        // package not fully received
                        if (pkg.missingToken) {
                            continue;
                        }
                        const packageBuffer = BinaryKVParser.parse(pkg.buffer);
                        for (const appid of packageBuffer[pkg.packageid].appids) {
                            appIds.push(appid);
                        }
                    }
                }
                // received all packages info
                if (!res.responsePending) {
                    this.removeAllListeners("ClientPICSProductInfoResponse");
                    resolve([...new Set(appIds)].map((id) => {
                        return { appid: id };
                    }));
                }
            });
        });
    }
    /**
     * Get appsInfo from a list of appIds
     */
    getAppsInfo(apps) {
        if (!apps.length)
            return Promise.resolve([]);
        // send apps info request to steam
        this.sendProto(Language.EMsg.ClientPICSProductInfoRequest, { apps });
        // wait for all(may come in Multi response) apps info responses
        return new Promise((resolve) => {
            const appsInfo = [];
            this.on("ClientPICSProductInfoResponse", (res) => {
                if (res.apps) {
                    for (const app of res.apps) {
                        const appBuffer = VDF.parse(app.buffer.toString());
                        const info = appBuffer.appinfo;
                        if (!info)
                            continue;
                        appsInfo.push(info);
                    }
                }
                if (!res.responsePending) {
                    this.removeAllListeners("ClientPICSProductInfoResponse");
                    resolve(appsInfo);
                }
            });
        });
    }
    /**
     * Get only games from appsInfo[]
     */
    getGames(appsInfo) {
        const games = [];
        for (const app of appsInfo) {
            if (!app.common)
                continue;
            if (app.common.type.toLowerCase() !== "game")
                continue;
            games.push({
                name: app.common.name,
                logo: app.common.logo,
                logo_small: app.common.logo_small,
                icon: app.common.icon,
                clienticon: app.common.clienticon,
                clienttga: app.common.clienttga,
                gameid: Number(app.common.gameid),
            });
        }
        // this may contain duplicates
        const set = new Set();
        // remove duplicates
        return games.filter((game) => {
            const seen = set.has(game.gameid);
            set.add(game.gameid);
            return !seen;
        });
    }
    getAvatar(body) {
        const url = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars";
        let avatarHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb"; //default avatar
        const hash = body.avatarHash.toString("hex");
        //default avatar
        if (hash !== "0000000000000000000000000000000000000000") {
            avatarHash = hash;
        }
        return `${url}/${avatarHash.substring(0, 2)}/${avatarHash}_full.jpg`;
    }
    clientUpdateMachineAuthResponse(sentryBytes) {
        const stringHex = SteamCrypto.sha1Hash(sentryBytes);
        const buffer = Buffer.from(stringHex, "hex");
        this.sendProto(Language.EMsg.ClientUpdateMachineAuthResponse, { shaFile: buffer });
        return buffer;
    }
    createMachineName() {
        const name = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, "")
            .substring(0, 5)
            .toUpperCase();
        return "DESKTOP-" + name + "-IDLE";
    }
    /**
     * Create a machineID based of accountName
     */
    createMachineId(machineName) {
        // Machine IDs are binary KV objects with root key MessageObject and three hashes named BB3, FF2, and 3B3.
        // generate hash from machine name
        const hash = SteamCrypto.sha1Hash(machineName);
        const buffer = Buffer.alloc(155);
        buffer.writeInt8(0, 0); // 1 byte
        buffer.write("MessageObject", 1); // 14 bytes
        buffer.writeInt8(1, 15); // 1 byte
        buffer.write("BB3", 16); // 4 bytes
        buffer.write(hash, 20); // 41 bytes
        buffer.writeInt8(1, 61); // 1 byte
        buffer.write("FF2", 62); // 4 bytes
        buffer.write(hash, 66); // 41 bytes
        buffer.writeInt8(1, 107); // 1 byte
        buffer.write("3B3", 108); // 4 bytes
        buffer.write(hash, 112); // 41 bytes, total 153
        buffer.writeInt8(8, 153); // 1 byte
        buffer.writeInt8(8, 154); // 1 byte
        return buffer;
    }
}
