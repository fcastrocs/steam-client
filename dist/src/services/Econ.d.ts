import Steam from "../Steam.js";
import type { Item } from "../../@types/services/Econ.js";
export default class Econ {
    private steam;
    private readonly serviceName;
    constructor(steam: Steam);
    getSteamContextItems(tradableOnly?: boolean): Promise<Item[]>;
    getInventoryItems(appid: number, contextid: number, tradableOnly?: boolean): Promise<Item[]>;
}
