/**
 * Auto-generated file
 * Mon Nov 27 2023 00:11:40 GMT-0500 (Eastern Standard Time)
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

