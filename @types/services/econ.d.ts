import { Steam } from '../all-types';

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
    constructor(steam: Steam);
    getSteamContextItems(tradableOnly?: boolean): Promise<Item[]>;
    getInventoryItems(appid: number, contextid: number, tradableOnly?: boolean): Promise<Item[]>;
}
