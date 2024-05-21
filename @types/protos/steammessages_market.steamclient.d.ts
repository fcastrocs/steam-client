/**
 * Auto-generated file
 * Mon May 20 2024 23:27:32 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

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

