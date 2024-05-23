/**
 * Auto-generated file
 * Wed May 22 2024 20:34:57 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

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
	lineItems?: .CStore_PurchaseReceiptInfo.LineItem[]
}

export type CStore_RegisterCDKey_Response = {
	purchaseResultDetails?: number
	purchaseReceiptInfo?: .CStore_PurchaseReceiptInfo
}

export type CStore_GetMostPopularTags_Request = {
	language?: string
}

export type CStore_GetMostPopularTags_Response = {
	tags?: .CStore_GetMostPopularTags_Response.Tag[]
}

export type CStore_GetLocalizedNameForTags_Request = {
	language?: string
	tagids?: number[]
}

export type CStore_GetLocalizedNameForTags_Response = {
	tags?: .CStore_GetLocalizedNameForTags_Response.Tag[]
}

export type CStore_GetTagList_Request = {
	language?: string
	haveVersionHash?: string
}

export type CStore_GetTagList_Response = {
	versionHash?: string
	tags?: .CStore_GetTagList_Response.Tag[]
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
	queueType?: .EStoreDiscoveryQueueType
	countryCode?: string
	rebuildQueue?: boolean
	settingsChanged?: boolean
	settings?: .CStoreDiscoveryQueueSettings
	rebuildQueueIfStale?: boolean
	ignoreUserPreferences?: boolean
	noExperimentalResults?: boolean
	experimentalCohort?: number
	debugGetSolrQuery?: boolean
	storePageFilter?: .CStorePageFilter
}

export type CStore_GetDiscoveryQueue_Response = {
	appids?: number[]
	countryCode?: string
	settings?: .CStoreDiscoveryQueueSettings
	skipped?: number
	exhausted?: boolean
	experimentalCohort?: number
	debugSolrQuery?: string
}

export type CStore_GetDiscoveryQueueSettings_Request = {
	queueType?: .EStoreDiscoveryQueueType
	storePageFilter?: .CStorePageFilter
}

export type CStore_GetDiscoveryQueueSettings_Response = {
	countryCode?: string
	settings?: .CStoreDiscoveryQueueSettings
}

export type CStore_SkipDiscoveryQueueItem_Request = {
	queueType?: .EStoreDiscoveryQueueType
	appid?: number
	storePageFilter?: .CStorePageFilter
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
	inQueues?: .EStoreDiscoveryQueueType[]
	queuesWithSkip?: .EStoreDiscoveryQueueType[]
	queueItemsRemaining?: number[]
	queueItemsNextAppid?: number[]
	temporarilyOwned?: boolean
	queues?: .CStore_GetUserGameInterestState_Response.InQueue[]
	ignoredReason?: number
	betaStatus?: .EPlaytestStatus
}

export type CStore_GetDiscoveryQueueSkippedApps_Request = {
	steamid?: Long
	queueType?: .EStoreDiscoveryQueueType
	storePageFilter?: .CStorePageFilter
}

export type CStore_GetDiscoveryQueueSkippedApps_Response = {
	appids?: number[]
}

export type CStore_ReportApp_Request = {
	appid?: number
	reportType?: .EAppReportType
	report?: string
}

export type CStore_ReportApp_Response = {
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
	reviewScorePreference?: .EUserReviewScorePreference
	timestampContentDescriptorPreferencesUpdated?: number
	provideDeckFeedback?: .EProvideDeckFeedbackPreference
	additionalLanguages?: string
}

export type CStore_UserTagPreferences = {
	tagsToExclude?: .CStore_UserTagPreferences.Tag[]
}

export type CStore_GetStorePreferences_Response = {
	preferences?: .CStore_UserPreferences
	tagPreferences?: .CStore_UserTagPreferences
	contentDescriptorPreferences?: .UserContentDescriptorPreferences
}

export type CStore_GetTrendingAppsAmongFriends_Request = {
	numApps?: number
	numTopFriends?: number
}

export type CStore_GetTrendingAppsAmongFriends_Response = {
	trendingApps?: .CStore_GetTrendingAppsAmongFriends_Response.TrendingAppData[]
}

export type CStore_MigratePartnerLinkTracking_Notification = {
	accountid?: number
	browserid?: Long
	backfillSource?: .EPartnerLinkTrackingBackfillSource
}

export type CStore_UpdatePackageReservations_Request = {
	packagesToReserve?: number[]
	packagesToUnreserve?: number[]
	countryCode?: string
}

export type CStore_UpdatePackageReservations_Response = {
	reservationStatus?: .CPackageReservationStatus[]
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

export type CStore_SetReservationPositionMessage_Request = {
	settings?: .CReservationPositionMessage[]
}

export type CStore_SetReservationPositionMessage_Response = {
}

export type CStore_DeleteReservationPositionMessage_Request = {
	edistributor?: number
	productIdentifier?: string
	startQueuePosition?: number
}

export type CStore_DeleteReservationPositionMessage_Response = {
}

export type CStore_GetAllReservationPositionMessages_Request = {
}

export type CStore_GetAllReservationPositionMessages_Response = {
	settings?: .CReservationPositionMessage[]
}

export type CStore_ReloadAllReservationPositionMessages_Notification = {
}

export type CSteamDeckCompatibility_SetFeedback_Request = {
	appid?: number
	feedback?: .ESteamDeckCompatibilityFeedback
}

export type CSteamDeckCompatibility_SetFeedback_Response = {
}

export type CSteamDeckCompatibility_ShouldPrompt_Request = {
	appid?: number
}

export type CSteamDeckCompatibility_ShouldPrompt_Response = {
	prompt?: boolean
	feedbackEligible?: boolean
	existingFeedback?: .ESteamDeckCompatibilityFeedback
}

export type CStore_StorePreferencesChanged_Notification = {
	preferences?: .CStore_UserPreferences
	tagPreferences?: .CStore_UserTagPreferences
	contentDescriptorPreferences?: .UserContentDescriptorPreferences
}

