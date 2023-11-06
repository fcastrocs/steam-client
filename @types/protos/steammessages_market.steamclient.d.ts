/**
 * Auto-generated file
 * Sun Nov 05 2023 23:43:25 GMT-0500 (Eastern Standard Time)
 */

import Long from "long";

export type CEconMarket_IsMarketplaceAllowed_Request = {
	webcookie?: string
}

export type CEconMarket_IsMarketplaceAllowed_Response = {
	allowed?: boolean
	reason?: number
	allowedAtTime?: number
	steamguardRequiredDays?: number
	formsRequested?: boolean
	formsRequireVerification?: boolean
	newDeviceCooldownDays?: number
}

