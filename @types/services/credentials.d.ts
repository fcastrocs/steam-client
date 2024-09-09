/* eslint-disable import/prefer-default-export */

import { Steam, CCredentialsGetSteamGuardDetailsResponse } from '../all-types';

export class Credentials {
    constructor(steam: Steam);
    getSteamGuardDetails(): Promise<CCredentialsGetSteamGuardDetailsResponse>;
}
