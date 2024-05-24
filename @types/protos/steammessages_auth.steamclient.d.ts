/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Thu May 23 2024 22:57:11 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";
import * as enums from "../../resources/language/steammessages_auth.steamclient.js";

export type CAuthenticationGetPasswordRSAPublicKeyRequest = {
	accountName?: string
}

export type CAuthenticationGetPasswordRSAPublicKeyResponse = {
	publickeyMod?: string
	publickeyExp?: string
	timestamp?: Long
}

export type CAuthenticationDeviceDetails = {
	deviceFriendlyName?: string
	platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
	osType?: number
	gamingDeviceType?: number
	clientCount?: number
	machineId?: Buffer
}

export type CAuthenticationBeginAuthSessionViaQRRequest = {
	deviceFriendlyName?: string
	platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
	deviceDetails?: {
		deviceFriendlyName?: string
		platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
		osType?: number
		gamingDeviceType?: number
		clientCount?: number
		machineId?: Buffer
	}
	websiteId?: string
}

export type CAuthenticationAllowedConfirmation = {
	confirmationType?: typeof enums.EAuthSessionGuardType[keyof typeof enums.EAuthSessionGuardType]
	associatedMessage?: string
}

export type CAuthenticationBeginAuthSessionViaQRResponse = {
	clientId?: Long
	challengeUrl?: string
	requestId?: Buffer
	interval?: number
	allowedConfirmations?: {
		confirmationType?: typeof enums.EAuthSessionGuardType[keyof typeof enums.EAuthSessionGuardType]
		associatedMessage?: string
	}[]
	version?: number
}

export type CAuthenticationBeginAuthSessionViaCredentialsRequest = {
	deviceFriendlyName?: string
	accountName?: string
	encryptedPassword?: string
	encryptionTimestamp?: Long
	rememberLogin?: boolean
	platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
	persistence?: typeof enums.ESessionPersistence[keyof typeof enums.ESessionPersistence]
	websiteId?: string
	deviceDetails?: {
		deviceFriendlyName?: string
		platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
		osType?: number
		gamingDeviceType?: number
		clientCount?: number
		machineId?: Buffer
	}
	guardData?: string
	language?: number
	qosLevel?: number
}

export type CAuthenticationBeginAuthSessionViaCredentialsResponse = {
	clientId?: Long
	requestId?: Buffer
	interval?: number
	allowedConfirmations?: {
		confirmationType?: typeof enums.EAuthSessionGuardType[keyof typeof enums.EAuthSessionGuardType]
		associatedMessage?: string
	}[]
	steamid?: Long
	weakToken?: string
	agreementSessionUrl?: string
	extendedErrorMessage?: string
}

export type CAuthenticationPollAuthSessionStatusRequest = {
	clientId?: Long
	requestId?: Buffer
	tokenToRevoke?: Long
}

export type CAuthenticationPollAuthSessionStatusResponse = {
	newClientId?: Long
	newChallengeUrl?: string
	refreshToken?: string
	accessToken?: string
	hadRemoteInteraction?: boolean
	accountName?: string
	newGuardData?: string
	agreementSessionUrl?: string
}

export type CAuthenticationGetAuthSessionInfoRequest = {
	clientId?: Long
}

export type CAuthenticationGetAuthSessionInfoResponse = {
	ip?: string
	geoloc?: string
	city?: string
	state?: string
	country?: string
	platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
	deviceFriendlyName?: string
	version?: number
	loginHistory?: typeof enums.EAuthSessionSecurityHistory[keyof typeof enums.EAuthSessionSecurityHistory]
	requestorLocationMismatch?: boolean
	highUsageLogin?: boolean
	requestedPersistence?: typeof enums.ESessionPersistence[keyof typeof enums.ESessionPersistence]
}

export type CAuthenticationUpdateAuthSessionWithMobileConfirmationRequest = {
	version?: number
	clientId?: Long
	steamid?: Long
	signature?: Buffer
	confirm?: boolean
	persistence?: typeof enums.ESessionPersistence[keyof typeof enums.ESessionPersistence]
}

export type CAuthenticationUpdateAuthSessionWithMobileConfirmationResponse = {
}

export type CAuthenticationUpdateAuthSessionWithSteamGuardCodeRequest = {
	clientId?: Long
	steamid?: Long
	code?: string
	codeType?: typeof enums.EAuthSessionGuardType[keyof typeof enums.EAuthSessionGuardType]
}

export type CAuthenticationUpdateAuthSessionWithSteamGuardCodeResponse = {
	agreementSessionUrl?: string
}

export type CAuthenticationAccessTokenGenerateForAppRequest = {
	refreshToken?: string
	steamid?: Long
	renewalType?: typeof enums.ETokenRenewalType[keyof typeof enums.ETokenRenewalType]
}

export type CAuthenticationAccessTokenGenerateForAppResponse = {
	accessToken?: string
	refreshToken?: string
}

export type CAuthenticationRefreshTokenEnumerateRequest = {
}

export type CAuthenticationRefreshTokenEnumerateResponse = {
	refreshTokens?: {
		tokenId?: Long
		tokenDescription?: string
		timeUpdated?: number
		platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
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

export type CAuthenticationGetAuthSessionsForAccountRequest = {
}

export type CAuthenticationGetAuthSessionsForAccountResponse = {
	clientIds?: Long[]
}

export type CAuthenticationMigrateMobileSessionRequest = {
	steamid?: Long
	token?: string
	signature?: string
}

export type CAuthenticationMigrateMobileSessionResponse = {
	refreshToken?: string
	accessToken?: string
}

export type CAuthenticationTokenRevokeRequest = {
	token?: string
	revokeAction?: typeof enums.EAuthTokenRevokeAction[keyof typeof enums.EAuthTokenRevokeAction]
}

export type CAuthenticationTokenRevokeResponse = {
}

export type CAuthenticationRefreshTokenRevokeRequest = {
	tokenId?: Long
	steamid?: Long
	revokeAction?: typeof enums.EAuthTokenRevokeAction[keyof typeof enums.EAuthTokenRevokeAction]
	signature?: Buffer
}

export type CAuthenticationRefreshTokenRevokeResponse = {
}

export type CAuthenticationSupportQueryRefreshTokensByAccountRequest = {
	steamid?: Long
	includeRevokedTokens?: boolean
}

export type CSupportRefreshTokenDescription = {
	tokenId?: Long
	tokenDescription?: string
	timeUpdated?: number
	platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
	tokenState?: typeof enums.EAuthTokenState[keyof typeof enums.EAuthTokenState]
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

export type CAuthenticationSupportQueryRefreshTokensByAccountResponse = {
	refreshTokens?: {
		tokenId?: Long
		tokenDescription?: string
		timeUpdated?: number
		platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
		tokenState?: typeof enums.EAuthTokenState[keyof typeof enums.EAuthTokenState]
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

export type CAuthenticationSupportQueryRefreshTokenByIDRequest = {
	tokenId?: Long
}

export type CAuthenticationSupportQueryRefreshTokenByIDResponse = {
	refreshTokens?: {
		tokenId?: Long
		tokenDescription?: string
		timeUpdated?: number
		platformType?: typeof enums.EAuthTokenPlatformType[keyof typeof enums.EAuthTokenPlatformType]
		tokenState?: typeof enums.EAuthTokenState[keyof typeof enums.EAuthTokenState]
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

export type CAuthenticationSupportRevokeTokenRequest = {
	tokenId?: Long
	steamid?: Long
}

export type CAuthenticationSupportRevokeTokenResponse = {
}

export type CAuthenticationSupportGetTokenHistoryRequest = {
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

export type CAuthenticationSupportGetTokenHistoryResponse = {
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

export type CCloudGamingCreateNonceRequest = {
	platform?: string
	appid?: number
}

export type CCloudGamingCreateNonceResponse = {
	nonce?: string
	expiry?: number
}

export type CCloudGamingGetTimeRemainingRequest = {
	platform?: string
	appidList?: number[]
}

export type CCloudGamingTimeRemaining = {
	appid?: number
	minutesRemaining?: number
}

export type CCloudGamingGetTimeRemainingResponse = {
	entries?: {
		appid?: number
		minutesRemaining?: number
	}[]
}

