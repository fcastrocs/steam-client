/**
 * Auto-generated file
 * Wed May 22 2024 20:34:57 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CInventory_GetInventory_Request = {
	appid?: number
	steamid?: Long
}

export type CInventory_Response = {
	etag?: string
	removeditemids?: Long[]
	itemJson?: string
	itemdefJson?: string
	ticket?: Buffer
	replayed?: boolean
}

export type CInventory_ExchangeItem_Request = {
	appid?: number
	steamid?: Long
	materialsitemid?: Long[]
	materialsquantity?: number[]
	outputitemdefid?: Long
}

export type CInventory_GetEligiblePromoItemDefIDs_Request = {
	appid?: number
	steamid?: Long
}

export type CInventory_GetEligiblePromoItemDefIDs_Response = {
	itemdefids?: Long[]
}

export type CInventory_AddItem_Request = {
	appid?: number
	itemdefid?: Long[]
	itempropsjson?: string[]
	steamid?: Long
	notify?: boolean
	requestid?: Long
	tradeRestriction?: boolean
	isPurchase?: boolean
}

export type CInventory_ModifyItems_Request = {
	appid?: number
	steamid?: Long
	updates?: .CInventory_ModifyItems_Request.ItemPropertyUpdate[]
	timestamp?: number
}

export type CInventory_ConsumePlaytime_Request = {
	appid?: number
	itemdefid?: Long
}

export type CInventory_ConsumeItem_Request = {
	appid?: number
	itemid?: Long
	quantity?: number
	timestamp?: string
	steamid?: Long
	requestid?: Long
}

export type CInventory_DevSetNextDrop_Request = {
	appid?: number
	itemdefid?: Long
	droptime?: string
}

export type CInventory_SplitItemStack_Request = {
	appid?: number
	itemid?: Long
	quantity?: number
	steamid?: Long
}

export type CInventory_CombineItemStacks_Request = {
	appid?: number
	fromitemid?: Long
	destitemid?: Long
	quantity?: number
	steamid?: Long
}

export type CInventory_GetItemDefMeta_Request = {
	appid?: number
}

export type CInventory_GetItemDefMeta_Response = {
	modified?: number
	digest?: string
}

export type CInventory_GetUserPurchaseInfo_Request = {
}

export type CInventory_GetUserPurchaseInfo_Response = {
	ecurrency?: number
}

export type CInventory_PurchaseInit_Request = {
	appid?: number
	language?: number
	lineItems?: .CInventory_PurchaseInit_Request.LineItem[]
}

export type CInventory_PurchaseInit_Response = {
	orderid?: Long
	transid?: Long
}

export type CInventory_PurchaseFinalize_Request = {
	appid?: number
	language?: number
	orderid?: Long
}

export type CInventory_InspectItem_Request = {
	itemdefid?: Long
	itemid?: Long
	tags?: string
}

export type CInventoryClient_NewItems_Notification = {
	appid?: number
	inventoryResponse?: .CInventory_Response
}

