export default class Credentials {
    steam;
    serviceName = "Credentials";
    constructor(steam) {
        this.steam = steam;
    }
    async getSteamGuardDetails() {
        return await this.steam.sendUnified(this.serviceName, "GetSteamGuardDetails", {
            includeNewAuthentications: true,
        });
    }
}
