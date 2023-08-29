/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CAuthentication_GetPasswordRSAPublicKey_Request = {
	accountName?: string;
}

type CAuthentication_GetPasswordRSAPublicKey_Response = {
	publickeyMod?: string;
	publickeyExp?: string;
	timestamp?: Long;
}

type CAuthentication_DeviceDetails = {
	deviceFriendlyName?: string;
	platformType?: ValueOf<typeof EAuthTokenPlatformType>;
	osType?: number;
	gamingDeviceType?: number;
	clientCount?: number;
	machineId?: Buffer;
}

type CAuthentication_BeginAuthSessionViaQR_Request = {
	deviceFriendlyName?: string;
	platformType?: ValueOf<typeof EAuthTokenPlatformType>;
	deviceDetails?: {
		deviceFriendlyName?: string;
		platformType?: ValueOf<typeof EAuthTokenPlatformType>;
		osType?: number;
		gamingDeviceType?: number;
		clientCount?: number;
		machineId?: Buffer;
	};
	websiteId?: string;
}

type CAuthentication_AllowedConfirmation = {
	confirmationType?: ValueOf<typeof EAuthSessionGuardType>;
	associatedMessage?: string;
}

type CAuthentication_BeginAuthSessionViaQR_Response = {
	clientId?: Long;
	challengeUrl?: string;
	requestId?: Buffer;
	interval?: number;
	allowedConfirmations?: {
		confirmationType?: ValueOf<typeof EAuthSessionGuardType>;
		associatedMessage?: string;
	}[];
	version?: number;
}

type CAuthentication_BeginAuthSessionViaCredentials_Request = {
	deviceFriendlyName?: string;
	accountName?: string;
	encryptedPassword?: string;
	encryptionTimestamp?: Long;
	rememberLogin?: boolean;
	platformType?: ValueOf<typeof EAuthTokenPlatformType>;
	persistence?: ValueOf<typeof ESessionPersistence>;
	websiteId?: string;
	deviceDetails?: {
		deviceFriendlyName?: string;
		platformType?: ValueOf<typeof EAuthTokenPlatformType>;
		osType?: number;
		gamingDeviceType?: number;
		clientCount?: number;
		machineId?: Buffer;
	};
	guardData?: string;
	language?: number;
	qosLevel?: number;
}

type CAuthentication_BeginAuthSessionViaCredentials_Response = {
	clientId?: Long;
	requestId?: Buffer;
	interval?: number;
	allowedConfirmations?: {
		confirmationType?: ValueOf<typeof EAuthSessionGuardType>;
		associatedMessage?: string;
	}[];
	steamid?: Long;
	weakToken?: string;
	agreementSessionUrl?: string;
	extendedErrorMessage?: string;
}

type CAuthentication_PollAuthSessionStatus_Request = {
	clientId?: Long;
	requestId?: Buffer;
	tokenToRevoke?: Long;
}

type CAuthentication_PollAuthSessionStatus_Response = {
	newClientId?: Long;
	newChallengeUrl?: string;
	refreshToken?: string;
	accessToken?: string;
	hadRemoteInteraction?: boolean;
	accountName?: string;
	newGuardData?: string;
	agreementSessionUrl?: string;
}

type CAuthentication_GetAuthSessionInfo_Request = {
	clientId?: Long;
}

type CAuthentication_GetAuthSessionInfo_Response = {
	ip?: string;
	geoloc?: string;
	city?: string;
	state?: string;
	country?: string;
	platformType?: ValueOf<typeof EAuthTokenPlatformType>;
	deviceFriendlyName?: string;
	version?: number;
	loginHistory?: ValueOf<typeof EAuthSessionSecurityHistory>;
	requestorLocationMismatch?: boolean;
	highUsageLogin?: boolean;
	requestedPersistence?: ValueOf<typeof ESessionPersistence>;
}

type CAuthentication_UpdateAuthSessionWithMobileConfirmation_Request = {
	version?: number;
	clientId?: Long;
	steamid?: Long;
	signature?: Buffer;
	confirm?: boolean;
	persistence?: ValueOf<typeof ESessionPersistence>;
}

type CAuthentication_UpdateAuthSessionWithMobileConfirmation_Response = {
}

type CAuthentication_UpdateAuthSessionWithSteamGuardCode_Request = {
	clientId?: Long;
	steamid?: Long;
	code?: string;
	codeType?: ValueOf<typeof EAuthSessionGuardType>;
}

type CAuthentication_UpdateAuthSessionWithSteamGuardCode_Response = {
	agreementSessionUrl?: string;
}

type CAuthentication_AccessToken_GenerateForApp_Request = {
	refreshToken?: string;
	steamid?: Long;
	renewalType?: ValueOf<typeof ETokenRenewalType>;
}

type CAuthentication_AccessToken_GenerateForApp_Response = {
	accessToken?: string;
	refreshToken?: string;
}

type CAuthentication_RefreshToken_Enumerate_Request = {
}

type CAuthentication_RefreshToken_Enumerate_Response = {
	refreshTokens?: {
		tokenId?: Long;
		tokenDescription?: string;
		timeUpdated?: number;
		platformType?: ValueOf<typeof EAuthTokenPlatformType>;
		loggedIn?: boolean;
		osPlatform?: number;
		authType?: number;
		gamingDeviceType?: number;
		firstSeen?: {
			time?: number;
			ip?: {
				v4?: number;
				v6?: Buffer;
			};
			locale?: string;
			country?: string;
			state?: string;
			city?: string;
		};
		lastSeen?: {
			time?: number;
			ip?: {
				v4?: number;
				v6?: Buffer;
			};
			locale?: string;
			country?: string;
			state?: string;
			city?: string;
		};
		osType?: number;
	}[];
	requestingToken?: Long;
}

type CAuthentication_GetAuthSessionsForAccount_Request = {
}

type CAuthentication_GetAuthSessionsForAccount_Response = {
	clientIds?: Long[];
}

type CAuthentication_MigrateMobileSession_Request = {
	steamid?: Long;
	token?: string;
	signature?: string;
}

type CAuthentication_MigrateMobileSession_Response = {
	refreshToken?: string;
	accessToken?: string;
}

type CAuthentication_Token_Revoke_Request = {
	token?: string;
	revokeAction?: ValueOf<typeof EAuthTokenRevokeAction>;
}

type CAuthentication_Token_Revoke_Response = {
}

type CAuthentication_RefreshToken_Revoke_Request = {
	tokenId?: Long;
	steamid?: Long;
	revokeAction?: ValueOf<typeof EAuthTokenRevokeAction>;
	signature?: Buffer;
}

type CAuthentication_RefreshToken_Revoke_Response = {
}

type CAuthenticationSupport_QueryRefreshTokensByAccount_Request = {
	steamid?: Long;
	includeRevokedTokens?: boolean;
}

type CSupportRefreshTokenDescription = {
	tokenId?: Long;
	tokenDescription?: string;
	timeUpdated?: number;
	platformType?: ValueOf<typeof EAuthTokenPlatformType>;
	tokenState?: ValueOf<typeof EAuthTokenState>;
	ownerSteamid?: Long;
	osPlatform?: number;
	osType?: number;
	authType?: number;
	gamingDeviceType?: number;
	firstSeen?: {
		time?: number;
		ip?: {
			v4?: number;
			v6?: Buffer;
		};
		country?: string;
		state?: string;
		city?: string;
	};
	lastSeen?: {
		time?: number;
		ip?: {
			v4?: number;
			v6?: Buffer;
		};
		country?: string;
		state?: string;
		city?: string;
	};
}

type CAuthenticationSupport_QueryRefreshTokensByAccount_Response = {
	refreshTokens?: {
		tokenId?: Long;
		tokenDescription?: string;
		timeUpdated?: number;
		platformType?: ValueOf<typeof EAuthTokenPlatformType>;
		tokenState?: ValueOf<typeof EAuthTokenState>;
		ownerSteamid?: Long;
		osPlatform?: number;
		osType?: number;
		authType?: number;
		gamingDeviceType?: number;
		firstSeen?: {
			time?: number;
			ip?: {
				v4?: number;
				v6?: Buffer;
			};
			country?: string;
			state?: string;
			city?: string;
		};
		lastSeen?: {
			time?: number;
			ip?: {
				v4?: number;
				v6?: Buffer;
			};
			country?: string;
			state?: string;
			city?: string;
		};
	}[];
	lastTokenReset?: number;
}

type CAuthenticationSupport_QueryRefreshTokenByID_Request = {
	tokenId?: Long;
}

type CAuthenticationSupport_QueryRefreshTokenByID_Response = {
	refreshTokens?: {
		tokenId?: Long;
		tokenDescription?: string;
		timeUpdated?: number;
		platformType?: ValueOf<typeof EAuthTokenPlatformType>;
		tokenState?: ValueOf<typeof EAuthTokenState>;
		ownerSteamid?: Long;
		osPlatform?: number;
		osType?: number;
		authType?: number;
		gamingDeviceType?: number;
		firstSeen?: {
			time?: number;
			ip?: {
				v4?: number;
				v6?: Buffer;
			};
			country?: string;
			state?: string;
			city?: string;
		};
		lastSeen?: {
			time?: number;
			ip?: {
				v4?: number;
				v6?: Buffer;
			};
			country?: string;
			state?: string;
			city?: string;
		};
	}[];
}

type CAuthenticationSupport_RevokeToken_Request = {
	tokenId?: Long;
	steamid?: Long;
}

type CAuthenticationSupport_RevokeToken_Response = {
}

type CAuthenticationSupport_GetTokenHistory_Request = {
	tokenId?: Long;
}

type CSupportRefreshTokenAudit = {
	action?: number;
	time?: number;
	ip?: {
		v4?: number;
		v6?: Buffer;
	};
	actor?: Long;
}

type CAuthenticationSupport_GetTokenHistory_Response = {
	history?: {
		action?: number;
		time?: number;
		ip?: {
			v4?: number;
			v6?: Buffer;
		};
		actor?: Long;
	}[];
}

type CCloudGaming_CreateNonce_Request = {
	platform?: string;
	appid?: number;
}

type CCloudGaming_CreateNonce_Response = {
	nonce?: string;
	expiry?: number;
}

type CCloudGaming_GetTimeRemaining_Request = {
	platform?: string;
	appidList?: number[];
}

type CCloudGaming_TimeRemaining = {
	appid?: number;
	minutesRemaining?: number;
}

type CCloudGaming_GetTimeRemaining_Response = {
	entries?: {
		appid?: number;
		minutesRemaining?: number;
	}[];
}

