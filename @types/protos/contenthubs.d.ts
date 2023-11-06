/**
 * Auto-generated file
 * Sun Nov 05 2023 23:43:25 GMT-0500 (Eastern Standard Time)
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

