/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Wed Jun 19 2024 20:24:16 GMT-0400 (Eastern Daylight Time)
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
