export type GetSteamGuardDetails_Response = {
    EResult: number;
    isSteamguardEnabled: boolean;
    timestampSteamguardEnabled: number;
    isTwofactorEnabled: boolean;
    timestampTwofactorEnabled: number;
    isPhoneVerified: boolean;
}