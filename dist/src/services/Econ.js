import Long from "long";
export default class Econ {
    constructor(steam) {
        this.steam = steam;
        this.serviceName = "Econ";
    }
    async getSteamContextItems(tradableOnly) {
        return this.getInventoryItems(753, 6, tradableOnly);
    }
    async getInventoryItems(appid, contextid, tradableOnly) {
        const res = await this.steam.conn.sendServiceMethodCall(this.serviceName, "GetInventoryItemsWithDescriptions", {
            steamid: this.steam.steamId,
            contextid: Long.fromInt(contextid, true),
            appid,
            getDescriptions: true,
            filters: {
                tradableOnly: !!tradableOnly,
            },
        });
        if (!res.assets) {
            return [];
        }
        return res.assets.map((item) => {
            const d_index = res.descriptions.findIndex((des) => item.instanceid.toString() === des.instanceid.toString());
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
            };
        });
    }
}
