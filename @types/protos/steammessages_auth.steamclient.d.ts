/**
 * Auto-generated file
 * Sun Nov 05 2023 23:43:25 GMT-0500 (Eastern Standard Time)
 */

import Long from "long";

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
	platformType?: EAuthTokenPlatformType
	osType?: number
	gamingDeviceType?: number
	clientCount?: number
	machineId?: Buffer
}

export type CAuthentication_BeginAuthSessionViaQR_Request = {
	deviceFriendlyName?: string
	platformType?: EAuthTokenPlatformType
	deviceDetails?: {
		deviceFriendlyName?: string
		platformType?: EAuthTokenPlatformType
		osType?: number
		gamingDeviceType?: number
		clientCount?: number
		machineId?: Buffer
	}
	websiteId?: string
}

export type CAuthentication_AllowedConfirmation = {
	confirmationType?: EAuthSessionGuardType
	associatedMessage?: string
}

export type CAuthentication_BeginAuthSessionViaQR_Response = {
	clientId?: Long
	challengeUrl?: string
	requestId?: Buffer
	interval?: number
	allowedConfirmations?: {
		confirmationType?: EAuthSessionGuardType
		associatedMessage?: string
	}[]
	version?: number
}

export type CAuthentication_BeginAuthSessionViaCredentials_Request = {
	deviceFriendlyName?: string
	accountName?: string
	encryptedPassword?: string
	encryptionTimestamp?: Long
	rememberLogin?: boolean
	platformType?: EAuthTokenPlatformType
	persistence?: ESessionPersistence
	websiteId?: string
	deviceDetails?: {
		deviceFriendlyName?: string
		platformType?: EAuthTokenPlatformType
		osType?: number
		gamingDeviceType?: number
		clientCount?: number
		machineId?: Buffer
	}
	guardData?: string
	language?: number
	qosLevel?: number
}

export type CAuthentication_BeginAuthSessionViaCredentials_Response = {
	clientId?: Long
	requestId?: Buffer
	interval?: number
	allowedConfirmations?: {
		confirmationType?: EAuthSessionGuardType
		associatedMessage?: string
	}[]
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
	platformType?: EAuthTokenPlatformType
	deviceFriendlyName?: string
	version?: number
	loginHistory?: EAuthSessionSecurityHistory
	requestorLocationMismatch?: boolean
	highUsageLogin?: boolean
	requestedPersistence?: ESessionPersistence
}

export type CAuthentication_UpdateAuthSessionWithMobileConfirmation_Request = {
	version?: number
	clientId?: Long
	steamid?: Long
	signature?: Buffer
	confirm?: boolean
	persistence?: ESessionPersistence
}

export type CAuthentication_UpdateAuthSessionWithMobileConfirmation_Response = {
}

export type CAuthentication_UpdateAuthSessionWithSteamGuardCode_Request = {
	clientId?: Long
	steamid?: Long
	code?: string
	codeType?: EAuthSessionGuardType
}

export type CAuthentication_UpdateAuthSessionWithSteamGuardCode_Response = {
	agreementSessionUrl?: string
}

export type CAuthentication_AccessToken_GenerateForApp_Request = {
	refreshToken?: string
	steamid?: Long
	renewalType?: ETokenRenewalType
}

export type CAuthentication_AccessToken_GenerateForApp_Response = {
	accessToken?: string
	refreshToken?: string
}

export type CAuthentication_RefreshToken_Enumerate_Request = {
}

export type CAuthentication_RefreshToken_Enumerate_Response = {
	refreshTokens?: {
		tokenId?: Long
		tokenDescription?: string
		timeUpdated?: number
		platformType?: EAuthTokenPlatformType
		loggedIn?: boolean
		osPlatform?: number
		authType?: number
		gamingDeviceType?: number
		firstSeen?: {
			time?: number
			ip?: {
				v4?: number
				v6?: Buffer
			}
			locale?: string
			country?: string
			state?: string
			city?: string
		}
		lastSeen?: {
			time?: number
			ip?: {
				v4?: number
				v6?: Buffer
			}
			locale?: string
			country?: string
			state?: string
			city?: string
		}
		osType?: number
	}[]
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
	revokeAction?: EAuthTokenRevokeAction
}

export type CAuthentication_Token_Revoke_Response = {
}

export type CAuthentication_RefreshToken_Revoke_Request = {
	tokenId?: Long
	steamid?: Long
	revokeAction?: EAuthTokenRevokeAction
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
	platformType?: EAuthTokenPlatformType
	tokenState?: EAuthTokenState
	ownerSteamid?: Long
	osPlatform?: number
	osType?: number
	authType?: number
	gamingDeviceType?: number
	firstSeen?: {
		time?: number
		ip?: {
			v4?: number
			v6?: Buffer
		}
		country?: string
		state?: string
		city?: string
	}
	lastSeen?: {
		time?: number
		ip?: {
			v4?: number
			v6?: Buffer
		}
		country?: string
		state?: string
		city?: string
	}
}

export type CAuthenticationSupport_QueryRefreshTokensByAccount_Response = {
	refreshTokens?: {
		tokenId?: Long
		tokenDescription?: string
		timeUpdated?: number
		platformType?: EAuthTokenPlatformType
		tokenState?: EAuthTokenState
		ownerSteamid?: Long
		osPlatform?: number
		osType?: number
		authType?: number
		gamingDeviceType?: number
		firstSeen?: {
			time?: number
			ip?: {
				v4?: number
				v6?: Buffer
			}
			country?: string
			state?: string
			city?: string
		}
		lastSeen?: {
			time?: number
			ip?: {
				v4?: number
				v6?: Buffer
			}
			country?: string
			state?: string
			city?: string
		}
	}[]
	lastTokenReset?: number
}

export type CAuthenticationSupport_QueryRefreshTokenByID_Request = {
	tokenId?: Long
}

export type CAuthenticationSupport_QueryRefreshTokenByID_Response = {
	refreshTokens?: {
		tokenId?: Long
		tokenDescription?: string
		timeUpdated?: number
		platformType?: EAuthTokenPlatformType
		tokenState?: EAuthTokenState
		ownerSteamid?: Long
		osPlatform?: number
		osType?: number
		authType?: number
		gamingDeviceType?: number
		firstSeen?: {
			time?: number
			ip?: {
				v4?: number
				v6?: Buffer
			}
			country?: string
			state?: string
			city?: string
		}
		lastSeen?: {
			time?: number
			ip?: {
				v4?: number
				v6?: Buffer
			}
			country?: string
			state?: string
			city?: string
		}
	}[]
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
	ip?: {
		v4?: number
		v6?: Buffer
	}
	actor?: Long
}

export type CAuthenticationSupport_GetTokenHistory_Response = {
	history?: {
		action?: number
		time?: number
		ip?: {
			v4?: number
			v6?: Buffer
		}
		actor?: Long
	}[]
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
	entries?: {
		appid?: number
		minutesRemaining?: number
	}[]
}

