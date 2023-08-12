import Steam from "../Steam.js";

export default class Credentials {
  private readonly serviceName = "Credentials";
  constructor(private steam: Steam) { }

  async getSteamGuardDetails() {
    return this.steam.conn.sendUnified(this.serviceName, "GetSteamGuardDetails", {
      includeNewAuthentications: true,
    });
  }
}
