/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Wed May 22 2024 21:33:31 GMT-0400 (Eastern Daylight Time)
 */

import Long from 'long';
import { ValueOf } from 'type-fest';

export type CEconMarketIsMarketplaceAllowedRequest = {
    webcookie?: string;
};

export type CEconMarketIsMarketplaceAllowedResponse = {
    allowed?: boolean;
    reason?: number;
    allowedAtTime?: number;
    steamguardRequiredDays?: number;
    formsRequested?: boolean;
    formsRequireVerification?: boolean;
    newDeviceCooldownDays?: number;
};
