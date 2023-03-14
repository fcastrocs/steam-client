import Long from "long";

interface Item {
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
}

export default interface IEcon {
  getInventoryItems(appId: number, contextId: number): Promise<Item[]>;
  getSteamContextItems(): Promise<Item[]>;
}
