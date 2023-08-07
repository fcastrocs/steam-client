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
  constructor(steam: Steam);
  getSteamContextItems(tradableOnly?: boolean): Promise<Item[]>;
  getInventoryItems(appid: number, contextid: number, tradableOnly?: boolean): Promise<Item[]>;
}

export default Econ;