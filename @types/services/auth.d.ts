import EventEmitter from 'events';
import { Steam } from '../Steam.js';
import {
    CAuthenticationAccessTokenGenerateForAppResponse,
    CAuthenticationBeginAuthSessionViaCredentialsResponse,
    CAuthenticationBeginAuthSessionViaQRResponse,
    CAuthenticationPollAuthSessionStatusResponse
} from '../protos/steammessages_auth.steamclient.js';
import { EAuthSessionGuardType } from '../../resources/language/steammessages_auth.steamclient.js';

export class Auth extends EventEmitter {
    on(event: 'waitingForConfirmation', listener: (confirmation: Confirmation) => void): this;
    once(event: 'waitingForConfirmation', listener: (confirmation: Confirmation) => void): this;
    on(event: 'authTokens', listener: (authTokens: CAuthenticationPollAuthSessionStatusResponse) => void): this;
    once(event: 'authTokens', listener: (authTokens: CAuthenticationPollAuthSessionStatusResponse) => void): this;
    on(event: 'getAuthTokensTimeout', listener: () => void): this;
    once(event: 'getAuthTokensTimeout', listener: () => void): this;

    private steam;

    private waitingForConfirmation;

    private partialSession;

    private readonly serviceName;

    private readonly timeout;

    constructor(steam: Steam);
    /**
     * Obtain auth tokens via QR
     * @emits "waitingForConfirmation" "authTokens" "getAuthTokensTimeout"
     * @throws EResult
     */
    getAuthTokensViaQR(): Promise<void>;
    /**
     * Obtain auth tokens via credentials
     * @emits "waitingForConfirmation" "authTokens" "getAuthTokensTimeout"
     * @throws EResult, SteamGuardIsUnknown, SteamGuardIsDisabled
     */
    getAuthTokensViaCredentials(
        accountName: string,
        password: string,
        options?: {
            returnResponse: boolean;
        }
    ): Promise<CAuthenticationBeginAuthSessionViaCredentialsResponse>;
    /**
     * Submit Steam Guard Code to auth session
     * @throws EResult, NotWaitingForConfirmation
     */
    updateWithSteamGuardCode(guardCode: string, guardType: typeof EAuthSessionGuardType): Promise<void>;
    accessTokenGenerateForApp(refreshToken: string): Promise<CAuthenticationAccessTokenGenerateForAppResponse>;
    /**
     * Poll auth session for auth tokens
     * @emits "authTokens" "getAuthTokensTimeout"
     */
    private pollAuthStatusInterval;
}

export interface Confirmation {
    qrCode?: { image: string; terminal: string };
    allowedConfirmations?: CAuthenticationBeginAuthSessionViaQRResponse['allowedConfirmations'];
    timeout: number;
}
