import { EResult } from "../language/EResult.ts";
import { EMsg } from "../language/enums_clientserver.ts";
import Client from "./Client.js";

export type Language = {
    EMsgMap: Map<EMsg, keyof EMsg>;
    EResultMap: Map<EResult, keyof EResult>;
    EResult: EResult;
    EMsg: EMsg;
};

export class SteamClientError extends Error {
    constructor(message: string);
}

export default Client;
