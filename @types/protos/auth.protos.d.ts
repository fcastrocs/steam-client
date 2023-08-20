import { EAuthTokenPlatformType, EAuthSessionGuardType, ETokenRenewalType } from "../enums/steammessages_auth.steamclient.proto";
import { EAuthTokenPlatformType } from "../enums/steammessages_auth.steamclient.proto";
import { ESessionPersistence } from "../enums/enums.proto";
import type { ValueOf } from 'type-fest';
import Long from "long";
import { EOSType } from "../enums/commons";

interface Confirmation {
    qrCode?: { image: string; terminal: string; };
    allowedConfirmations?: AllowedConfirmation[];
    timeout: number;
}

interface DeviceDetails {
    deviceFriendlyName: string;
    platformType: ValueOf<EAuthTokenPlatformType>;
    osType: ValueOf<EOSType>
    gamingDeviceType: 1;
    machineId: Buffer;
}

type BeginAuthSessionViaQR_Request = {
    deviceDetails?: DeviceDetails
    websiteId: string;
}

interface AllowedConfirmation {
    confirmationType: ValueOf<EAuthSessionGuardType>;
    associatedMessage: string;
}

type BeginAuthSessionViaQR_Response = {
    EResult: number;
    clientId: Long;
    challengeUrl: string;
    requestId: Buffer;
    interval: number;
    allowedConfirmations: AllowedConfirmation[],
    version: number;
    websiteId: string;
}

type GetPasswordRSAPublicKey_Request = {
    accountName: string;
}

type GetPasswordRSAPublicKey_Response = {
    publickeyMod: string;
    publickeyExp: string;
    timestamp: Long
}

type BeginAuthSessionViaCredentials_Request = {
    deviceFriendlyName: string;
    accountName: string;
    encryptedPassword: string;
    encryptionTimestamp: Long;
    platformType: ValueOf<EAuthTokenPlatformType>;
    persistence: ValueOf<ESessionPersistence>;
    websiteId: string;
    deviceDetails?: CAuthentication_DeviceDetails
}

type BeginAuthSessionViaCredentials_Response = {
    EResult: number;
    clientId: Long;
    challengeUrl: string;
    requestId: Buffer;
    interval: number;
    allowedConfirmations: AllowedConfirmation[],
    version: number;
    steamid: Long;
    weakToken: string;
    agreementSessionUrl: string;
    extendedErrorMessage: string;
}


type PollAuthSessionStatus_Request = {
    clientId: Long;
    requestId: Buffer;
    tokenToRevoke?: Long;
}

type PollAuthSessionStatus_Response = {
    EResult: number;
    newClientId: Long;
    newChallengeUrl: string;
    refreshToken: string;
    accessToken: string;
    hadRemoteInteraction: boolean;
    accountName: string;
    newGuardData: string;
    agreementSessionUrl: string;
}

type UpdateAuthSessionWithSteamGuardCode_Request = {
    clientId: Long;
    steamid: Long;
    code: string;
    codeType: ValueOf<EAuthSessionGuardType>;
}

type UpdateAuthSessionWithSteamGuardCode_Response = {
    EResult: number;
    agreementSessionUrl: string;
}


type AccessToken_GenerateForApp_Request = {
    refreshToken: string;
    steamid: Long;
    renewalType?: ValueOf<ETokenRenewalType>;
}

type AccessToken_GenerateForApp_Response = {
    EResult: number;
    accessToken: string;
    refreshToken: string;
}