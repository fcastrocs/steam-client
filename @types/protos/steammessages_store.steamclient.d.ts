/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Thu Sep 05 2024 23:44:42 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";
import * as enums from "../../resources/language/steammessages_store.steamclient.js";

export type CStoreRegisterCDKeyRequest = {
	activationCode?: string
	purchasePlatform?: number
	isRequestFromClient?: boolean
}

export type CStorePurchaseReceiptInfo = {
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

export type CStoreRegisterCDKeyResponse = {
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

export type CStoreGetMostPopularTagsRequest = {
	language?: string
}

export type CStoreGetMostPopularTagsResponse = {
	tags?: {
		tagid?: number
		name?: string
	}[]
}

export type CStoreGetLocalizedNameForTagsRequest = {
	language?: string
	tagids?: number[]
}

export type CStoreGetLocalizedNameForTagsResponse = {
	tags?: {
		tagid?: number
		englishName?: string
		name?: string
		normalizedName?: string
	}[]
}

export type CStoreGetTagListRequest = {
	language?: string
	haveVersionHash?: string
}

export type CStoreGetTagListResponse = {
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

export type CStoreGetDiscoveryQueueRequest = {
	queueType?: typeof enums.EStoreDiscoveryQueueType[keyof typeof enums.EStoreDiscoveryQueueType]
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
			discountFilter?: typeof enums.EContentHubDiscountFilterType[keyof typeof enums.EContentHubDiscountFilterType]
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

export type CStoreGetDiscoveryQueueResponse = {
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

export type CStoreGetDiscoveryQueueSettingsRequest = {
	queueType?: typeof enums.EStoreDiscoveryQueueType[keyof typeof enums.EStoreDiscoveryQueueType]
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number
		}
		contentHubFilter?: {
			hubType?: string
			hubCategory?: string
			hubTagid?: number
			discountFilter?: typeof enums.EContentHubDiscountFilterType[keyof typeof enums.EContentHubDiscountFilterType]
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

export type CStoreGetDiscoveryQueueSettingsResponse = {
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

export type CStoreSkipDiscoveryQueueItemRequest = {
	queueType?: typeof enums.EStoreDiscoveryQueueType[keyof typeof enums.EStoreDiscoveryQueueType]
	appid?: number
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number
		}
		contentHubFilter?: {
			hubType?: string
			hubCategory?: string
			hubTagid?: number
			discountFilter?: typeof enums.EContentHubDiscountFilterType[keyof typeof enums.EContentHubDiscountFilterType]
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

export type CStoreSkipDiscoveryQueueItemResponse = {
}

export type CStoreGetUserGameInterestStateRequest = {
	appid?: number
	storeAppid?: number
	betaAppid?: number
}

export type CStoreGetUserGameInterestStateResponse = {
	owned?: boolean
	wishlist?: boolean
	ignored?: boolean
	following?: boolean
	inQueues?: typeof enums.EStoreDiscoveryQueueType[keyof typeof enums.EStoreDiscoveryQueueType][]
	queuesWithSkip?: typeof enums.EStoreDiscoveryQueueType[keyof typeof enums.EStoreDiscoveryQueueType][]
	queueItemsRemaining?: number[]
	queueItemsNextAppid?: number[]
	temporarilyOwned?: boolean
	queues?: {
		type?: typeof enums.EStoreDiscoveryQueueType[keyof typeof enums.EStoreDiscoveryQueueType]
		skipped?: boolean
		itemsRemaining?: number
		nextAppid?: number
		experimentalCohort?: number
	}[]
	ignoredReason?: number
	betaStatus?: typeof enums.EPlaytestStatus[keyof typeof enums.EPlaytestStatus]
}

export type CStoreGetDiscoveryQueueSkippedAppsRequest = {
	steamid?: Long
	queueType?: typeof enums.EStoreDiscoveryQueueType[keyof typeof enums.EStoreDiscoveryQueueType]
	storePageFilter?: {
		saleFilter?: {
			saleTagid?: number
		}
		contentHubFilter?: {
			hubType?: string
			hubCategory?: string
			hubTagid?: number
			discountFilter?: typeof enums.EContentHubDiscountFilterType[keyof typeof enums.EContentHubDiscountFilterType]
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

export type CStoreGetDiscoveryQueueSkippedAppsResponse = {
	appids?: number[]
}

export type CStoreReportAppRequest = {
	appid?: number
	reportType?: typeof enums.EAppReportType[keyof typeof enums.EAppReportType]
	report?: string
}

export type CStoreReportAppResponse = {
}

export type CStoreGetStorePreferencesRequest = {
}

export type CStoreUserPreferences = {
	primaryLanguage?: number
	secondaryLanguages?: number
	platformWindows?: boolean
	platformMac?: boolean
	platformLinux?: boolean
	timestampUpdated?: number
	hideStoreBroadcast?: boolean
	reviewScorePreference?: typeof enums.EUserReviewScorePreference[keyof typeof enums.EUserReviewScorePreference]
	timestampContentDescriptorPreferencesUpdated?: number
	provideDeckFeedback?: typeof enums.EProvideDeckFeedbackPreference[keyof typeof enums.EProvideDeckFeedbackPreference]
	additionalLanguages?: string
}

export type CStoreUserTagPreferences = {
	tagsToExclude?: {
		tagid?: number
		name?: string
		timestampAdded?: number
	}[]
}

export type CStoreGetStorePreferencesResponse = {
	preferences?: {
		primaryLanguage?: number
		secondaryLanguages?: number
		platformWindows?: boolean
		platformMac?: boolean
		platformLinux?: boolean
		timestampUpdated?: number
		hideStoreBroadcast?: boolean
		reviewScorePreference?: typeof enums.EUserReviewScorePreference[keyof typeof enums.EUserReviewScorePreference]
		timestampContentDescriptorPreferencesUpdated?: number
		provideDeckFeedback?: typeof enums.EProvideDeckFeedbackPreference[keyof typeof enums.EProvideDeckFeedbackPreference]
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

export type CStoreGetTrendingAppsAmongFriendsRequest = {
	numApps?: number
	numTopFriends?: number
}

export type CStoreGetTrendingAppsAmongFriendsResponse = {
	trendingApps?: {
		appid?: number
		steamidsTopFriends?: Long[]
		totalFriends?: number
	}[]
}

export type CStoreMigratePartnerLinkTrackingNotification = {
	accountid?: number
	browserid?: Long
	backfillSource?: typeof enums.EPartnerLinkTrackingBackfillSource[keyof typeof enums.EPartnerLinkTrackingBackfillSource]
}

export type CStoreUpdatePackageReservationsRequest = {
	packagesToReserve?: number[]
	packagesToUnreserve?: number[]
	countryCode?: string
}

export type CStoreUpdatePackageReservationsResponse = {
	reservationStatus?: {
		packageid?: number
		reservationState?: number
		queuePosition?: number
		totalQueueSize?: number
		reservationCountryCode?: string
		expired?: boolean
		timeExpires?: number
		timeReserved?: number
		rtimeEstimatedNotification?: number
		notificatonToken?: string
	}[]
}

export type CStoreGetWishlistDemoEmailStatusRequest = {
	appid?: number
	demoAppid?: number
}

export type CStoreGetWishlistDemoEmailStatusResponse = {
	canFire?: boolean
	timeStaged?: number
	demoReleaseDate?: number
}

export type CStoreQueueWishlistDemoEmailToFireRequest = {
	appid?: number
	demoAppid?: number
}

export type CStoreQueueWishlistDemoEmailToFireResponse = {
}

export type CReservationPositionMessage = {
	edistributor?: number
	productIdentifier?: string
	startQueuePosition?: number
	rtimeEstimatedNotification?: number
	localizationToken?: string
	accountid?: number
	rtimeCreated?: number
}

export type CStoreSetReservationPositionMessageRequest = {
	settings?: {
		edistributor?: number
		productIdentifier?: string
		startQueuePosition?: number
		rtimeEstimatedNotification?: number
		localizationToken?: string
		accountid?: number
		rtimeCreated?: number
	}[]
}

export type CStoreSetReservationPositionMessageResponse = {
}

export type CStoreDeleteReservationPositionMessageRequest = {
	edistributor?: number
	productIdentifier?: string
	startQueuePosition?: number
}

export type CStoreDeleteReservationPositionMessageResponse = {
}

export type CStoreGetAllReservationPositionMessagesRequest = {
}

export type CStoreGetAllReservationPositionMessagesResponse = {
	settings?: {
		edistributor?: number
		productIdentifier?: string
		startQueuePosition?: number
		rtimeEstimatedNotification?: number
		localizationToken?: string
		accountid?: number
		rtimeCreated?: number
	}[]
}

export type CStoreReloadAllReservationPositionMessagesNotification = {
}

export type CSteamDeckCompatibilitySetFeedbackRequest = {
	appid?: number
	feedback?: typeof enums.ESteamDeckCompatibilityFeedback[keyof typeof enums.ESteamDeckCompatibilityFeedback]
}

export type CSteamDeckCompatibilitySetFeedbackResponse = {
}

export type CSteamDeckCompatibilityShouldPromptRequest = {
	appid?: number
}

export type CSteamDeckCompatibilityShouldPromptResponse = {
	prompt?: boolean
	feedbackEligible?: boolean
	existingFeedback?: typeof enums.ESteamDeckCompatibilityFeedback[keyof typeof enums.ESteamDeckCompatibilityFeedback]
}

export type CStoreStorePreferencesChangedNotification = {
	preferences?: {
		primaryLanguage?: number
		secondaryLanguages?: number
		platformWindows?: boolean
		platformMac?: boolean
		platformLinux?: boolean
		timestampUpdated?: number
		hideStoreBroadcast?: boolean
		reviewScorePreference?: typeof enums.EUserReviewScorePreference[keyof typeof enums.EUserReviewScorePreference]
		timestampContentDescriptorPreferencesUpdated?: number
		provideDeckFeedback?: typeof enums.EProvideDeckFeedbackPreference[keyof typeof enums.EProvideDeckFeedbackPreference]
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

