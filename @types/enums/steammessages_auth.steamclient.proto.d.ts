export interface EAuthSessionGuardType
{
	"Unknown": 0,
	"None": 1,
	"EmailCode": 2,
	"DeviceCode": 3,
	"DeviceConfirmation": 4,
	"EmailConfirmation": 5,
	"MachineToken": 6,
	"LegacyMachineAuth": 7
}
export interface EAuthSessionSecurityHistory
{
	"Invalid": 0,
	"UsedPreviously": 1,
	"NoPriorHistory": 2
}
export interface EAuthTokenPlatformType
{
	"Unknown": 0,
	"SteamClient": 1,
	"WebBrowser": 2,
	"MobileApp": 3
}
export interface EAuthTokenRevokeAction
{
	"Logout": 0,
	"Permanent": 1,
	"Replaced": 2,
	"Support": 3,
	"Consume": 4,
	"NonRememberedLogout": 5,
	"NonRememberedPermanent": 6,
	"utomatic": 7
}
export interface EAuthTokenState
{
	"Invalid": 0,
	"New": 1,
	"Confirmed": 2,
	"Issued": 3,
	"Denied": 4,
	"LoggedOut": 5,
	"Consumed": 6,
	"Revoked": 99
}
export interface ETokenRenewalType
{
	"None": 0,
	"Allow": 1
}
