/**
 * Auto-generated file
 * Mon May 20 2024 23:27:32 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CStorePageFilter = {
	saleFilter?: {
		saleTagid?: number
	}
	contentHubFilter?: {
		hubType?: string
		hubCategory?: string
		hubTagid?: number
		discountFilter?: typeof EContentHubDiscountFilterType[keyof typeof EContentHubDiscountFilterType]
		optin?: {
			name?: string
			optinTagid?: number
			pruneTagid?: number
			optinOnly?: boolean
		}
	}
	storeFilters?: {
		filterJson?: string
		cacheKey?: string
	}[]
}

