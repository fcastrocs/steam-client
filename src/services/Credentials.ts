import Steam from "../Steam.js";

export default class CredentialsService {
  private readonly serviceName = "Credentials";
  constructor(private steam: Steam) {}

  async getSteamGuardDetails() {
    return await this.steam.sendUnified(this.serviceName, "GetSteamGuardDetails", {
      includeNewAuthentications: true,
    });
  }
}
