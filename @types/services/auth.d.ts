import Long from "long";
import { AccessToken_GenerateForApp_Response, PollAuthSessionStatus_Response } from "../protos/auth.protos";
import { ValueOf } from "type-fest";
import { EAuthSessionGuardType } from "../enums/steammessages_auth.steamclient.proto";

declare class Auth {
  on(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;
  once(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;
  on(event: "authTokens", listener: (authTokens: PollAuthSessionStatus_Response) => void): this;
  once(event: "authTokens", listener: (authTokens: PollAuthSessionStatus_Response) => void): this;
  on(event: "getAuthTokensTimeout", listener: () => void): this;
  once(event: "getAuthTokensTimeout", listener: () => void): this;

  constructor(private steam: Steam);
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
  updateWithSteamGuardCode(guardCode: string, guardType: ValueOf<EAuthSessionGuardType>): Promise<void>;

  accessTokenGenerateForApp(refreshToken: string): Promise<AccessToken_GenerateForApp_Response>
}

export default Auth;
