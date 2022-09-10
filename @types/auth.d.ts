import Long from "long";

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
}

interface AuthTokens {
  accountName: string;
  refreshToken: string;
  accessToken: string;
  machineName: string;
}
