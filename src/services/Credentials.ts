import Steam from "../Steam.js";

export default class Credentials {
  private readonly serviceName = "Credentials";
  constructor(private steam: Steam) {}

  async getSteamGuardDetails(): Promise<CCredentials_GetSteamGuardDetails_Response> {
    return this.steam.conn.sendServiceMethodCall(this.serviceName, "GetSteamGuardDetails", {});
  }
}
