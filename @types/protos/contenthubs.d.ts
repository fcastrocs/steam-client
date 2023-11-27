/**
 * Auto-generated file
 * Mon Nov 27 2023 00:11:40 GMT-0500 (Eastern Standard Time)
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

