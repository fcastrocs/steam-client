export default class SteamClientError extends Error {
    constructor(message) {
        super(message);
        super.name = "steam-client";
    }
}
