/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CInventory_GetInventory_Request = {
	appid?: number;
	steamid?: Long;
}

type CInventory_Response = {
	etag?: string;
	removeditemids?: Long[];
	itemJson?: string;
	itemdefJson?: string;
	ticket?: Buffer;
	replayed?: boolean;
}

type CInventory_ExchangeItem_Request = {
	appid?: number;
	steamid?: Long;
	materialsitemid?: Long[];
	materialsquantity?: number[];
	outputitemdefid?: Long;
}

type CInventory_GetEligiblePromoItemDefIDs_Request = {
	appid?: number;
	steamid?: Long;
}

type CInventory_GetEligiblePromoItemDefIDs_Response = {
	itemdefids?: Long[];
}

type CInventory_AddItem_Request = {
	appid?: number;
	itemdefid?: Long[];
	itempropsjson?: string[];
	steamid?: Long;
	notify?: boolean;
	requestid?: Long;
	tradeRestriction?: boolean;
	isPurchase?: boolean;
}

type CInventory_ModifyItems_Request = {
	appid?: number;
	steamid?: Long;
	updates?: {
		itemid?: Long;
		removeProperty?: boolean;
		propertyName?: string;
		propertyValueBool?: boolean;
		propertyValueInt?: Long;
		propertyValueString?: string;
		propertyValueFloat?: number;
	}[];
	timestamp?: number;
}

type CInventory_ConsumePlaytime_Request = {
	appid?: number;
	itemdefid?: Long;
}

type CInventory_ConsumeItem_Request = {
	appid?: number;
	itemid?: Long;
	quantity?: number;
	timestamp?: string;
	steamid?: Long;
	requestid?: Long;
}

type CInventory_DevSetNextDrop_Request = {
	appid?: number;
	itemdefid?: Long;
	droptime?: string;
}

type CInventory_SplitItemStack_Request = {
	appid?: number;
	itemid?: Long;
	quantity?: number;
	steamid?: Long;
}

type CInventory_CombineItemStacks_Request = {
	appid?: number;
	fromitemid?: Long;
	destitemid?: Long;
	quantity?: number;
	steamid?: Long;
}

type CInventory_GetItemDefMeta_Request = {
	appid?: number;
}

type CInventory_GetItemDefMeta_Response = {
	modified?: number;
	digest?: string;
}

type CInventory_GetUserPurchaseInfo_Request = {
}

type CInventory_GetUserPurchaseInfo_Response = {
	ecurrency?: number;
}

type CInventory_PurchaseInit_Request = {
	appid?: number;
	language?: number;
	lineItems?: {
		itemdefid?: Long;
		quantity?: number;
	}[];
}

type CInventory_PurchaseInit_Response = {
	orderid?: Long;
	transid?: Long;
}

type CInventory_PurchaseFinalize_Request = {
	appid?: number;
	language?: number;
	orderid?: Long;
}

type CInventory_InspectItem_Request = {
	itemdefid?: Long;
	itemid?: Long;
	tags?: string;
}

type CInventoryClient_NewItems_Notification = {
	appid?: number;
	inventoryResponse?: {
		etag?: string;
		removeditemids?: Long[];
		itemJson?: string;
		itemdefJson?: string;
		ticket?: Buffer;
		replayed?: boolean;
	};
}

