/**
 * Auto-generated file
 * Sat Sep 09 2023 01:39:31 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";

export type CStorePageFilter = {
	saleFilter?: {
		saleTagid?: number
	}
	contentHubFilter?: {
		hubType?: string
		hubCategory?: string
		hubTagid?: number
		discountFilter?: EContentHubDiscountFilterType
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

