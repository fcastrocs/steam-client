/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Thu Sep 05 2024 23:44:42 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CMsgClientHeartBeat = {
	sendReply?: boolean
}

export type CMsgClientServerTimestampRequest = {
	clientRequestTimestamp?: Long
}

export type CMsgClientServerTimestampResponse = {
	clientRequestTimestamp?: Long
	serverTimestampMs?: Long
}

export type CMsgClientSecret = {
	version?: number
	appid?: number
	deviceid?: number
	nonce?: Long
	hmac?: Buffer
}

export type CMsgClientHello = {
	protocolVersion?: number
}

export type CMsgClientLogon = {
	protocolVersion?: number
	deprecatedObfustucatedPrivateIp?: number
	cellId?: number
	lastSessionId?: number
	clientPackageVersion?: number
	clientLanguage?: string
	clientOsType?: number
	shouldRememberPassword?: boolean
	wineVersion?: string
	deprecated_10?: number
	obfuscatedPrivateIp?: {
		v4?: number
		v6?: Buffer
	}
	deprecatedPublicIp?: number
	qosLevel?: number
	clientSuppliedSteamId?: Long
	publicIp?: {
		v4?: number
		v6?: Buffer
	}
	machineId?: Buffer
	launcherType?: number
	uiMode?: number
	chatMode?: number
	steam2AuthTicket?: Buffer
	emailAddress?: string
	rtime32AccountCreation?: number
	accountName?: string
	password?: string
	gameServerToken?: string
	loginKey?: string
	wasConvertedDeprecatedMsg?: boolean
	anonUserTargetAccountName?: string
	resolvedUserSteamId?: Long
	eresultSentryfile?: number
	shaSentryfile?: Buffer
	authCode?: string
	otpType?: number
	otpValue?: number
	otpIdentifier?: string
	steam2TicketRequest?: boolean
	sonyPsnTicket?: Buffer
	sonyPsnServiceId?: string
	createNewPsnLinkedAccountIfNeeded?: boolean
	sonyPsnName?: string
	gameServerAppId?: number
	steamguardDontRememberComputer?: boolean
	machineName?: string
	machineNameUserchosen?: string
	countryOverride?: string
	isSteamBox?: boolean
	clientInstanceId?: Long
	twoFactorCode?: string
	supportsRateLimitResponse?: boolean
	webLogonNonce?: string
	priorityReason?: number
	embeddedClientSecret?: {
		version?: number
		appid?: number
		deviceid?: number
		nonce?: Long
		hmac?: Buffer
	}
	disablePartnerAutogrants?: boolean
	isSteamDeck?: boolean
	accessToken?: string
	isChromeOs?: boolean
	isTesla?: boolean
}

export type CMsgClientLogOnResponse = {
	eresult?: number
	legacyOutOfGameHeartbeatSeconds?: number
	heartbeatSeconds?: number
	deprecatedPublicIp?: number
	rtime32ServerTime?: number
	accountFlags?: number
	cellId?: number
	emailDomain?: string
	steam2Ticket?: Buffer
	eresultExtended?: number
	cellIdPingThreshold?: number
	deprecatedUsePics?: boolean
	vanityUrl?: string
	publicIp?: {
		v4?: number
		v6?: Buffer
	}
	userCountry?: string
	clientSuppliedSteamid?: Long
	ipCountryCode?: string
	parentalSettings?: Buffer
	parentalSettingSignature?: Buffer
	countLoginfailuresToMigrate?: number
	countDisconnectsToMigrate?: number
	ogsDataReportTimeWindow?: number
	clientInstanceId?: Long
	forceClientUpdateCheck?: boolean
	agreementSessionUrl?: string
	tokenId?: Long
	familyGroupId?: Long
}

export type CMsgClientRequestWebAPIAuthenticateUserNonce = {
	tokenType?: number
}

export type CMsgClientRequestWebAPIAuthenticateUserNonceResponse = {
	eresult?: number
	webapiAuthenticateUserNonce?: string
	tokenType?: number
}

export type CMsgClientLogOff = {
}

export type CMsgClientLoggedOff = {
	eresult?: number
}

export type CMsgClientNewLoginKey = {
	uniqueId?: number
	loginKey?: string
}

export type CMsgClientNewLoginKeyAccepted = {
	uniqueId?: number
}

export type CMsgClientAccountInfo = {
	personaName?: string
	ipCountry?: string
	countAuthedComputers?: number
	accountFlags?: number
	facebookId?: Long
	facebookName?: string
	steamguardMachineNameUserChosen?: string
	isPhoneVerified?: boolean
	twoFactorState?: number
	isPhoneIdentifying?: boolean
	isPhoneNeedingReverify?: boolean
}

export type CMsgClientChallengeRequest = {
	steamid?: Long
}

export type CMsgClientChallengeResponse = {
	challenge?: Long
}

