/**
 * Auto-generated file
 * Wed Sep 06 2023 10:11:32 GMT-0400 (Eastern Daylight Time)
 */
export var EAuthTokenPlatformType;
(function (EAuthTokenPlatformType) {
    EAuthTokenPlatformType[EAuthTokenPlatformType["Unknown"] = 0] = "Unknown";
    EAuthTokenPlatformType[EAuthTokenPlatformType["SteamClient"] = 1] = "SteamClient";
    EAuthTokenPlatformType[EAuthTokenPlatformType["WebBrowser"] = 2] = "WebBrowser";
    EAuthTokenPlatformType[EAuthTokenPlatformType["MobileApp"] = 3] = "MobileApp";
})(EAuthTokenPlatformType || (EAuthTokenPlatformType = {}));
export var EAuthSessionGuardType;
(function (EAuthSessionGuardType) {
    EAuthSessionGuardType[EAuthSessionGuardType["Unknown"] = 0] = "Unknown";
    EAuthSessionGuardType[EAuthSessionGuardType["None"] = 1] = "None";
    EAuthSessionGuardType[EAuthSessionGuardType["EmailCode"] = 2] = "EmailCode";
    EAuthSessionGuardType[EAuthSessionGuardType["DeviceCode"] = 3] = "DeviceCode";
    EAuthSessionGuardType[EAuthSessionGuardType["DeviceConfirmation"] = 4] = "DeviceConfirmation";
    EAuthSessionGuardType[EAuthSessionGuardType["EmailConfirmation"] = 5] = "EmailConfirmation";
    EAuthSessionGuardType[EAuthSessionGuardType["MachineToken"] = 6] = "MachineToken";
    EAuthSessionGuardType[EAuthSessionGuardType["LegacyMachineAuth"] = 7] = "LegacyMachineAuth";
})(EAuthSessionGuardType || (EAuthSessionGuardType = {}));
export var EAuthSessionSecurityHistory;
(function (EAuthSessionSecurityHistory) {
    EAuthSessionSecurityHistory[EAuthSessionSecurityHistory["Invalid"] = 0] = "Invalid";
    EAuthSessionSecurityHistory[EAuthSessionSecurityHistory["UsedPreviously"] = 1] = "UsedPreviously";
    EAuthSessionSecurityHistory[EAuthSessionSecurityHistory["NoPriorHistory"] = 2] = "NoPriorHistory";
})(EAuthSessionSecurityHistory || (EAuthSessionSecurityHistory = {}));
export var ETokenRenewalType;
(function (ETokenRenewalType) {
    ETokenRenewalType[ETokenRenewalType["None"] = 0] = "None";
    ETokenRenewalType[ETokenRenewalType["Allow"] = 1] = "Allow";
})(ETokenRenewalType || (ETokenRenewalType = {}));
export var EAuthTokenRevokeAction;
(function (EAuthTokenRevokeAction) {
    EAuthTokenRevokeAction[EAuthTokenRevokeAction["EAuthTokenRevokeLogout"] = 0] = "EAuthTokenRevokeLogout";
    EAuthTokenRevokeAction[EAuthTokenRevokeAction["EAuthTokenRevokePermanent"] = 1] = "EAuthTokenRevokePermanent";
    EAuthTokenRevokeAction[EAuthTokenRevokeAction["EAuthTokenRevokeReplaced"] = 2] = "EAuthTokenRevokeReplaced";
    EAuthTokenRevokeAction[EAuthTokenRevokeAction["EAuthTokenRevokeSupport"] = 3] = "EAuthTokenRevokeSupport";
    EAuthTokenRevokeAction[EAuthTokenRevokeAction["EAuthTokenRevokeConsume"] = 4] = "EAuthTokenRevokeConsume";
    EAuthTokenRevokeAction[EAuthTokenRevokeAction["EAuthTokenRevokeNonRememberedLogout"] = 5] = "EAuthTokenRevokeNonRememberedLogout";
    EAuthTokenRevokeAction[EAuthTokenRevokeAction["EAuthTokenRevokeNonRememberedPermanent"] = 6] = "EAuthTokenRevokeNonRememberedPermanent";
    EAuthTokenRevokeAction[EAuthTokenRevokeAction["EAuthTokenRevokeAutomatic"] = 7] = "EAuthTokenRevokeAutomatic";
})(EAuthTokenRevokeAction || (EAuthTokenRevokeAction = {}));
export var EAuthTokenState;
(function (EAuthTokenState) {
    EAuthTokenState[EAuthTokenState["Invalid"] = 0] = "Invalid";
    EAuthTokenState[EAuthTokenState["New"] = 1] = "New";
    EAuthTokenState[EAuthTokenState["Confirmed"] = 2] = "Confirmed";
    EAuthTokenState[EAuthTokenState["Issued"] = 3] = "Issued";
    EAuthTokenState[EAuthTokenState["Denied"] = 4] = "Denied";
    EAuthTokenState[EAuthTokenState["LoggedOut"] = 5] = "LoggedOut";
    EAuthTokenState[EAuthTokenState["Consumed"] = 6] = "Consumed";
    EAuthTokenState[EAuthTokenState["Revoked"] = 99] = "Revoked";
})(EAuthTokenState || (EAuthTokenState = {}));
