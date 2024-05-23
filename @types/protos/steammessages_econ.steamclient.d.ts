/**
 * Auto-generated file
 * Wed May 22 2024 20:34:57 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CEcon_GetInventoryItemsWithDescriptions_Request = {
	steamid?: Long
	appid?: number
	contextid?: Long
	getDescriptions?: boolean
	forTradeOfferVerification?: boolean
	language?: string
	filters?: .CEcon_GetInventoryItemsWithDescriptions_Request.FilterOptions
	startAssetid?: Long
	count?: number
}

export type CEcon_Asset = {
	appid?: number
	contextid?: Long
	assetid?: Long
	classid?: Long
	instanceid?: Long
	currencyid?: number
	amount?: Long
	missing?: boolean
	estUsd?: Long
}

export type CEconItem_DescriptionLine = {
	type?: string
	value?: string
	color?: string
	label?: string
}

export type CEconItem_Action = {
	link?: string
	name?: string
}

export type CEconItem_Description = {
	appid?: number
	classid?: Long
	instanceid?: Long
	currency?: boolean
	backgroundColor?: string
	iconUrl?: string
	iconUrlLarge?: string
	descriptions?: .CEconItem_DescriptionLine[]
	tradable?: boolean
	actions?: .CEconItem_Action[]
	ownerDescriptions?: .CEconItem_DescriptionLine[]
	ownerActions?: .CEconItem_Action[]
	fraudwarnings?: string[]
	name?: string
	nameColor?: string
	type?: string
	marketName?: string
	marketHashName?: string
	marketFee?: string
	marketFeeApp?: number
	marketActions?: .CEconItem_Action[]
	commodity?: boolean
	marketTradableRestriction?: number
	marketMarketableRestriction?: number
	marketable?: boolean
	tags?: .CEconItem_Tag[]
	itemExpiration?: string
	marketBuyCountryRestriction?: string
	marketSellCountryRestriction?: string
}

export type CEconItem_Tag = {
	appid?: number
	category?: string
	internalName?: string
	localizedCategoryName?: string
	localizedTagName?: string
	color?: string
}

export type CEcon_GetInventoryItemsWithDescriptions_Response = {
	assets?: .CEcon_Asset[]
	descriptions?: .CEconItem_Description[]
	missingAssets?: .CEcon_Asset[]
	moreItems?: boolean
	lastAssetid?: Long
	totalInventoryCount?: number
}

export type CEcon_GetTradeOfferAccessToken_Request = {
	generateNewToken?: boolean
}

export type CEcon_GetTradeOfferAccessToken_Response = {
	tradeOfferAccessToken?: string
}

export type CEcon_ClientGetItemShopOverlayAuthURL_Request = {
	returnUrl?: string
}

export type CEcon_ClientGetItemShopOverlayAuthURL_Response = {
	url?: string
}

export type CEcon_GetAssetClassInfo_Request = {
	language?: string
	appid?: number
	classes?: .CEcon_GetAssetClassInfo_Request.Class[]
	highPri?: boolean
}

export type CEcon_GetAssetClassInfo_Response = {
	descriptions?: .CEconItem_Description[]
}

