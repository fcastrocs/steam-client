import type Steam from "../steam.js";

export type Item = {
  appid: number;
  contextid: string;
  assetid: string;
  classid: sting;
  instanceid: string;
  amount?: string;
  iconUrl: string;
  marketName: string;
  type: string;
  tradable: boolean;
  marketable: boolean;
  marketTradableRestriction: number;
};

declare class Econ {
  constructor(private steam: Steam);
  getSteamContextItems(tradableOnly?: boolean): Promise<Item[]>;
  getInventoryItems(appid: number, contextid: number, tradableOnly?: boolean): Promise<Item[]>;
}

export default Econ;
