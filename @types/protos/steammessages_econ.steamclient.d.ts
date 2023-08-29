/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CEcon_GetInventoryItemsWithDescriptions_Request = {
	steamid?: Long;
	appid?: number;
	contextid?: Long;
	getDescriptions?: boolean;
	forTradeOfferVerification?: boolean;
	language?: string;
	filters?: {
		assetids?: Long[];
		currencyids?: number[];
		tradableOnly?: boolean;
		marketableOnly?: boolean;
	};
	startAssetid?: Long;
	count?: number;
}

type CEcon_Asset = {
	appid?: number;
	contextid?: Long;
	assetid?: Long;
	classid?: Long;
	instanceid?: Long;
	currencyid?: number;
	amount?: Long;
	missing?: boolean;
	estUsd?: Long;
}

type CEconItem_DescriptionLine = {
	type?: string;
	value?: string;
	color?: string;
	label?: string;
}

type CEconItem_Action = {
	link?: string;
	name?: string;
}

type CEconItem_Description = {
	appid?: number;
	classid?: Long;
	instanceid?: Long;
	currency?: boolean;
	backgroundColor?: string;
	iconUrl?: string;
	iconUrlLarge?: string;
	descriptions?: {
		type?: string;
		value?: string;
		color?: string;
		label?: string;
	}[];
	tradable?: boolean;
	actions?: {
		link?: string;
		name?: string;
	}[];
	ownerDescriptions?: {
		type?: string;
		value?: string;
		color?: string;
		label?: string;
	}[];
	ownerActions?: {
		link?: string;
		name?: string;
	}[];
	fraudwarnings?: string[];
	name?: string;
	nameColor?: string;
	type?: string;
	marketName?: string;
	marketHashName?: string;
	marketFee?: string;
	marketFeeApp?: number;
	marketActions?: {
		link?: string;
		name?: string;
	}[];
	commodity?: boolean;
	marketTradableRestriction?: number;
	marketMarketableRestriction?: number;
	marketable?: boolean;
	tags?: {
		appid?: number;
		category?: string;
		internalName?: string;
		localizedCategoryName?: string;
		localizedTagName?: string;
		color?: string;
	}[];
	itemExpiration?: string;
	marketBuyCountryRestriction?: string;
	marketSellCountryRestriction?: string;
}

type CEconItem_Tag = {
	appid?: number;
	category?: string;
	internalName?: string;
	localizedCategoryName?: string;
	localizedTagName?: string;
	color?: string;
}

type CEcon_GetInventoryItemsWithDescriptions_Response = {
	assets?: {
		appid?: number;
		contextid?: Long;
		assetid?: Long;
		classid?: Long;
		instanceid?: Long;
		currencyid?: number;
		amount?: Long;
		missing?: boolean;
		estUsd?: Long;
	}[];
	descriptions?: {
		appid?: number;
		classid?: Long;
		instanceid?: Long;
		currency?: boolean;
		backgroundColor?: string;
		iconUrl?: string;
		iconUrlLarge?: string;
		descriptions?: {
			type?: string;
			value?: string;
			color?: string;
			label?: string;
		}[];
		tradable?: boolean;
		actions?: {
			link?: string;
			name?: string;
		}[];
		ownerDescriptions?: {
			type?: string;
			value?: string;
			color?: string;
			label?: string;
		}[];
		ownerActions?: {
			link?: string;
			name?: string;
		}[];
		fraudwarnings?: string[];
		name?: string;
		nameColor?: string;
		type?: string;
		marketName?: string;
		marketHashName?: string;
		marketFee?: string;
		marketFeeApp?: number;
		marketActions?: {
			link?: string;
			name?: string;
		}[];
		commodity?: boolean;
		marketTradableRestriction?: number;
		marketMarketableRestriction?: number;
		marketable?: boolean;
		tags?: {
			appid?: number;
			category?: string;
			internalName?: string;
			localizedCategoryName?: string;
			localizedTagName?: string;
			color?: string;
		}[];
		itemExpiration?: string;
		marketBuyCountryRestriction?: string;
		marketSellCountryRestriction?: string;
	}[];
	missingAssets?: {
		appid?: number;
		contextid?: Long;
		assetid?: Long;
		classid?: Long;
		instanceid?: Long;
		currencyid?: number;
		amount?: Long;
		missing?: boolean;
		estUsd?: Long;
	}[];
	moreItems?: boolean;
	lastAssetid?: Long;
	totalInventoryCount?: number;
}

type CEcon_GetTradeOfferAccessToken_Request = {
	generateNewToken?: boolean;
}

type CEcon_GetTradeOfferAccessToken_Response = {
	tradeOfferAccessToken?: string;
}

type CEcon_ClientGetItemShopOverlayAuthURL_Request = {
	returnUrl?: string;
}

type CEcon_ClientGetItemShopOverlayAuthURL_Response = {
	url?: string;
}

type CEcon_GetAssetClassInfo_Request = {
	language?: string;
	appid?: number;
	classes?: {
		classid?: Long;
		instanceid?: Long;
	}[];
	highPri?: boolean;
}

type CEcon_GetAssetClassInfo_Response = {
	descriptions?: {
		appid?: number;
		classid?: Long;
		instanceid?: Long;
		currency?: boolean;
		backgroundColor?: string;
		iconUrl?: string;
		iconUrlLarge?: string;
		descriptions?: {
			type?: string;
			value?: string;
			color?: string;
			label?: string;
		}[];
		tradable?: boolean;
		actions?: {
			link?: string;
			name?: string;
		}[];
		ownerDescriptions?: {
			type?: string;
			value?: string;
			color?: string;
			label?: string;
		}[];
		ownerActions?: {
			link?: string;
			name?: string;
		}[];
		fraudwarnings?: string[];
		name?: string;
		nameColor?: string;
		type?: string;
		marketName?: string;
		marketHashName?: string;
		marketFee?: string;
		marketFeeApp?: number;
		marketActions?: {
			link?: string;
			name?: string;
		}[];
		commodity?: boolean;
		marketTradableRestriction?: number;
		marketMarketableRestriction?: number;
		marketable?: boolean;
		tags?: {
			appid?: number;
			category?: string;
			internalName?: string;
			localizedCategoryName?: string;
			localizedTagName?: string;
			color?: string;
		}[];
		itemExpiration?: string;
		marketBuyCountryRestriction?: string;
		marketSellCountryRestriction?: string;
	}[];
}

