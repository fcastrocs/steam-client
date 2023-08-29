/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CStore_RegisterCDKey_Request = {
	activationCode?: string;
	purchasePlatform?: number;
	isRequestFromClient?: boolean;
}

type CStore_PurchaseReceiptInfo = {
	transactionid?: Long;
	packageid?: number;
	purchaseStatus?: number;
	resultDetail?: number;
	transactionTime?: number;
	paymentMethod?: number;
	basePrice?: Long;
	totalDiscount?: Long;
	tax?: Long;
	shipping?: Long;
	currencyCode?: number;
	countryCode?: string;
	errorHeadline?: string;
	errorString?: string;
	errorLinkText?: string;
	errorLinkUrl?: string;
	errorAppid?: number;
	lineItems?: {
		packageid?: number;
		appid?: number;
		lineItemDescription?: string;
	}[];
}

type CStore_RegisterCDKey_Response = {
	purchaseResultDetails?: number;
	purchaseReceiptInfo?: {
		transactionid?: Long;
		packageid?: number;
		purchaseStatus?: number;
		resultDetail?: number;
		transactionTime?: number;
		paymentMethod?: number;
		basePrice?: Long;
		totalDiscount?: Long;
		tax?: Long;
		shipping?: Long;
		currencyCode?: number;
		countryCode?: string;
		errorHeadline?: string;
		errorString?: string;
		errorLinkText?: string;
		errorLinkUrl?: string;
		errorAppid?: number;
		lineItems?: {
			packageid?: number;
			appid?: number;
			lineItemDescription?: string;
		}[];
	};
}

type CStore_GetMostPopularTags_Request = {
	language?: string;
}

type CStore_GetMostPopularTags_Response = {
	tags?: {
		tagid?: number;
		name?: string;
	}[];
}

type CStore_GetLocalizedNameForTags_Request = {
	language?: string;
	tagids?: number[];
}

type CStore_GetLocalizedNameForTags_Response = {
	tags?: {
		tagid?: number;
		englishName?: string;
		name?: string;
		normalizedName?: string;
	}[];
}

type CStore_GetTagList_Request = {
	language?: string;
	haveVersionHash?: string;
}

type CStore_GetTagList_Response = {
	versionHash?: string;
	tags?: {
		tagid?: number;
		name?: string;
	}[];
}

type CStoreDiscoveryQueueSettings = {
	osWin?: boolean;
	osMac?: boolean;
	osLinux?: boolean;
	fullControllerSupport?: boolean;
	nativeSteamController?: boolean;
	includeComingSoon?: boolean;
	excludedTagids?: number[];
	excludeEarlyAccess?: boolean;
	excludeVideos?: boolean;
	excludeSoftware?: boolean;
	excludeDlc?: boolean;
	excludeSoundtracks?: boolean;
	featuredTagids?: number[];
}

type CStore_GetDiscoveryQueue_Request = {
	queueType?: ValueOf<typeof EStoreDiscoveryQueueType>;
	countryCode?: string;
	rebuildQueue?: boolean;
	settingsChanged?: boolean;
	settings?: {
		osWin?: boolean;
		osMac?: boolean;
		osLinux?: boolean;
		fullControllerSupport?: boolean;
		nativeSteamController?: boolean;
		includeComingSoon?: boolean;
		excludedTagids?: number[];
		excludeEarlyAccess?: boolean;
		excludeVideos?: boolean;
		excludeSoftware?: boolean;
		excludeDlc?: boolean;
		excludeSoundtracks?: boolean;
		featuredTagids?: number[];
	};
	rebuildQueueIfStale?: boolean;
	ignoreUserPreferences?: boolean;
	noExperimentalResults?: boolean;
	experimentalCohort?: number;
	debugGetSolrQuery?: boolean;
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number;
		};
		contentHubFilter?: {
			hubType?: string;
			hubCategory?: string;
			hubTagid?: number;
			discountFilter?: ValueOf<typeof EContentHubDiscountFilterType>;
			optin?: {
				name?: string;
				optinTagid?: number;
				pruneTagid?: number;
				optinOnly?: boolean;
			};
		};
		storeFilters?: {
			filterJson?: string;
			cacheKey?: string;
		}[];
	};
}

type CStore_GetDiscoveryQueue_Response = {
	appids?: number[];
	countryCode?: string;
	settings?: {
		osWin?: boolean;
		osMac?: boolean;
		osLinux?: boolean;
		fullControllerSupport?: boolean;
		nativeSteamController?: boolean;
		includeComingSoon?: boolean;
		excludedTagids?: number[];
		excludeEarlyAccess?: boolean;
		excludeVideos?: boolean;
		excludeSoftware?: boolean;
		excludeDlc?: boolean;
		excludeSoundtracks?: boolean;
		featuredTagids?: number[];
	};
	skipped?: number;
	exhausted?: boolean;
	experimentalCohort?: number;
	debugSolrQuery?: string;
}

type CStore_GetDiscoveryQueueSettings_Request = {
	queueType?: ValueOf<typeof EStoreDiscoveryQueueType>;
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number;
		};
		contentHubFilter?: {
			hubType?: string;
			hubCategory?: string;
			hubTagid?: number;
			discountFilter?: ValueOf<typeof EContentHubDiscountFilterType>;
			optin?: {
				name?: string;
				optinTagid?: number;
				pruneTagid?: number;
				optinOnly?: boolean;
			};
		};
		storeFilters?: {
			filterJson?: string;
			cacheKey?: string;
		}[];
	};
}

type CStore_GetDiscoveryQueueSettings_Response = {
	countryCode?: string;
	settings?: {
		osWin?: boolean;
		osMac?: boolean;
		osLinux?: boolean;
		fullControllerSupport?: boolean;
		nativeSteamController?: boolean;
		includeComingSoon?: boolean;
		excludedTagids?: number[];
		excludeEarlyAccess?: boolean;
		excludeVideos?: boolean;
		excludeSoftware?: boolean;
		excludeDlc?: boolean;
		excludeSoundtracks?: boolean;
		featuredTagids?: number[];
	};
}

type CStore_SkipDiscoveryQueueItem_Request = {
	queueType?: ValueOf<typeof EStoreDiscoveryQueueType>;
	appid?: number;
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number;
		};
		contentHubFilter?: {
			hubType?: string;
			hubCategory?: string;
			hubTagid?: number;
			discountFilter?: ValueOf<typeof EContentHubDiscountFilterType>;
			optin?: {
				name?: string;
				optinTagid?: number;
				pruneTagid?: number;
				optinOnly?: boolean;
			};
		};
		storeFilters?: {
			filterJson?: string;
			cacheKey?: string;
		}[];
	};
}

type CStore_SkipDiscoveryQueueItem_Response = {
}

type CStore_GetUserGameInterestState_Request = {
	appid?: number;
	storeAppid?: number;
	betaAppid?: number;
}

type CStore_GetUserGameInterestState_Response = {
	owned?: boolean;
	wishlist?: boolean;
	ignored?: boolean;
	following?: boolean;
	inQueues?: ValueOf<typeof EStoreDiscoveryQueueType>[];
	queuesWithSkip?: ValueOf<typeof EStoreDiscoveryQueueType>[];
	queueItemsRemaining?: number[];
	queueItemsNextAppid?: number[];
	temporarilyOwned?: boolean;
	queues?: {
		type?: ValueOf<typeof EStoreDiscoveryQueueType>;
		skipped?: boolean;
		itemsRemaining?: number;
		nextAppid?: number;
		experimentalCohort?: number;
	}[];
	ignoredReason?: number;
	betaStatus?: ValueOf<typeof EPlaytestStatus>;
}

type CStore_GetDiscoveryQueueSkippedApps_Request = {
	steamid?: Long;
	queueType?: ValueOf<typeof EStoreDiscoveryQueueType>;
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number;
		};
		contentHubFilter?: {
			hubType?: string;
			hubCategory?: string;
			hubTagid?: number;
			discountFilter?: ValueOf<typeof EContentHubDiscountFilterType>;
			optin?: {
				name?: string;
				optinTagid?: number;
				pruneTagid?: number;
				optinOnly?: boolean;
			};
		};
		storeFilters?: {
			filterJson?: string;
			cacheKey?: string;
		}[];
	};
}

type CStore_GetDiscoveryQueueSkippedApps_Response = {
	appids?: number[];
}

type CStore_GetStorePreferences_Request = {
}

type CStore_UserPreferences = {
	primaryLanguage?: number;
	secondaryLanguages?: number;
	platformWindows?: boolean;
	platformMac?: boolean;
	platformLinux?: boolean;
	timestampUpdated?: number;
	hideStoreBroadcast?: boolean;
	reviewScorePreference?: ValueOf<typeof EUserReviewScorePreference>;
	timestampContentDescriptorPreferencesUpdated?: number;
	provideDeckFeedback?: ValueOf<typeof EProvideDeckFeedbackPreference>;
	additionalLanguages?: string;
}

type CStore_UserTagPreferences = {
	tagsToExclude?: {
		tagid?: number;
		name?: string;
		timestampAdded?: number;
	}[];
}

type CStore_GetStorePreferences_Response = {
	preferences?: {
		primaryLanguage?: number;
		secondaryLanguages?: number;
		platformWindows?: boolean;
		platformMac?: boolean;
		platformLinux?: boolean;
		timestampUpdated?: number;
		hideStoreBroadcast?: boolean;
		reviewScorePreference?: ValueOf<typeof EUserReviewScorePreference>;
		timestampContentDescriptorPreferencesUpdated?: number;
		provideDeckFeedback?: ValueOf<typeof EProvideDeckFeedbackPreference>;
		additionalLanguages?: string;
	};
	tagPreferences?: {
		tagsToExclude?: {
			tagid?: number;
			name?: string;
			timestampAdded?: number;
		}[];
	};
	contentDescriptorPreferences?: {
		contentDescriptorsToExclude?: {
			contentDescriptorid?: number;
			timestampAdded?: number;
		}[];
	};
}

type CStore_GetTrendingAppsAmongFriends_Request = {
	numApps?: number;
	numTopFriends?: number;
}

type CStore_GetTrendingAppsAmongFriends_Response = {
	trendingApps?: {
		appid?: number;
		steamidsTopFriends?: Long[];
		totalFriends?: number;
	}[];
}

type CStore_MigratePartnerLinkTracking_Notification = {
	accountid?: number;
	browserid?: Long;
	backfillSource?: ValueOf<typeof EPartnerLinkTrackingBackfillSource>;
}

type CSteamDeckCompatibility_SetFeedback_Request = {
	appid?: number;
	feedback?: ValueOf<typeof ESteamDeckCompatibilityFeedback>;
}

type CSteamDeckCompatibility_SetFeedback_Response = {
}

type CSteamDeckCompatibility_ShouldPrompt_Request = {
	appid?: number;
}

type CSteamDeckCompatibility_ShouldPrompt_Response = {
	prompt?: boolean;
	feedbackEligible?: boolean;
	existingFeedback?: ValueOf<typeof ESteamDeckCompatibilityFeedback>;
}

type CStore_StorePreferencesChanged_Notification = {
	preferences?: {
		primaryLanguage?: number;
		secondaryLanguages?: number;
		platformWindows?: boolean;
		platformMac?: boolean;
		platformLinux?: boolean;
		timestampUpdated?: number;
		hideStoreBroadcast?: boolean;
		reviewScorePreference?: ValueOf<typeof EUserReviewScorePreference>;
		timestampContentDescriptorPreferencesUpdated?: number;
		provideDeckFeedback?: ValueOf<typeof EProvideDeckFeedbackPreference>;
		additionalLanguages?: string;
	};
	tagPreferences?: {
		tagsToExclude?: {
			tagid?: number;
			name?: string;
			timestampAdded?: number;
		}[];
	};
	contentDescriptorPreferences?: {
		contentDescriptorsToExclude?: {
			contentDescriptorid?: number;
			timestampAdded?: number;
		}[];
	};
}

