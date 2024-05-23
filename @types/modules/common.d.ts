/**
 * functions used by multiple modules
 */
import { UnknownRecord } from 'type-fest';

export declare class SteamClientError extends Error {
    constructor(message: string);
}
export declare function getKeyByValue(object: UnknownRecord, value: number): string;
export declare function isEmpty(object: UnknownRecord): boolean;
