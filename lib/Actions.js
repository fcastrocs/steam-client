import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
import SteamClientError from "./SteamClientError.js";
import { Language } from "./resources.js";
export default class Actions {
    steam;
    constructor(steam) {
        this.steam = steam;
    }
    changePlayerName(playerName) {
        this.steam.sendProto(Language.EMsg.ClientChangeStatus, { playerName });
    }
    changePersonaState(state) {
        this.steam.sendProto(Language.EMsg.ClientChangeStatus, { personaState: Language.EPersonaState[state] });
    }
    /**
     * Idle an array of appIds
     * Empty array stops idling
     * forcePlay truthy kicks another playing session
     */
    async idleGames(gameIds, options) {
        if (this.steam.isPlayingBlocked && !options?.forcePlay) {
            throw new SteamClientError("AlreadyPlayingElseWhere");
        }
        // kick another playing session before attemping to play in this session
        if (this.steam.isPlayingBlocked) {
            this.steam.sendProto(Language.EMsg.ClientKickPlayingSession, { onlyStopGame: true });
        }
        const payload = {
            gamesPlayed: gameIds.map((id) => {
                return { gameId: id };
            }),
        };
        await this.steam.sendProtoPromise(Language.EMsg.ClientGamesPlayed, payload, Language.EMsg.ClientPlayingSessionState);
    }
    /**
     * Activate cdkey
     */
    cdkeyRedeem(cdkey) {
        this.steam.sendProto(Language.EMsg.ClientRegisterKey, { key: cdkey });
        return new Promise((resolve, reject) => {
            this.steam.once("ClientPurchaseResponse", async (res) => {
                // something went wrong
                if (res.eresult !== 1) {
                    return reject(new SteamClientError(Language.EPurchaseResultMap.get(res.purchaseResultDetails)));
                }
                const receipt = BinaryKVParser.parse(res.purchaseReceiptInfo).MessageObject;
                // get packgeIds
                const packageIds = [];
                for (const item of receipt.lineitems) {
                    const packageId = item.PackageID || item.packageID || item.packageid;
                    if (!packageId)
                        continue;
                    packageIds.push(packageId);
                }
                const appIds = await this.steam.getAppIds(packageIds);
                const appInfo = await this.steam.getAppsInfo(appIds);
                return resolve(this.steam.getGames(appInfo));
            });
        });
    }
    /**
     * Activate free games
     */
    activateFreeToPlayGames(appids) {
        if (!appids.length)
            return Promise.resolve([]);
        this.steam.sendProto(Language.EMsg.ClientRequestFreeLicense, { appids });
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new SteamClientError("DidNotGetResponse"));
            }, this.steam.timeout);
            this.steam.once("ClientRequestFreeLicenseResponse", async (res) => {
                clearTimeout(timeout);
                if (!res.grantedAppids.length)
                    resolve([]);
                const appsInfo = await this.steam.getAppsInfo(res.grantedAppids);
                const games = this.steam.getGames(appsInfo);
                resolve(games);
            });
        });
    }
}
