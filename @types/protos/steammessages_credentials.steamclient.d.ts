/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Tue Apr 15 2025 22:37:08 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CCredentialsTestAvailablePasswordRequest = {
	password?: string
	shaDigestPassword?: Buffer
	accountName?: string
}

export type CCredentialsTestAvailablePasswordResponse = {
	isValid?: boolean
}

export type CCredentialsGetSteamGuardDetailsRequest = {
	webcookie?: string
	timestampMinimumWanted?: number
	deprecatedIpaddress?: number
	ipAddress?: {
		v4?: number
		v6?: Buffer
	}
}

export type CCredentialsGetSteamGuardDetailsResponse = {
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

export type CCredentialsValidateEmailAddressRequest = {
	stoken?: string
}

export type CCredentialsValidateEmailAddressResponse = {
	wasValidated?: boolean
}

export type CCredentialsSteamGuardPhishingReportRequest = {
	paramString?: string
	ipaddressActual?: string
}

export type CCredentialsSteamGuardPhishingReportResponse = {
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

export type CCredentialsLastCredentialChangeTimeRequest = {
	userChangesOnly?: boolean
}

export type CCredentialsLastCredentialChangeTimeResponse = {
	timestampLastPasswordChange?: number
	timestampLastEmailChange?: number
	timestampLastPasswordReset?: number
}

export type CCredentialsGetAccountAuthSecretRequest = {
}

export type CCredentialsGetAccountAuthSecretResponse = {
	secretId?: number
	secret?: Buffer
}

