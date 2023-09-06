import Steam from "../Steam.js";
import {
    CAuthentication_AccessToken_GenerateForApp_Response,
    CAuthentication_BeginAuthSessionViaQR_Response,
    CAuthentication_PollAuthSessionStatus_Response,
} from "../protos/steammessages_auth.steamclient.js";
import { EAuthSessionGuardType } from "../../resources/language/steammessages_auth.steamclient.ts";
import EventEmitter from "events";

export interface Confirmation {
    qrCode?: { image: string; terminal: string };
    allowedConfirmations?: CAuthentication_BeginAuthSessionViaQR_Response["allowedConfirmations"];
    timeout: number;
}

declare class Auth extends EventEmitter {
    on(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;
    once(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;
    on(event: "authTokens", listener: (authTokens: CAuthentication_PollAuthSessionStatus_Response) => void): this;
    once(event: "authTokens", listener: (authTokens: CAuthentication_PollAuthSessionStatus_Response) => void): this;
    on(event: "getAuthTokensTimeout", listener: () => void): this;
    once(event: "getAuthTokensTimeout", listener: () => void): this;

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
    updateWithSteamGuardCode(guardCode: string, guardType: EAuthSessionGuardType): Promise<void>;
    accessTokenGenerateForApp(refreshToken: string): Promise<CAuthentication_AccessToken_GenerateForApp_Response>;
}

export default Auth;
