import type { UnknownRecord } from 'type-fest';
import { EPurchaseResultDetail } from '../../resources/language/enums.steamd.js';
import { EResult } from '../../resources/language/EResult.js';
import Steam from '../Steam.js';
import { SteamClientError, getKeyByValue } from '../modules/common.js';
import type { CPlayer_GetOwnedGames_Response } from '../../@types/protos/steammessages_player.steamclient.js';
import type {
    CStore_RegisterCDKey_Response,
    CStore_RegisterCDKey_Request
} from '../../@types/protos/steammessages_store.steamclient.js';

export default class Credentials {
    private readonly serviceName = 'Store';

    constructor(private steam: Steam) {}

    async registerCDKey(
        activationCode: string
    ): Promise<CPlayer_GetOwnedGames_Response['games']> {
        const res: CStore_RegisterCDKey_Response =
            await this.steam.conn.sendServiceMethodCall(
                this.serviceName,
                'RegisterCDKey',
                {
                    activationCode,
                    isRequestFromClient: true
                } as CStore_RegisterCDKey_Request
            );

        if (
            (res as UnknownRecord).EResult !== EResult.OK ||
            !res.purchaseReceiptInfo
        ) {
            throw new SteamClientError(
                getKeyByValue(EPurchaseResultDetail, res.purchaseResultDetails)
            );
        }

        const appId: number[] = [];

        res.purchaseReceiptInfo.lineItems.forEach((lineItem) =>
            appId.push(lineItem.appid)
        );

        return this.steam.service.player.getOwnedGames({ appidsFilter: appId });
    }
}
