import type { UnknownRecord } from 'type-fest';
import type Steam from '../Steam';
import { SteamClientError, getKeyByValue } from '../modules/common';
import type { CPlayerGetOwnedGamesResponse } from '../../@types/protos/steammessages_player.steamclient';
import type {
    CStoreRegisterCDKeyRequest,
    CStoreRegisterCDKeyResponse
} from '../../@types/protos/steammessages_store.steamclient';
import { EPurchaseResultDetail } from '../../resources/language/enums.steamd';
import { EResult } from '../../resources/language/EResult';

export default class Credentials {
    private readonly serviceName = 'Store';

    constructor(private steam: Steam) {}

    async registerCDKey(activationCode: string): Promise<CPlayerGetOwnedGamesResponse['games']> {
        const res: CStoreRegisterCDKeyResponse = await this.steam.conn.sendServiceMethodCall(
            this.serviceName,
            'RegisterCDKey',
            {
                activationCode,
                isRequestFromClient: true
            } as CStoreRegisterCDKeyRequest
        );

        if ((res as UnknownRecord).EResult !== EResult.OK || !res.purchaseReceiptInfo) {
            throw new SteamClientError(getKeyByValue(EPurchaseResultDetail, res.purchaseResultDetails));
        }

        const appId: number[] = [];

        res.purchaseReceiptInfo.lineItems.forEach((lineItem) => appId.push(lineItem.appid));

        return this.steam.service.player.getOwnedGames({ appidsFilter: appId });
    }
}
