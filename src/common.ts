export class SteamClientError extends Error {
  constructor(message: string) {
    super(message);
    super.name = "steam-client";
  }
}
