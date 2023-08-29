/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CMsgClientHeartBeat = {
	sendReply?: boolean;
}

type CMsgClientServerTimestampRequest = {
	clientRequestTimestamp?: Long;
}

type CMsgClientServerTimestampResponse = {
	clientRequestTimestamp?: Long;
	serverTimestampMs?: Long;
}

type CMsgClientSecret = {
	version?: number;
	appid?: number;
	deviceid?: number;
	nonce?: Long;
	hmac?: Buffer;
}

type CMsgClientHello = {
	protocolVersion?: number;
}

type CMsgClientLogon = {
	protocolVersion?: number;
	deprecatedObfustucatedPrivateIp?: number;
	cellId?: number;
	lastSessionId?: number;
	clientPackageVersion?: number;
	clientLanguage?: string;
	clientOsType?: number;
	shouldRememberPassword?: boolean;
	wineVersion?: string;
	deprecated_10?: number;
	obfuscatedPrivateIp?: {
		v4?: number;
		v6?: Buffer;
	};
	deprecatedPublicIp?: number;
	qosLevel?: number;
	clientSuppliedSteamId?: Long;
	publicIp?: {
		v4?: number;
		v6?: Buffer;
	};
	machineId?: Buffer;
	launcherType?: number;
	uiMode?: number;
	chatMode?: number;
	steam2AuthTicket?: Buffer;
	emailAddress?: string;
	rtime32AccountCreation?: number;
	accountName?: string;
	password?: string;
	gameServerToken?: string;
	loginKey?: string;
	wasConvertedDeprecatedMsg?: boolean;
	anonUserTargetAccountName?: string;
	resolvedUserSteamId?: Long;
	eresultSentryfile?: number;
	shaSentryfile?: Buffer;
	authCode?: string;
	otpType?: number;
	otpValue?: number;
	otpIdentifier?: string;
	steam2TicketRequest?: boolean;
	sonyPsnTicket?: Buffer;
	sonyPsnServiceId?: string;
	createNewPsnLinkedAccountIfNeeded?: boolean;
	sonyPsnName?: string;
	gameServerAppId?: number;
	steamguardDontRememberComputer?: boolean;
	machineName?: string;
	machineNameUserchosen?: string;
	countryOverride?: string;
	isSteamBox?: boolean;
	clientInstanceId?: Long;
	twoFactorCode?: string;
	supportsRateLimitResponse?: boolean;
	webLogonNonce?: string;
	priorityReason?: number;
	embeddedClientSecret?: {
		version?: number;
		appid?: number;
		deviceid?: number;
		nonce?: Long;
		hmac?: Buffer;
	};
	disablePartnerAutogrants?: boolean;
	isSteamDeck?: boolean;
	accessToken?: string;
	isChromeOs?: boolean;
	isTesla?: boolean;
}

type CMsgClientLogOnResponse = {
	eresult?: number;
	legacyOutOfGameHeartbeatSeconds?: number;
	heartbeatSeconds?: number;
	deprecatedPublicIp?: number;
	rtime32ServerTime?: number;
	accountFlags?: number;
	cellId?: number;
	emailDomain?: string;
	steam2Ticket?: Buffer;
	eresultExtended?: number;
	webapiAuthenticateUserNonce?: string;
	cellIdPingThreshold?: number;
	deprecatedUsePics?: boolean;
	vanityUrl?: string;
	publicIp?: {
		v4?: number;
		v6?: Buffer;
	};
	userCountry?: string;
	clientSuppliedSteamid?: Long;
	ipCountryCode?: string;
	parentalSettings?: Buffer;
	parentalSettingSignature?: Buffer;
	countLoginfailuresToMigrate?: number;
	countDisconnectsToMigrate?: number;
	ogsDataReportTimeWindow?: number;
	clientInstanceId?: Long;
	forceClientUpdateCheck?: boolean;
	agreementSessionUrl?: string;
	tokenId?: Long;
}

type CMsgClientRequestWebAPIAuthenticateUserNonce = {
	tokenType?: number;
}

type CMsgClientRequestWebAPIAuthenticateUserNonceResponse = {
	eresult?: number;
	webapiAuthenticateUserNonce?: string;
	tokenType?: number;
}

type CMsgClientLogOff = {
}

type CMsgClientLoggedOff = {
	eresult?: number;
}

type CMsgClientNewLoginKey = {
	uniqueId?: number;
	loginKey?: string;
}

type CMsgClientNewLoginKeyAccepted = {
	uniqueId?: number;
}

type CMsgClientAccountInfo = {
	personaName?: string;
	ipCountry?: string;
	countAuthedComputers?: number;
	accountFlags?: number;
	facebookId?: Long;
	facebookName?: string;
	steamguardMachineNameUserChosen?: string;
	isPhoneVerified?: boolean;
	twoFactorState?: number;
	isPhoneIdentifying?: boolean;
	isPhoneNeedingReverify?: boolean;
}

type CMsgClientChallengeRequest = {
	steamid?: Long;
}

type CMsgClientChallengeResponse = {
	challenge?: Long;
}

