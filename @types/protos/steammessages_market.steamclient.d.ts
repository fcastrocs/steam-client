/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CEconMarket_IsMarketplaceAllowed_Request = {
	webcookie?: string;
}

type CEconMarket_IsMarketplaceAllowed_Response = {
	allowed?: boolean;
	reason?: number;
	allowedAtTime?: number;
	steamguardRequiredDays?: number;
	formsRequested?: boolean;
	formsRequireVerification?: boolean;
	newDeviceCooldownDays?: number;
}

