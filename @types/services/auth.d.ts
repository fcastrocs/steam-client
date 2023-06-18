import Long from "long";

type QRType = "terminal" | "image";
type PartialSession = SessionViaCredentialsRes | SessionViaQrRes;

interface UnifiedMsgRes {
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

interface SessionViaCredentialsRes extends BaseAuthSession {
  steamid: Long;
  weakToken: string;
}

interface SessionViaQrRes extends BaseAuthSession {
  challengeUrl: string;
  version: number;
}

interface PollAuthSessionStatusRes extends UnifiedMsgRes {
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

export default class IAuth {
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
  getAuthTokensViaCredentials(accountName: string, password: string, skipPolling: boolean): Promise<AuthTokens | any>;
  /**
   * Submit Steam Guard Code to auth session
   * @throws EResult
   */
  updateWithSteamGuardCode(guardCode: string): Promise<void>;
}
