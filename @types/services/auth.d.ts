import Long from "long";

export type QRType = "terminal" | "image";
export type PartialSession = SessionViaCredentialsRes | SessionViaQrRes;

export interface UnifiedMsgRes {
  EResult: number;
}

interface AllowedConfirmations {
  confirmationType: number;
  associatedMessage: string;
}

interface BaseAuthSession extends UnifiedMsgRes {
  clientId: Long;
  requestId: Buffer;
  interval: number;
  allowedConfirmations: AllowedConfirmations[];
}

export interface SessionViaCredentialsRes extends BaseAuthSession {
  steamid: Long;
  weakToken: string;
}

export interface SessionViaQrRes extends BaseAuthSession {
  challengeUrl: string;
  version: number;
}

export interface PollAuthSessionStatusRes extends UnifiedMsgRes {
  newClientId: Long;
  newChallengeUrl: string;
  refreshToken: string;
  accessToken: string;
  hadRemoteInteraction: boolean;
  accountName: string;
  newGuardData: string;
}

export interface AuthTokens {
  accountName: string;
  refreshToken: string;
  accessToken: string;
  machineName: string;
  newGuardData: string;
}

export interface Confirmation {
  qrCode?: string;
  guardType?: string;
  timeoutSeconds: number;
}

declare class Auth {
  constructor(steam: Steam);
  /**
   * Login via QR
   * @emits "waitingForConfirmation" with QR challenge URL
   * @throws "LogonWasNotConfirmed"
   */
  getAuthTokensViaQR(qrType: QRType): Promise<AuthTokens>;
  /**
   * Login via Credentials
   * @emits "waitingForConfirmation" with confirmation type
   * @throws EResult, SteamGuardIsUnknown, SteamGuardIsDisabled
   */
  getAuthTokensViaCredentials(accountName: string, password: string, skipPolling?: boolean): Promise<AuthTokens | SessionViaCredentialsRes>;
  /**
   * Submit Steam Guard Code to auth session
   * @throws EResult, NotWaitingForConfirmation
   */
  updateWithSteamGuardCode(guardCode: string): Promise<void>;
}

export default Auth;
