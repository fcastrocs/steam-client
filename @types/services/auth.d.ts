import {
    Steam,
    CAuthenticationAccessTokenGenerateForAppResponse,
    CAuthenticationBeginAuthSessionViaCredentialsResponse
} from '../all-types.js';
import { EAuthSessionGuardType } from '../../resources/language/steammessages_auth.steamclient.js';

export class Auth {
    constructor(steam: Steam);

    getAuthTokensViaQR(): Promise<QrCode>;

    getAuthTokensViaCredentials(
        accountName: string,
        password: string,
        options: { skipPollAuthSessionStatus?: boolean } = {}
    ): Promise<CAuthenticationBeginAuthSessionViaCredentialsResponse>;

    updateWithSteamGuardCode(guardCode: string, guardType: typeof EAuthSessionGuardType): Promise<void>;

    accessTokenGenerateForApp(refreshToken: string): Promise<CAuthenticationAccessTokenGenerateForAppResponse>;
}

export interface QrCode {
    image: string;
    terminal: string;
}
