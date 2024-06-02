/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Thu May 23 2024 22:57:11 GMT-0400 (Eastern Daylight Time)
 */

import Long from 'long';
import { ValueOf } from 'type-fest';
import * as enums from '../../resources/language/contenthubs.js';

export type CStorePageFilter = {
    saleFilter?: {
        saleTagid?: number;
    };
    contentHubFilter?: {
        hubType?: string;
        hubCategory?: string;
        hubTagid?: number;
        discountFilter?: (typeof enums.EContentHubDiscountFilterType)[keyof typeof enums.EContentHubDiscountFilterType];
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
