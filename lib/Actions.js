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
        this.steam.send({
            EMsg: Language.EMsg.ClientChangeStatus,
            payload: { playerName },
        });
    }
    changePersonaState(state) {
        this.steam.send({
            EMsg: Language.EMsg.ClientChangeStatus,
            payload: { personaState: Language.EPersonaState[state] },
        });
    }
    /**
     * Idle an array of appIds
     * empty array stops idling
     */
    idleGames(gameIds) {
        if (this.steam.isPlayingBlocked) {
            throw new SteamClientError("AlreadyPlayingElseWhere");
        }
        const payload = {
            gamesPlayed: gameIds.map((id) => {
                return { gameId: id };
            }),
        };
        this.steam.send({
            EMsg: Language.EMsg.ClientGamesPlayed,
            payload,
        });
    }
    /**
     * Activate cdkey
     */
    cdkeyRedeem(cdkey) {
        this.steam.send({
            EMsg: Language.EMsg.ClientRegisterKey,
            payload: { key: cdkey },
        });
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
        this.steam.send({
            EMsg: Language.EMsg.ClientRequestFreeLicense,
            payload: { appids },
        });
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
