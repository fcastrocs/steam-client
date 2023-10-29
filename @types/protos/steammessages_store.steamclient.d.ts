/**
 * Auto-generated file
 * Sat Sep 09 2023 01:39:31 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";

export type CStore_RegisterCDKey_Request = {
	activationCode?: string
	purchasePlatform?: number
	isRequestFromClient?: boolean
}

export type CStore_PurchaseReceiptInfo = {
	transactionid?: Long
	packageid?: number
	purchaseStatus?: number
	resultDetail?: number
	transactionTime?: number
	paymentMethod?: number
	basePrice?: Long
	totalDiscount?: Long
	tax?: Long
	shipping?: Long
	currencyCode?: number
	countryCode?: string
	errorHeadline?: string
	errorString?: string
	errorLinkText?: string
	errorLinkUrl?: string
	errorAppid?: number
	lineItems?: {
		packageid?: number
		appid?: number
		lineItemDescription?: string
	}[]
}

export type CStore_RegisterCDKey_Response = {
	purchaseResultDetails?: number
	purchaseReceiptInfo?: {
		transactionid?: Long
		packageid?: number
		purchaseStatus?: number
		resultDetail?: number
		transactionTime?: number
		paymentMethod?: number
		basePrice?: Long
		totalDiscount?: Long
		tax?: Long
		shipping?: Long
		currencyCode?: number
		countryCode?: string
		errorHeadline?: string
		errorString?: string
		errorLinkText?: string
		errorLinkUrl?: string
		errorAppid?: number
		lineItems?: {
			packageid?: number
			appid?: number
			lineItemDescription?: string
		}[]
	}
}

export type CStore_GetMostPopularTags_Request = {
	language?: string
}

export type CStore_GetMostPopularTags_Response = {
	tags?: {
		tagid?: number
		name?: string
	}[]
}

export type CStore_GetLocalizedNameForTags_Request = {
	language?: string
	tagids?: number[]
}

export type CStore_GetLocalizedNameForTags_Response = {
	tags?: {
		tagid?: number
		englishName?: string
		name?: string
		normalizedName?: string
	}[]
}

export type CStore_GetTagList_Request = {
	language?: string
	haveVersionHash?: string
}

export type CStore_GetTagList_Response = {
	versionHash?: string
	tags?: {
		tagid?: number
		name?: string
	}[]
}

export type CStoreDiscoveryQueueSettings = {
	osWin?: boolean
	osMac?: boolean
	osLinux?: boolean
	fullControllerSupport?: boolean
	nativeSteamController?: boolean
	includeComingSoon?: boolean
	excludedTagids?: number[]
	excludeEarlyAccess?: boolean
	excludeVideos?: boolean
	excludeSoftware?: boolean
	excludeDlc?: boolean
	excludeSoundtracks?: boolean
	featuredTagids?: number[]
}

export type CStore_GetDiscoveryQueue_Request = {
	queueType?: EStoreDiscoveryQueueType
	countryCode?: string
	rebuildQueue?: boolean
	settingsChanged?: boolean
	settings?: {
		osWin?: boolean
		osMac?: boolean
		osLinux?: boolean
		fullControllerSupport?: boolean
		nativeSteamController?: boolean
		includeComingSoon?: boolean
		excludedTagids?: number[]
		excludeEarlyAccess?: boolean
		excludeVideos?: boolean
		excludeSoftware?: boolean
		excludeDlc?: boolean
		excludeSoundtracks?: boolean
		featuredTagids?: number[]
	}
	rebuildQueueIfStale?: boolean
	ignoreUserPreferences?: boolean
	noExperimentalResults?: boolean
	experimentalCohort?: number
	debugGetSolrQuery?: boolean
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number
		}
		contentHubFilter?: {
			hubType?: string
			hubCategory?: string
			hubTagid?: number
			discountFilter?: EContentHubDiscountFilterType
			optin?: {
				name?: string
				optinTagid?: number
				pruneTagid?: number
				optinOnly?: boolean
			}
		}
		storeFilters?: {
			filterJson?: string
			cacheKey?: string
		}[]
	}
}

export type CStore_GetDiscoveryQueue_Response = {
	appids?: number[]
	countryCode?: string
	settings?: {
		osWin?: boolean
		osMac?: boolean
		osLinux?: boolean
		fullControllerSupport?: boolean
		nativeSteamController?: boolean
		includeComingSoon?: boolean
		excludedTagids?: number[]
		excludeEarlyAccess?: boolean
		excludeVideos?: boolean
		excludeSoftware?: boolean
		excludeDlc?: boolean
		excludeSoundtracks?: boolean
		featuredTagids?: number[]
	}
	skipped?: number
	exhausted?: boolean
	experimentalCohort?: number
	debugSolrQuery?: string
}

export type CStore_GetDiscoveryQueueSettings_Request = {
	queueType?: EStoreDiscoveryQueueType
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number
		}
		contentHubFilter?: {
			hubType?: string
			hubCategory?: string
			hubTagid?: number
			discountFilter?: EContentHubDiscountFilterType
			optin?: {
				name?: string
				optinTagid?: number
				pruneTagid?: number
				optinOnly?: boolean
			}
		}
		storeFilters?: {
			filterJson?: string
			cacheKey?: string
		}[]
	}
}

export type CStore_GetDiscoveryQueueSettings_Response = {
	countryCode?: string
	settings?: {
		osWin?: boolean
		osMac?: boolean
		osLinux?: boolean
		fullControllerSupport?: boolean
		nativeSteamController?: boolean
		includeComingSoon?: boolean
		excludedTagids?: number[]
		excludeEarlyAccess?: boolean
		excludeVideos?: boolean
		excludeSoftware?: boolean
		excludeDlc?: boolean
		excludeSoundtracks?: boolean
		featuredTagids?: number[]
	}
}

export type CStore_SkipDiscoveryQueueItem_Request = {
	queueType?: EStoreDiscoveryQueueType
	appid?: number
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number
		}
		contentHubFilter?: {
			hubType?: string
			hubCategory?: string
			hubTagid?: number
			discountFilter?: EContentHubDiscountFilterType
			optin?: {
				name?: string
				optinTagid?: number
				pruneTagid?: number
				optinOnly?: boolean
			}
		}
		storeFilters?: {
			filterJson?: string
			cacheKey?: string
		}[]
	}
}

export type CStore_SkipDiscoveryQueueItem_Response = {
}

export type CStore_GetUserGameInterestState_Request = {
	appid?: number
	storeAppid?: number
	betaAppid?: number
}

export type CStore_GetUserGameInterestState_Response = {
	owned?: boolean
	wishlist?: boolean
	ignored?: boolean
	following?: boolean
	inQueues?: EStoreDiscoveryQueueType[]
	queuesWithSkip?: EStoreDiscoveryQueueType[]
	queueItemsRemaining?: number[]
	queueItemsNextAppid?: number[]
	temporarilyOwned?: boolean
	queues?: {
		type?: EStoreDiscoveryQueueType
		skipped?: boolean
		itemsRemaining?: number
		nextAppid?: number
		experimentalCohort?: number
	}[]
	ignoredReason?: number
	betaStatus?: EPlaytestStatus
}

export type CStore_GetDiscoveryQueueSkippedApps_Request = {
	steamid?: Long
	queueType?: EStoreDiscoveryQueueType
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number
		}
		contentHubFilter?: {
			hubType?: string
			hubCategory?: string
			hubTagid?: number
			discountFilter?: EContentHubDiscountFilterType
			optin?: {
				name?: string
				optinTagid?: number
				pruneTagid?: number
				optinOnly?: boolean
			}
		}
		storeFilters?: {
			filterJson?: string
			cacheKey?: string
		}[]
	}
}

export type CStore_GetDiscoveryQueueSkippedApps_Response = {
	appids?: number[]
}

export type CStore_GetStorePreferences_Request = {
}

export type CStore_UserPreferences = {
	primaryLanguage?: number
	secondaryLanguages?: number
	platformWindows?: boolean
	platformMac?: boolean
	platformLinux?: boolean
	timestampUpdated?: number
	hideStoreBroadcast?: boolean
	reviewScorePreference?: EUserReviewScorePreference
	timestampContentDescriptorPreferencesUpdated?: number
	provideDeckFeedback?: EProvideDeckFeedbackPreference
	additionalLanguages?: string
}

export type CStore_UserTagPreferences = {
	tagsToExclude?: {
		tagid?: number
		name?: string
		timestampAdded?: number
	}[]
}

export type CStore_GetStorePreferences_Response = {
	preferences?: {
		primaryLanguage?: number
		secondaryLanguages?: number
		platformWindows?: boolean
		platformMac?: boolean
		platformLinux?: boolean
		timestampUpdated?: number
		hideStoreBroadcast?: boolean
		reviewScorePreference?: EUserReviewScorePreference
		timestampContentDescriptorPreferencesUpdated?: number
		provideDeckFeedback?: EProvideDeckFeedbackPreference
		additionalLanguages?: string
	}
	tagPreferences?: {
		tagsToExclude?: {
			tagid?: number
			name?: string
			timestampAdded?: number
		}[]
	}
	contentDescriptorPreferences?: {
		contentDescriptorsToExclude?: {
			contentDescriptorid?: number
			timestampAdded?: number
		}[]
	}
}

export type CStore_GetTrendingAppsAmongFriends_Request = {
	numApps?: number
	numTopFriends?: number
}

export type CStore_GetTrendingAppsAmongFriends_Response = {
	trendingApps?: {
		appid?: number
		steamidsTopFriends?: Long[]
		totalFriends?: number
	}[]
}

export type CStore_MigratePartnerLinkTracking_Notification = {
	accountid?: number
	browserid?: Long
	backfillSource?: EPartnerLinkTrackingBackfillSource
}

export type CSteamDeckCompatibility_SetFeedback_Request = {
	appid?: number
	feedback?: ESteamDeckCompatibilityFeedback
}

export type CSteamDeckCompatibility_SetFeedback_Response = {
}

export type CSteamDeckCompatibility_ShouldPrompt_Request = {
	appid?: number
}

export type CSteamDeckCompatibility_ShouldPrompt_Response = {
	prompt?: boolean
	feedbackEligible?: boolean
	existingFeedback?: ESteamDeckCompatibilityFeedback
}

export type CStore_StorePreferencesChanged_Notification = {
	preferences?: {
		primaryLanguage?: number
		secondaryLanguages?: number
		platformWindows?: boolean
		platformMac?: boolean
		platformLinux?: boolean
		timestampUpdated?: number
		hideStoreBroadcast?: boolean
		reviewScorePreference?: EUserReviewScorePreference
		timestampContentDescriptorPreferencesUpdated?: number
		provideDeckFeedback?: EProvideDeckFeedbackPreference
		additionalLanguages?: string
	}
	tagPreferences?: {
		tagsToExclude?: {
			tagid?: number
			name?: string
			timestampAdded?: number
		}[]
	}
	contentDescriptorPreferences?: {
		contentDescriptorsToExclude?: {
			contentDescriptorid?: number
			timestampAdded?: number
		}[]
	}
}

