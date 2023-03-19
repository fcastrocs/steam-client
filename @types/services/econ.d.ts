import Long from "long";

export interface Item {
  appid: number;
  contextid: string;
  assetid: string;
  classid: sting;
  instanceid: string;
  amount: string;
  iconUrl: string;
  marketName: string;
  type: string;
  tradable: boolean;
  marketable: boolean;
  marketTradableRestriction: boolean;
}

declare class Econ {
  getInventoryItems(appId: number, contextId: number, tradableOnly?: boolean): Promise<Item[]>;
  getSteamContextItems(tradableOnly?: boolean): Promise<Item[]>;
}

export default Econ;
