/**
 * Auto-generated file
 * Wed Sep 06 2023 10:11:32 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";

export type CCredentials_TestAvailablePassword_Request = {
	password?: string
	shaDigestPassword?: Buffer
	accountName?: string
}

export type CCredentials_TestAvailablePassword_Response = {
	isValid?: boolean
}

export type CCredentials_GetSteamGuardDetails_Request = {
	webcookie?: string
	timestampMinimumWanted?: number
	deprecatedIpaddress?: number
	ipAddress?: {
		v4?: number
		v6?: Buffer
	}
}

export type CCredentials_GetSteamGuardDetails_Response = {
	isSteamguardEnabled?: boolean
	timestampSteamguardEnabled?: number
	deprecatedMachineNameUserchosen?: string
	deprecatedTimestampMachineSteamguardEnabled?: number
	deprecatedAuthenticationExistsFromGeolocBeforeMintime?: boolean
	deprecatedMachineId?: Long
	sessionData?: {
		machineId?: Long
		machineNameUserchosen?: string
		timestampMachineSteamguardEnabled?: number
		authenticationExistsFromGeolocBeforeMintime?: boolean
		authenticationExistsFromSameIpBeforeMintime?: boolean
		publicIpv4?: number
		publicIpAddress?: string
	}[]
	isTwofactorEnabled?: boolean
	timestampTwofactorEnabled?: number
	isPhoneVerified?: boolean
}

export type CCredentials_ValidateEmailAddress_Request = {
	stoken?: string
}

export type CCredentials_ValidateEmailAddress_Response = {
	wasValidated?: boolean
}

export type CCredentials_SteamGuardPhishingReport_Request = {
	paramString?: string
	ipaddressActual?: string
}

export type CCredentials_SteamGuardPhishingReport_Response = {
	ipaddressLoginattempt?: string
	countrynameLoginattempt?: string
	statenameLoginattempt?: string
	citynameLoginattempt?: string
	ipaddressActual?: string
	countrynameActual?: string
	statenameActual?: string
	citynameActual?: string
	steamguardCode?: string
}

export type CCredentials_LastCredentialChangeTime_Request = {
	userChangesOnly?: boolean
}

export type CCredentials_LastCredentialChangeTime_Response = {
	timestampLastPasswordChange?: number
	timestampLastEmailChange?: number
	timestampLastPasswordReset?: number
}

export type CCredentials_GetAccountAuthSecret_Request = {
}

export type CCredentials_GetAccountAuthSecret_Response = {
	secretId?: number
	secret?: Buffer
}

