import { T } from "../../@types/common.js";
import { Item } from "../../@types/services/Econ.js";
import Steam from "../Steam.js";

export default class Econ {
  private readonly serviceName = "Econ";
  constructor(private steam: Steam) {}

  async getSteamContextItems(tradableOnly?: boolean) {
    return this.getInventoryItems(753, 6, tradableOnly);
  }

  async getInventoryItems(appid: number, contextid: number, tradableOnly?: boolean) {
    const res = await this.steam.conn.sendUnified(this.serviceName, "GetInventoryItemsWithDescriptions", {
      steamid: this.steam.steamId,
      contextid,
      appid,
      getDescriptions: true,
      filters: {
        tradableOnly: !!tradableOnly,
      },
    });

    if (!res.assets) {
      return [];
    }

    return (res.assets as T[]).map((item) => {
      const d_index = res.descriptions.findIndex((des: T) => item.instanceid.toString() === des.instanceid.toString());

      return {
        appid: item.appid,
        contextid: item.contextid.toString(),
        assetid: item.assetid.toString(),
        classid: item.classid.toString(),
        instanceid: item.instanceid.toString(),
        iconUrl: res.descriptions[d_index].iconUrl,
        marketName: res.descriptions[d_index].marketName,
        type: res.descriptions[d_index].type,
        tradable: res.descriptions[d_index].tradable,
        marketable: res.descriptions[d_index].marketable,
        marketTradableRestriction: res.descriptions[d_index].marketTradableRestriction,
      } as Item;
    });
  }
}
