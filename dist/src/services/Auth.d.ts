/// <reference types="node" resolution-mode="require"/>
import Steam from "../Steam.js";
import EventEmitter from "events";
import { EAuthSessionGuardType } from "../../language/steammessages_auth.steamclient.js";
import type { CAuthentication_AccessToken_GenerateForApp_Response } from "../../@types/protos/steammessages_auth.steamclient.js";
export default class Auth extends EventEmitter {
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
    getAuthTokensViaCredentials(accountName: string, password: string): Promise<void>;
    /**
     * Submit Steam Guard Code to auth session
     * @throws EResult, NotWaitingForConfirmation
     */
    updateWithSteamGuardCode(guardCode: string, guardType: typeof EAuthSessionGuardType): Promise<void>;
    accessTokenGenerateForApp(refreshToken: string): Promise<CAuthentication_AccessToken_GenerateForApp_Response>;
    /**
     * Poll auth session for auth tokens
     * @emits "authTokens" "getAuthTokensTimeout"
     */
    private pollAuthStatusInterval;
    private genQRCode;
    private encryptPass;
    private checkResult;
}
