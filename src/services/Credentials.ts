import { GetSteamGuardDetails_Response } from "../../@types/protos/credentials.protos.js";
import Steam from "../Steam.js";

export default class Credentials {
  private readonly serviceName = "Credentials";
  constructor(private steam: Steam) { }

  async getSteamGuardDetails(): Promise<GetSteamGuardDetails_Response> {
    return this.steam.conn.sendServiceMethodCall(this.serviceName, "GetSteamGuardDetails", {}) as Promise<GetSteamGuardDetails_Response>;
  }
}
