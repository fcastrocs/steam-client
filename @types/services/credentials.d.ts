import { GetSteamGuardDetails_Response } from "../protos/credentials.protos";

declare class Credentials {
  constructor(steam: Steam);
  getSteamGuardDetails(): Promise<GetSteamGuardDetails_Response>;
}

export default Credentials;