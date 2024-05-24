/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Thu May 23 2024 22:57:11 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CEconGetInventoryItemsWithDescriptionsRequest = {
	steamid?: Long
	appid?: number
	contextid?: Long
	getDescriptions?: boolean
	forTradeOfferVerification?: boolean
	language?: string
	filters?: {
		assetids?: Long[]
		currencyids?: number[]
		tradableOnly?: boolean
		marketableOnly?: boolean
	}
	startAssetid?: Long
	count?: number
}

export type CEconAsset = {
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

export type CEconItemDescriptionLine = {
	type?: string
	value?: string
	color?: string
	label?: string
}

export type CEconItemAction = {
	link?: string
	name?: string
}

export type CEconItemDescription = {
	appid?: number
	classid?: Long
	instanceid?: Long
	currency?: boolean
	backgroundColor?: string
	iconUrl?: string
	iconUrlLarge?: string
	descriptions?: {
		type?: string
		value?: string
		color?: string
		label?: string
	}[]
	tradable?: boolean
	actions?: {
		link?: string
		name?: string
	}[]
	ownerDescriptions?: {
		type?: string
		value?: string
		color?: string
		label?: string
	}[]
	ownerActions?: {
		link?: string
		name?: string
	}[]
	fraudwarnings?: string[]
	name?: string
	nameColor?: string
	type?: string
	marketName?: string
	marketHashName?: string
	marketFee?: string
	marketFeeApp?: number
	marketActions?: {
		link?: string
		name?: string
	}[]
	commodity?: boolean
	marketTradableRestriction?: number
	marketMarketableRestriction?: number
	marketable?: boolean
	tags?: {
		appid?: number
		category?: string
		internalName?: string
		localizedCategoryName?: string
		localizedTagName?: string
		color?: string
	}[]
	itemExpiration?: string
	marketBuyCountryRestriction?: string
	marketSellCountryRestriction?: string
}

export type CEconItemTag = {
	appid?: number
	category?: string
	internalName?: string
	localizedCategoryName?: string
	localizedTagName?: string
	color?: string
}

export type CEconGetInventoryItemsWithDescriptionsResponse = {
	assets?: {
		appid?: number
		contextid?: Long
		assetid?: Long
		classid?: Long
		instanceid?: Long
		currencyid?: number
		amount?: Long
		missing?: boolean
		estUsd?: Long
	}[]
	descriptions?: {
		appid?: number
		classid?: Long
		instanceid?: Long
		currency?: boolean
		backgroundColor?: string
		iconUrl?: string
		iconUrlLarge?: string
		descriptions?: {
			type?: string
			value?: string
			color?: string
			label?: string
		}[]
		tradable?: boolean
		actions?: {
			link?: string
			name?: string
		}[]
		ownerDescriptions?: {
			type?: string
			value?: string
			color?: string
			label?: string
		}[]
		ownerActions?: {
			link?: string
			name?: string
		}[]
		fraudwarnings?: string[]
		name?: string
		nameColor?: string
		type?: string
		marketName?: string
		marketHashName?: string
		marketFee?: string
		marketFeeApp?: number
		marketActions?: {
			link?: string
			name?: string
		}[]
		commodity?: boolean
		marketTradableRestriction?: number
		marketMarketableRestriction?: number
		marketable?: boolean
		tags?: {
			appid?: number
			category?: string
			internalName?: string
			localizedCategoryName?: string
			localizedTagName?: string
			color?: string
		}[]
		itemExpiration?: string
		marketBuyCountryRestriction?: string
		marketSellCountryRestriction?: string
	}[]
	missingAssets?: {
		appid?: number
		contextid?: Long
		assetid?: Long
		classid?: Long
		instanceid?: Long
		currencyid?: number
		amount?: Long
		missing?: boolean
		estUsd?: Long
	}[]
	moreItems?: boolean
	lastAssetid?: Long
	totalInventoryCount?: number
}

export type CEconGetTradeOfferAccessTokenRequest = {
	generateNewToken?: boolean
}

export type CEconGetTradeOfferAccessTokenResponse = {
	tradeOfferAccessToken?: string
}

export type CEconClientGetItemShopOverlayAuthURLRequest = {
	returnUrl?: string
}

export type CEconClientGetItemShopOverlayAuthURLResponse = {
	url?: string
}

export type CEconGetAssetClassInfoRequest = {
	language?: string
	appid?: number
	classes?: {
		classid?: Long
		instanceid?: Long
	}[]
	highPri?: boolean
}

export type CEconGetAssetClassInfoResponse = {
	descriptions?: {
		appid?: number
		classid?: Long
		instanceid?: Long
		currency?: boolean
		backgroundColor?: string
		iconUrl?: string
		iconUrlLarge?: string
		descriptions?: {
			type?: string
			value?: string
			color?: string
			label?: string
		}[]
		tradable?: boolean
		actions?: {
			link?: string
			name?: string
		}[]
		ownerDescriptions?: {
			type?: string
			value?: string
			color?: string
			label?: string
		}[]
		ownerActions?: {
			link?: string
			name?: string
		}[]
		fraudwarnings?: string[]
		name?: string
		nameColor?: string
		type?: string
		marketName?: string
		marketHashName?: string
		marketFee?: string
		marketFeeApp?: number
		marketActions?: {
			link?: string
			name?: string
		}[]
		commodity?: boolean
		marketTradableRestriction?: number
		marketMarketableRestriction?: number
		marketable?: boolean
		tags?: {
			appid?: number
			category?: string
			internalName?: string
			localizedCategoryName?: string
			localizedTagName?: string
			color?: string
		}[]
		itemExpiration?: string
		marketBuyCountryRestriction?: string
		marketSellCountryRestriction?: string
	}[]
}

