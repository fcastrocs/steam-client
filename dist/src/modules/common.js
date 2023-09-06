export class SteamClientError extends Error {
    constructor(message) {
        super(message);
        super.name = "steam-client";
    }
}
export function getKeyByValue(object, value) {
    const key = Object.keys(object).find((key) => object[key] === value);
    if (!key)
        throw new SteamClientError(`Could not find key from value ${value} of ${object}`);
    return key;
}
export function isEmpty(object) {
    return Object.keys(object).length === 0;
}
