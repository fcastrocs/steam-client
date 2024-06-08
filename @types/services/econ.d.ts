import { Steam } from '../Steam.js';

export type Item = {
    appid: number;
    contextid: string;
    assetid: string;
    classid: string;
    instanceid: string;
    amount?: string;
    iconUrl: string;
    marketName: string;
    type: string;
    tradable: boolean;
    marketable: boolean;
    marketTradableRestriction: number;
};

export class Econ {
    private steam;

    private readonly serviceName;
    constructor(steam: Steam);
    getSteamContextItems(tradableOnly?: boolean): Promise<Item[]>;
    getInventoryItems(appid: number, contextid: number, tradableOnly?: boolean): Promise<Item[]>;
}
