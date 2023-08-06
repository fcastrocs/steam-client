import { T } from "../@types/common";

export class SteamClientError extends Error {
  constructor(message: string) {
    super(message);
    super.name = "steam-client";
  }
}

export function getKeyByValue(object: T, value: number) {
  const key = Object.keys(object).find(key => object[key] === value);
  if (!key) throw new SteamClientError(`Could not find key from value ${value} of ${object}`)
  return key;
}