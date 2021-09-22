import * as Long from "long";

/**
 * @returns 64-bit Steam ID
 */
export default function SteamIdToString(accountId: string): string {
  const parsedId = parseInt(accountId, 10);
  // use default values
  const instance = 1;
  const type = 1;
  const universe = 1;

  const long = new Long(parsedId, instance | (type << 20) | (universe << 24));
  return long.toString();
}
