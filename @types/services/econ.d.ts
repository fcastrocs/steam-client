import Long from "long";

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
}

export type GetInventoryItemsWithDescriptions_Request = {
  steamid: Long;
  appid: number;
  contextid: Long;
  getDescriptions: boolean
  forTradeOfferVerification: boolean;
  language: string;
  filters?: {
    assetids: Long[];
    currencyids: number[];
    tradableOnly: boolean;
    marketableOnly: boolean;
  }
  start_assetid: Long;
  count: number;
}

type Asset = {
  appid: number;
  contextid: Long;
  assetid: Long;
  classid: Long;
  instanceid: Long;
  currencyid: number;
  amount: Long;
  missing: boolean;
  estUsd: Long;
}

export type GetInventoryItemsWithDescriptions_Response = {
  assets: Asset[],
  descriptions: CEconItem_Description[]
  missingAssets: Asset[];
  moreItems: boolean;
  lastAssetid: Long;
  totalInventoryCount: number;
}

type CEconItem_Action = {
  link: string;
  name: string;
}

type CEconItem_DescriptionLine = {
  type: string;
  value: string;
}

type CEconItem_Tag = {
  category: string;
  internalName: string;
  localizedCategoryName: string;
  localizedTagName: string;
}

type CEconItem_Description = {
  appid: number;
  classid: Long;
  instanceid: Long;
  currency: boolean;
  backgroundColor: string;
  iconUrl: string;
  iconUrlLarge: string;
  descriptions: CEconItem_DescriptionLine
  tradable: boolean;
  ownerActions: CEconItem_Action[];
  name: string;
  type: string;
  marketName: string;
  marketHashName: string;
  commodity: boolean;
  marketTradableRestriction: number;
  marketMarketableRestriction: number;
  marketable: boolean;
  tags: CEconItem_Tag[];
  marketFeeApp: number;
}

declare class Econ {
  constructor(steam: Steam);
  getSteamContextItems(tradableOnly?: boolean): Promise<Item[]>;
  getInventoryItems(appid: number, contextid: number, tradableOnly?: boolean): Promise<Item[]>;
}

export default Econ;