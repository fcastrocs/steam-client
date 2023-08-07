declare class Credentials {
  constructor(steam: Steam);
  getSteamGuardDetails(): Promise<T>;
}

export default Credentials;