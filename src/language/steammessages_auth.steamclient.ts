/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

export const EAuthTokenPlatformType = {
	Unknown: 0,
	SteamClient: 1,
	WebBrowser: 2,
	MobileApp: 3,
}

export const EAuthSessionGuardType = {
	Unknown: 0,
	None: 1,
	EmailCode: 2,
	DeviceCode: 3,
	DeviceConfirmation: 4,
	EmailConfirmation: 5,
	MachineToken: 6,
	LegacyMachineAuth: 7,
}

export const EAuthSessionSecurityHistory = {
	Invalid: 0,
	UsedPreviously: 1,
	NoPriorHistory: 2,
}

export const ETokenRenewalType = {
	None: 0,
	Allow: 1,
}

export const EAuthTokenRevokeAction = {
	EAuthTokenRevokeLogout: 0,
	EAuthTokenRevokePermanent: 1,
	EAuthTokenRevokeReplaced: 2,
	EAuthTokenRevokeSupport: 3,
	EAuthTokenRevokeConsume: 4,
	EAuthTokenRevokeNonRememberedLogout: 5,
	EAuthTokenRevokeNonRememberedPermanent: 6,
	EAuthTokenRevokeAutomatic: 7,
}

export const EAuthTokenState = {
	Invalid: 0,
	New: 1,
	Confirmed: 2,
	Issued: 3,
	Denied: 4,
	LoggedOut: 5,
	Consumed: 6,
	Revoked: 99,
}

