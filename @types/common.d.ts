// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = any;

export class SteamClientError extends Error {
  constructor(message: string);
}
