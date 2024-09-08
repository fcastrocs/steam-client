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

export async function PromiseTimeout<T>(promise: Promise<T>, options: { ms: number; timeOutErrMsg: string }) {
    return new Promise<Awaited<T>>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(options.timeOutErrMsg));
        }, options.ms);

        promise
            .then((result) => {
                resolve(result as Awaited<T>);
            })
            .catch((err) => {
                reject(err);
            })
            .finally(() => {
                clearTimeout(timeout);
            });
    });
}

export async function PromiseAllTimeout<T extends unknown[] | []>(p: T, options: { ms: number; timeOutErrMsg: string }) {
    return new Promise<{ [P in keyof T]: Awaited<T[P]> }>((resolve, reject) => {
        const timeOut = setTimeout(() => {
            reject(new Error(options.timeOutErrMsg));
        }, options.ms);

        Promise.all(p)
            .then((results) => {
                resolve(results as { [P in keyof T]: Awaited<T[P]> });
            })
            .catch((err) => {
                reject(err);
            })
            .finally(() => {
                clearTimeout(timeOut);
            });
    });
}
