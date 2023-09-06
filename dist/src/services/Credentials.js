export default class Credentials {
    constructor(steam) {
        this.steam = steam;
        this.serviceName = "Credentials";
    }
    async getSteamGuardDetails() {
        return this.steam.conn.sendServiceMethodCall(this.serviceName, "GetSteamGuardDetails", {});
    }
}
