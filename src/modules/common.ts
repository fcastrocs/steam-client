/**
 * functions used by multiple modules
 */

import { UnknownRecord } from 'type-fest';

export class SteamClientError extends Error {
    constructor(message: string) {
        super(message);
        super.name = 'steam-client';
    }
}

export function getKeyByValue(object: UnknownRecord, value: number) {
    const key = Object.keys(object).find((k) => object[k] === value);
    if (!key) throw new SteamClientError(`Could not find key from value ${value} of ${object}`);
    return key;
}

export function isEmpty(object: UnknownRecord) {
    return Object.keys(object).length === 0;
}
