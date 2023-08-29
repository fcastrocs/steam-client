/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CStorePageFilter = {
	saleFilter?: {
		saleTagid?: number;
	};
	contentHubFilter?: {
		hubType?: string;
		hubCategory?: string;
		hubTagid?: number;
		discountFilter?: ValueOf<typeof EContentHubDiscountFilterType>;
		optin?: {
			name?: string;
			optinTagid?: number;
			pruneTagid?: number;
			optinOnly?: boolean;
		};
	};
	storeFilters?: {
		filterJson?: string;
		cacheKey?: string;
	}[];
}

