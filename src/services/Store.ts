import { EPurchaseResultDetail } from "../language/enums.steamd.js";
import { EResult } from "../language/EResult.js";
import Steam from "../Steam.js";
import { SteamClientError, getKeyByValue } from "../modules/common.js";
import type { UnknownRecord } from "type-fest";

export default class Credentials {
  private readonly serviceName = "Store";
  constructor(private steam: Steam) {}

  async registerCDKey(activationCode: string): Promise<CPlayer_GetOwnedGames_Response["games"]> {
    const res: CStore_RegisterCDKey_Response = await this.steam.conn.sendServiceMethodCall(this.serviceName, "RegisterCDKey", {
      activationCode,
      isRequestFromClient: true,
    } as CStore_RegisterCDKey_Request);

    if ((res as UnknownRecord).EResult !== EResult.OK || !res.purchaseReceiptInfo) {
      throw new SteamClientError(getKeyByValue(EPurchaseResultDetail, res.purchaseResultDetails!));
    }

    const appId: number[] = [];

    for (const lineItem of res.purchaseReceiptInfo.lineItems!) {
      appId.push(lineItem.appid!);
    }

    return this.steam.service.player.getOwnedGames({ appidsFilter: appId });
  }
}
