import { EPurchaseResultDetail } from "../../language/enums.steamd.js";
import { EResult } from "../../language/EResult.js";
import { SteamClientError, getKeyByValue } from "../modules/common.js";
export default class Credentials {
    constructor(steam) {
        this.steam = steam;
        this.serviceName = "Store";
    }
    async registerCDKey(activationCode) {
        const res = await this.steam.conn.sendServiceMethodCall(this.serviceName, "RegisterCDKey", {
            activationCode,
            isRequestFromClient: true,
        });
        if (res.EResult !== EResult.OK || !res.purchaseReceiptInfo) {
            throw new SteamClientError(getKeyByValue(EPurchaseResultDetail, res.purchaseResultDetails));
        }
        const appId = [];
        for (const lineItem of res.purchaseReceiptInfo.lineItems) {
            appId.push(lineItem.appid);
        }
        return this.steam.service.player.getOwnedGames({ appidsFilter: appId });
    }
}
