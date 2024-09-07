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

export async function PromiseTimeout<T>(p: PromiseLike<T>, options: { ms?: number; timeOutErrMsg: string }): Promise<Awaited<T>> {
    let timer: NodeJS.Timeout;
    const ms = options.ms || 15000;

    const timeOut = new Promise((_, reject) => {
        timer = setTimeout(() => {
            reject(new SteamClientError(options.timeOutErrMsg));
        }, ms);
    });

    try {
        const results = await Promise.race([p, timeOut]);
        return results as Awaited<T>;
    } finally {
        clearTimeout(timer);
    }
}

export async function allWithTimeout<T extends unknown[] | []>(
    p: T,
    options: { ms: number; timeOutErrMsg: string }
): Promise<{ [P in keyof T]: Awaited<T[P]> }> {
    let timer: NodeJS.Timeout;

    const timeOut = new Promise((_, reject) => {
        timer = setTimeout(() => {
            reject(new SteamClientError(options.timeOutErrMsg));
        }, options.ms);
    });

    try {
        const results = await Promise.race([Promise.allSettled(p), timeOut]);
        return results as { [P in keyof T]: Awaited<T[P]> };
    } finally {
        clearTimeout(timer);
    }
}
