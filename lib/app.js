/**
 * Manages high-level Steam operations
 *
 * Emits the following:
 * 'disconnected' when connection is lost.
 * 'loginkey' loginkey when it is accepted.
 *
 */
import Connection from "./connection.js";
import resources from "./resources/index.js";
import SteamCrypto from "steam-crypto-esm";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
const VDF = require("vdf");
const Language = resources.language;
const PROTOCOL_VERSION = 65580;
export default class Steam extends Connection {
    constructor(options) {
        super(options);
    }
    /**
     * Login to Steam
     */
    login(options) {
        // set up default login options
        options.clientOsType = Language.EOSType.Windows10;
        options.shouldRememberPassword = true;
        options.protocolVersion = PROTOCOL_VERSION;
        options.supportsRateLimitResponse = true;
        options.machineId = this.createMachineID(options.accountName);
        // don't include password when using loginkey because it's not needed
        if (options.loginKey) {
            delete options.password;
        }
        const accountData = {};
        const accountAuth = {};
        accountAuth.loginKey = options.loginKey;
        accountAuth.sentry = options.shaSentryfile;
        accountData.games = [];
        accountAuth.machineName = options.machineName || this.createMachineName();
        // send login request to steam
        this.send(options, Language.EMsg.ClientLogon);
        // wait for all account data
        return new Promise((resolve, reject) => {
            let responses = [
                "CMsgClientLogonResponse",
                "CMsgClientIsLimitedAccount",
                "CMsgClientVACBanStatus",
                "CMsgClientPersonaState",
                "CMsgClientAccountInfo",
                "CMsgClientLicenseList",
                "CMsgClientEmailAddrInfo",
            ];
            // expect a sentry if options did not provide one.
            if (!options.shaSentryfile) {
                responses.push("CMsgClientUpdateMachineAuth");
            }
            // expect a loginKey if options did not provide one
            if (!options.loginKey) {
                responses.push("CMsgClientNewLoginKey");
            }
            // expect responses to occur before timeout
            const loginTimeoutId = setTimeout(() => {
                this.disconnect();
                reject(responses);
            }, this.timeout);
            // catch responses
            this.once("CMsgClientLogonResponse", async (body) => {
                if (body.eresult === Language.EResult.OK) {
                    this.startHeartBeat(body.outOfGameHeartbeatSeconds);
                    accountAuth.webNonce = body.webapiAuthenticateUserNonce;
                    accountData.steamId = body.clientSuppliedSteamid.toString();
                }
                else {
                    accountData.emailOrDomain = body.emailDomain;
                    clearTimeout(loginTimeoutId);
                    this.disconnect();
                    return reject(Language.EResult[body.eresult]);
                }
                // set online status
                this.clientChangeStatus({
                    personaState: Language.EPersonaState.Online,
                });
                checkCanResolve("CMsgClientLogonResponse");
            });
            this.on("CMsgClientNewLoginKey", (body) => {
                this.send(body, Language.EMsg.ClientNewLoginKeyAccepted);
                accountAuth.loginKey = body.loginKey;
                // maybe steam sends a loginKey randomly, when not expecting one, likely.
                if (responses.includes("CMsgClientNewLoginKey")) {
                    checkCanResolve("CMsgClientNewLoginKey");
                }
                else {
                    // emit it so it can be handled approperly.
                    this.emit("loginKey", accountAuth.loginKey);
                }
            });
            // sentry
            this.once("CMsgClientUpdateMachineAuth", (body) => {
                accountAuth.sentry = this.clientUpdateMachineAuthResponse(body.bytes);
                // maybe steam sends a sentry randomly, when not expecting one, not likely.
                if (responses.includes("CMsgClientUpdateMachineAuth")) {
                    checkCanResolve("CMsgClientUpdateMachineAuth");
                }
            });
            this.once("CMsgClientIsLimitedAccount", (body) => {
                accountData.limited = body.bisLimitedAccount;
                accountData.communityBanned = body.bisCommunityBanned;
                accountData.locked = body.bisLockedAccount;
                checkCanResolve("CMsgClientIsLimitedAccount");
            });
            this.once("CMsgClientVACBanStatus", (body) => {
                accountData.vac = body.vacbanned;
                checkCanResolve("CMsgClientVACBanStatus");
            });
            this.once("CMsgClientPersonaState", (body) => {
                accountData.avatar = this.getAvatar(body);
                checkCanResolve("CMsgClientPersonaState");
            });
            this.once("CMsgClientAccountInfo", (body) => {
                accountData.nickname = body.personaName;
                checkCanResolve("CMsgClientAccountInfo");
                // if no steam guard steam will not send sentry, but will still send loginKey
                if (body.twoFactorState === 0) {
                    checkCanResolve("CMsgClientUpdateMachineAuth");
                }
            });
            this.once("CMsgClientEmailAddrInfo", (body) => {
                accountData.emailVerified = body.emailIsValidated;
                accountData.emailOrDomain = body.emailAddress;
                accountData.secure = body.credentialChangeRequiresCode;
                checkCanResolve("CMsgClientEmailAddrInfo");
            });
            this.once("CMsgClientLicenseList", async (body) => {
                const packageIds = [];
                for (const license of body.licenses) {
                    packageIds.push(license.packageId);
                }
                // get packages Info
                const packagesInfo = await this.getPackagesInfo(packageIds);
                if (packagesInfo.length === 0) {
                    checkCanResolve("CMsgClientLicenseList");
                    return;
                }
                const appIds = [];
                for (const pkg of packagesInfo) {
                    for (const appid of pkg.appids) {
                        appIds.push(appid);
                    }
                }
                // get apps info
                const appsInfo = await this.getAppsInfo(appIds);
                if (appsInfo.length === 0) {
                    checkCanResolve("CMsgClientLicenseList");
                    return;
                }
                accountData.games = this.getGames(appsInfo);
                checkCanResolve("CMsgClientLicenseList");
            });
            // check if this promise can be resolved
            const checkCanResolve = (response) => {
                // remove this response from array
                responses = responses.filter((item) => item !== response);
                //  there are still responses left
                if (responses.length)
                    return;
                // no more responses left, finally return from login()
                clearTimeout(loginTimeoutId);
                resolve({ auth: accountAuth, data: accountData });
            };
        });
    }
    /**
     * Change persona name or status
     */
    clientChangeStatus(body) {
        this.send(body, Language.EMsg.ClientChangeStatus);
    }
    /**
     * Idle an array of appIds
     * empty array stops idling
     */
    clientGamesPlayed(appIds) {
        const body = {
            gamesPlayed: [],
        };
        for (const appId of appIds) {
            body.gamesPlayed.push({ gameId: appId });
        }
        this.send(body, Language.EMsg.ClientGamesPlayed);
    }
    /**
     * Activate cdkey
     */
    cdkeyRedeem(cdkey) {
        this.send({ key: cdkey }, Language.EMsg.ClientRegisterKey);
        return new Promise((resolve, reject) => {
            this.once("CMsgClientPurchaseResponse", async (res) => {
                // something went wrong
                if (res.eresult !== 1) {
                    return reject(Language.EPurchaseResult[res.purchaseResultDetails]);
                }
                else {
                    const receipt = BinaryKVParser.parse(res.purchaseReceiptInfo).MessageObject;
                    // get packgeIds
                    const packageIds = [];
                    for (const item of receipt.lineitems) {
                        const packageId = item.PackageID || item.packageID || item.packageid;
                        if (!packageId)
                            continue;
                        packageIds.push(packageId);
                    }
                    const packageInfo = await this.getPackagesInfo(packageIds);
                    // get appIds
                    let appIds = [];
                    for (const pkg of packageInfo) {
                        appIds = appIds.concat(pkg.appids);
                    }
                    const appInfo = await this.getAppsInfo(appIds);
                    return resolve(this.getGames(appInfo));
                }
            });
        });
    }
    /**
     * Activate free games
     */
    clientRequestFreeLicense(appIds) {
        if (appIds.length === 0)
            return Promise.resolve([]);
        const body = {
            appids: [],
        };
        for (const appId of appIds) {
            body.appids.push(appId);
        }
        this.send(body, Language.EMsg.ClientRequestFreeLicense);
        return new Promise((resolve) => {
            this.once("CMsgClientRequestFreeLicenseResponse", async (res) => {
                if (res.grantedAppids.length === 0)
                    resolve([]);
                const appsInfo = await this.getAppsInfo(res.grantedAppids);
                const games = this.getGames(appsInfo);
                resolve(games);
            });
        });
    }
    /**
     * Get avatar from CMsgClientPersonaState response
     */
    getAvatar(body) {
        const url = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars";
        let avatarHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb"; //default avatar
        const hash = body.friends[0].avatarHash.toString("hex");
        //default avatar
        if (hash !== "0000000000000000000000000000000000000000") {
            avatarHash = hash;
        }
        return `${url}/${avatarHash.substring(0, 2)}/${avatarHash}_full.jpg`;
    }
    /**
     * Get packagesInfo from a list of packageIds
     */
    getPackagesInfo(packageIds) {
        const packages = [];
        // don't include default steam package
        for (const id of packageIds) {
            // don't include default steam package
            if (id === 0)
                continue;
            packages.push({ packageid: id });
        }
        if (packages.length === 0)
            return Promise.resolve([]);
        // send packge info request to steam
        this.send({ packages }, Language.EMsg.ClientPICSProductInfoRequest);
        // wait for all(may con in Multi response) packages info responses
        return new Promise((resolve) => {
            const packagesInfo = [];
            let missingTokens = 0;
            this.on("CMsgClientPICSProductInfoResponse", (data) => {
                for (const pkg of data.packages) {
                    if (pkg.missingToken) {
                        missingTokens++;
                        continue;
                    }
                    packagesInfo.push(BinaryKVParser.parse(pkg.buffer)[pkg.packageid]);
                }
                if (packagesInfo.length === packages.length - missingTokens) {
                    this.removeAllListeners("CMsgClientPICSProductInfoResponse");
                    resolve(packagesInfo);
                }
            });
        });
    }
    /**
     * Get appsInfo from a list of appIds
     */
    getAppsInfo(appIds) {
        const apps = [];
        // get apps
        for (const id of appIds) {
            apps.push({ appid: id });
        }
        if (apps.length === 0)
            return Promise.resolve([]);
        // send apps info request to steam
        this.send({ apps }, Language.EMsg.ClientPICSProductInfoRequest);
        // wait for all(may come in Multi response) apps info responses
        return new Promise((resolve) => {
            const appsInfo = [];
            this.on("CMsgClientPICSProductInfoResponse", (data) => {
                // did not receive any apps.
                if (!data.apps) {
                    return resolve([]);
                }
                for (const app of data.apps) {
                    appsInfo.push(VDF.parse(app.buffer.toString()).appinfo);
                }
                if (appsInfo.length === apps.length) {
                    this.removeAllListeners("CMsgClientPICSProductInfoResponse");
                    resolve(appsInfo);
                }
            });
        });
    }
    /**
     * Parse appsInfo into a nice games array
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
                appid: app.appid,
                logo: app.common.logo,
            });
        }
        // for some reason Steam can return duplicates.
        const seen = new Set();
        // remove duplicates
        return games.filter((game) => {
            const res = seen.has(game.appid);
            seen.add(game.appid);
            return !res;
        });
    }
    /**
     * Create a machineID based of accountName
     */
    createMachineID(accountName) {
        // Machine IDs are binary KV objects with root key MessageObject and three hashes named BB3, FF2, and 3B3.
        // generate hash from accountName
        const hash = SteamCrypto.sha1(accountName);
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
    /**
     * Accept sentry
     */
    clientUpdateMachineAuthResponse(sentry) {
        const stringHex = SteamCrypto.sha1(sentry);
        const buffer = Buffer.from(stringHex, "hex");
        this.send({ shaFile: buffer }, Language.EMsg.ClientUpdateMachineAuthResponse);
        return buffer;
    }
    /**
     * Create a random machine name
     */
    createMachineName() {
        const name = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, "")
            .substring(0, 5)
            .toUpperCase();
        return "DESKTOP-" + name;
    }
}
