/**
 * Auto-generated file
 * Wed May 22 2024 20:34:57 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CAuthentication_GetPasswordRSAPublicKey_Request = {
	accountName?: string
}

export type CAuthentication_GetPasswordRSAPublicKey_Response = {
	publickeyMod?: string
	publickeyExp?: string
	timestamp?: Long
}

export type CAuthentication_DeviceDetails = {
	deviceFriendlyName?: string
	platformType?: .EAuthTokenPlatformType
	osType?: number
	gamingDeviceType?: number
	clientCount?: number
	machineId?: Buffer
}

export type CAuthentication_BeginAuthSessionViaQR_Request = {
	deviceFriendlyName?: string
	platformType?: .EAuthTokenPlatformType
	deviceDetails?: .CAuthentication_DeviceDetails
	websiteId?: string
}

export type CAuthentication_AllowedConfirmation = {
	confirmationType?: .EAuthSessionGuardType
	associatedMessage?: string
}

export type CAuthentication_BeginAuthSessionViaQR_Response = {
	clientId?: Long
	challengeUrl?: string
	requestId?: Buffer
	interval?: number
	allowedConfirmations?: .CAuthentication_AllowedConfirmation[]
	version?: number
}

export type CAuthentication_BeginAuthSessionViaCredentials_Request = {
	deviceFriendlyName?: string
	accountName?: string
	encryptedPassword?: string
	encryptionTimestamp?: Long
	rememberLogin?: boolean
	platformType?: .EAuthTokenPlatformType
	persistence?: .ESessionPersistence
	websiteId?: string
	deviceDetails?: .CAuthentication_DeviceDetails
	guardData?: string
	language?: number
	qosLevel?: number
}

export type CAuthentication_BeginAuthSessionViaCredentials_Response = {
	clientId?: Long
	requestId?: Buffer
	interval?: number
	allowedConfirmations?: .CAuthentication_AllowedConfirmation[]
	steamid?: Long
	weakToken?: string
	agreementSessionUrl?: string
	extendedErrorMessage?: string
}

export type CAuthentication_PollAuthSessionStatus_Request = {
	clientId?: Long
	requestId?: Buffer
	tokenToRevoke?: Long
}

export type CAuthentication_PollAuthSessionStatus_Response = {
	newClientId?: Long
	newChallengeUrl?: string
	refreshToken?: string
	accessToken?: string
	hadRemoteInteraction?: boolean
	accountName?: string
	newGuardData?: string
	agreementSessionUrl?: string
}

export type CAuthentication_GetAuthSessionInfo_Request = {
	clientId?: Long
}

export type CAuthentication_GetAuthSessionInfo_Response = {
	ip?: string
	geoloc?: string
	city?: string
	state?: string
	country?: string
	platformType?: .EAuthTokenPlatformType
	deviceFriendlyName?: string
	version?: number
	loginHistory?: .EAuthSessionSecurityHistory
	requestorLocationMismatch?: boolean
	highUsageLogin?: boolean
	requestedPersistence?: .ESessionPersistence
}

export type CAuthentication_UpdateAuthSessionWithMobileConfirmation_Request = {
	version?: number
	clientId?: Long
	steamid?: Long
	signature?: Buffer
	confirm?: boolean
	persistence?: .ESessionPersistence
}

export type CAuthentication_UpdateAuthSessionWithMobileConfirmation_Response = {
}

export type CAuthentication_UpdateAuthSessionWithSteamGuardCode_Request = {
	clientId?: Long
	steamid?: Long
	code?: string
	codeType?: .EAuthSessionGuardType
}

export type CAuthentication_UpdateAuthSessionWithSteamGuardCode_Response = {
	agreementSessionUrl?: string
}

export type CAuthentication_AccessToken_GenerateForApp_Request = {
	refreshToken?: string
	steamid?: Long
	renewalType?: .ETokenRenewalType
}

export type CAuthentication_AccessToken_GenerateForApp_Response = {
	accessToken?: string
	refreshToken?: string
}

export type CAuthentication_RefreshToken_Enumerate_Request = {
}

export type CAuthentication_RefreshToken_Enumerate_Response = {
	refreshTokens?: .CAuthentication_RefreshToken_Enumerate_Response.RefreshTokenDescription[]
	requestingToken?: Long
}

export type CAuthentication_GetAuthSessionsForAccount_Request = {
}

export type CAuthentication_GetAuthSessionsForAccount_Response = {
	clientIds?: Long[]
}

export type CAuthentication_MigrateMobileSession_Request = {
	steamid?: Long
	token?: string
	signature?: string
}

export type CAuthentication_MigrateMobileSession_Response = {
	refreshToken?: string
	accessToken?: string
}

export type CAuthentication_Token_Revoke_Request = {
	token?: string
	revokeAction?: .EAuthTokenRevokeAction
}

export type CAuthentication_Token_Revoke_Response = {
}

export type CAuthentication_RefreshToken_Revoke_Request = {
	tokenId?: Long
	steamid?: Long
	revokeAction?: .EAuthTokenRevokeAction
	signature?: Buffer
}

export type CAuthentication_RefreshToken_Revoke_Response = {
}

export type CAuthenticationSupport_QueryRefreshTokensByAccount_Request = {
	steamid?: Long
	includeRevokedTokens?: boolean
}

export type CSupportRefreshTokenDescription = {
	tokenId?: Long
	tokenDescription?: string
	timeUpdated?: number
	platformType?: .EAuthTokenPlatformType
	tokenState?: .EAuthTokenState
	ownerSteamid?: Long
	osPlatform?: number
	osType?: number
	authType?: number
	gamingDeviceType?: number
	firstSeen?: .CSupportRefreshTokenDescription.TokenUsageEvent
	lastSeen?: .CSupportRefreshTokenDescription.TokenUsageEvent
}

export type CAuthenticationSupport_QueryRefreshTokensByAccount_Response = {
	refreshTokens?: .CSupportRefreshTokenDescription[]
	lastTokenReset?: number
}

export type CAuthenticationSupport_QueryRefreshTokenByID_Request = {
	tokenId?: Long
}

export type CAuthenticationSupport_QueryRefreshTokenByID_Response = {
	refreshTokens?: .CSupportRefreshTokenDescription[]
}

export type CAuthenticationSupport_RevokeToken_Request = {
	tokenId?: Long
	steamid?: Long
}

export type CAuthenticationSupport_RevokeToken_Response = {
}

export type CAuthenticationSupport_GetTokenHistory_Request = {
	tokenId?: Long
}

export type CSupportRefreshTokenAudit = {
	action?: number
	time?: number
	ip?: .CMsgIPAddress
	actor?: Long
}

export type CAuthenticationSupport_GetTokenHistory_Response = {
	history?: .CSupportRefreshTokenAudit[]
}

export type CCloudGaming_CreateNonce_Request = {
	platform?: string
	appid?: number
}

export type CCloudGaming_CreateNonce_Response = {
	nonce?: string
	expiry?: number
}

export type CCloudGaming_GetTimeRemaining_Request = {
	platform?: string
	appidList?: number[]
}

export type CCloudGaming_TimeRemaining = {
	appid?: number
	minutesRemaining?: number
}

export type CCloudGaming_GetTimeRemaining_Response = {
	entries?: .CCloudGaming_TimeRemaining[]
}

