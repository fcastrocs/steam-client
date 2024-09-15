/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Sun Sep 15 2024 13:45:14 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CInventoryGetInventoryRequest = {
	appid?: number
	steamid?: Long
}

export type CInventoryResponse = {
	etag?: string
	removeditemids?: Long[]
	itemJson?: string
	itemdefJson?: string
	ticket?: Buffer
	replayed?: boolean
}

export type CInventoryExchangeItemRequest = {
	appid?: number
	steamid?: Long
	materialsitemid?: Long[]
	materialsquantity?: number[]
	outputitemdefid?: Long
}

export type CInventoryGetEligiblePromoItemDefIDsRequest = {
	appid?: number
	steamid?: Long
}

export type CInventoryGetEligiblePromoItemDefIDsResponse = {
	itemdefids?: Long[]
}

export type CInventoryAddItemRequest = {
	appid?: number
	itemdefid?: Long[]
	itempropsjson?: string[]
	itemquantity?: number[]
	steamid?: Long
	notify?: boolean
	requestid?: Long
	tradeRestriction?: boolean
	isPurchase?: boolean
}

export type CInventoryModifyItemsRequest = {
	appid?: number
	steamid?: Long
	updates?: {
		itemid?: Long
		removeProperty?: boolean
		propertyName?: string
		propertyValueBool?: boolean
		propertyValueInt?: Long
		propertyValueString?: string
		propertyValueFloat?: number
	}[]
	timestamp?: number
}

export type CInventoryConsumePlaytimeRequest = {
	appid?: number
	itemdefid?: Long
}

export type CInventoryConsumeItemRequest = {
	appid?: number
	itemid?: Long
	quantity?: number
	timestamp?: string
	steamid?: Long
	requestid?: Long
}

export type CInventoryDevSetNextDropRequest = {
	appid?: number
	itemdefid?: Long
	droptime?: string
}

export type CInventorySplitItemStackRequest = {
	appid?: number
	itemid?: Long
	quantity?: number
	steamid?: Long
}

export type CInventoryCombineItemStacksRequest = {
	appid?: number
	fromitemid?: Long
	destitemid?: Long
	quantity?: number
	steamid?: Long
}

export type CInventoryGetItemDefMetaRequest = {
	appid?: number
}

export type CInventoryGetItemDefMetaResponse = {
	modified?: number
	digest?: string
}

export type CInventoryGetUserPurchaseInfoRequest = {
}

export type CInventoryGetUserPurchaseInfoResponse = {
	ecurrency?: number
}

export type CInventoryPurchaseInitRequest = {
	appid?: number
	language?: number
	lineItems?: {
		itemdefid?: Long
		quantity?: number
	}[]
}

export type CInventoryPurchaseInitResponse = {
	orderid?: Long
	transid?: Long
}

export type CInventoryPurchaseFinalizeRequest = {
	appid?: number
	language?: number
	orderid?: Long
}

export type CInventoryInspectItemRequest = {
	itemdefid?: Long
	itemid?: Long
	tags?: string
}

export type CInventoryClientNewItemsNotification = {
	appid?: number
	inventoryResponse?: {
		etag?: string
		removeditemids?: Long[]
		itemJson?: string
		itemdefJson?: string
		ticket?: Buffer
		replayed?: boolean
	}
}

