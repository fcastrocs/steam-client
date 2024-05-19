/**
 * Auto-generated file
 * Fri Feb 02 2024 20:32:00 GMT-0500 (Eastern Standard Time)
 */

import Long from 'long';
import { ValueOf } from 'type-fest';

export type CStorePageFilter = {
    saleFilter?: {
        saleTagid?: number;
    };
    contentHubFilter?: {
        hubType?: string;
        hubCategory?: string;
        hubTagid?: number;
        discountFilter?: (typeof EContentHubDiscountFilterType)[keyof typeof EContentHubDiscountFilterType];
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
};
