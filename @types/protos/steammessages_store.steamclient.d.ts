/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Tue Apr 15 2025 22:37:08 GMT-0400 (Eastern Daylight Time)
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

export type CStoreGetRecommendedTagsForUserRequest = {
	language?: string
	countryCode?: string
	favorRarerTags?: boolean
}

export type CStoreGetRecommendedTagsForUserResponse = {
	tags?: {
		tagid?: number
		name?: string
		weight?: number
	}[]
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
	context?: {
		language?: string
		elanguage?: number
		countryCode?: string
		steamRealm?: number
	}
	dataRequest?: {
		includeAssets?: boolean
		includeRelease?: boolean
		includePlatforms?: boolean
		includeAllPurchaseOptions?: boolean
		includeScreenshots?: boolean
		includeTrailers?: boolean
		includeRatings?: boolean
		includeTagCount?: number
		includeReviews?: boolean
		includeBasicInfo?: boolean
		includeSupportedLanguages?: boolean
		includeFullDescription?: boolean
		includeIncludedItems?: boolean
		includeAssetsWithoutOverrides?: boolean
		applyUserFilters?: boolean
		includeLinks?: boolean
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
	storeItems?: {
		itemType?: typeof enums.EStoreItemType[keyof typeof enums.EStoreItemType]
		id?: number
		success?: number
		visible?: boolean
		unvailableForCountryRestriction?: boolean
		name?: string
		storeUrlPath?: string
		appid?: number
		type?: typeof enums.EStoreAppType[keyof typeof enums.EStoreAppType]
		includedTypes?: typeof enums.EStoreAppType[keyof typeof enums.EStoreAppType][]
		includedAppids?: number[]
		isFree?: boolean
		isEarlyAccess?: boolean
		relatedItems?: {
			parentAppid?: number
			demoAppid?: number[]
			standaloneDemoAppid?: number[]
		}
		includedItems?: {
		}
		contentDescriptorids?: typeof enums.EContentDescriptorID[keyof typeof enums.EContentDescriptorID][]
		tagids?: number[]
		categories?: {
			supportedPlayerCategoryids?: number[]
			featureCategoryids?: number[]
			controllerCategoryids?: number[]
		}
		reviews?: {
			summaryFiltered?: {
				reviewCount?: number
				percentPositive?: number
				reviewScore?: typeof enums.EUserReviewScore[keyof typeof enums.EUserReviewScore]
				reviewScoreLabel?: string
			}
			summaryUnfiltered?: {
				reviewCount?: number
				percentPositive?: number
				reviewScore?: typeof enums.EUserReviewScore[keyof typeof enums.EUserReviewScore]
				reviewScoreLabel?: string
			}
		}
		basicInfo?: {
			shortDescription?: string
			publishers?: {
				name?: string
				creatorClanAccountId?: number
			}[]
			developers?: {
				name?: string
				creatorClanAccountId?: number
			}[]
			franchises?: {
				name?: string
				creatorClanAccountId?: number
			}[]
			capsuleHeadline?: string
		}
		tags?: {
			tagid?: number
			weight?: number
		}[]
		assets?: {
			assetUrlFormat?: string
			mainCapsule?: string
			smallCapsule?: string
			header?: string
			packageHeader?: string
			pageBackground?: string
			heroCapsule?: string
			heroCapsule_2x?: string
			libraryCapsule?: string
			libraryCapsule_2x?: string
			libraryHero?: string
			libraryHero_2x?: string
			communityIcon?: string
			clanAvatar?: string
			pageBackgroundPath?: string
			rawPageBackground?: string
		}
		release?: {
			steamReleaseDate?: number
			originalReleaseDate?: number
			originalSteamReleaseDate?: number
			isComingSoon?: boolean
			isPreload?: boolean
			customReleaseDateMessage?: string
			isAbridgedReleaseDate?: boolean
			comingSoonDisplay?: string
			isEarlyAccess?: boolean
			macReleaseDate?: number
			linuxReleaseDate?: number
			limitedLaunchActive?: boolean
		}
		platforms?: {
			windows?: boolean
			mac?: boolean
			steamosLinux?: boolean
			vrSupport?: {
				vrhmd?: boolean
				vrhmdOnly?: boolean
				htcVive?: boolean
				oculusRift?: boolean
				windowsMr?: boolean
				valveIndex?: boolean
			}
			steamDeckCompatCategory?: typeof enums.ESteamDeckCompatibilityCategory[keyof typeof enums.ESteamDeckCompatibilityCategory]
		}
		gameRating?: {
			type?: string
			rating?: string
			descriptors?: string[]
			interactiveElements?: string
			requiredAge?: number
			useAgeGate?: boolean
			imageUrl?: string
			imageTarget?: string
		}
		isComingSoon?: boolean
		bestPurchaseOption?: {
			packageid?: number
			bundleid?: number
			purchaseOptionName?: string
			finalPriceInCents?: Long
			originalPriceInCents?: Long
			formattedFinalPrice?: string
			formattedOriginalPrice?: string
			discountPct?: number
			bundleDiscountPct?: number
			isFreeToKeep?: boolean
			priceBeforeBundleDiscount?: Long
			formattedPriceBeforeBundleDiscount?: string
			activeDiscounts?: {
				discountAmount?: Long
				discountDescription?: string
				discountEndDate?: number
			}[]
			userCanPurchaseAsGift?: boolean
			isCommercialLicense?: boolean
			shouldSuppressDiscountPct?: boolean
			hideDiscountPctForCompliance?: boolean
			includedGameCount?: number
			lowestRecentPriceInCents?: Long
			requiresShipping?: boolean
			recurrenceInfo?: {
				packageid?: number
				billingAgreementType?: number
				renewalTimeUnit?: number
				renewalTimePeriod?: number
				renewalPriceInCents?: Long
				formattedRenewalPrice?: string
			}
			freeToKeepEnds?: number
		}
		purchaseOptions?: {
			packageid?: number
			bundleid?: number
			purchaseOptionName?: string
			finalPriceInCents?: Long
			originalPriceInCents?: Long
			formattedFinalPrice?: string
			formattedOriginalPrice?: string
			discountPct?: number
			bundleDiscountPct?: number
			isFreeToKeep?: boolean
			priceBeforeBundleDiscount?: Long
			formattedPriceBeforeBundleDiscount?: string
			activeDiscounts?: {
				discountAmount?: Long
				discountDescription?: string
				discountEndDate?: number
			}[]
			userCanPurchaseAsGift?: boolean
			isCommercialLicense?: boolean
			shouldSuppressDiscountPct?: boolean
			hideDiscountPctForCompliance?: boolean
			includedGameCount?: number
			lowestRecentPriceInCents?: Long
			requiresShipping?: boolean
			recurrenceInfo?: {
				packageid?: number
				billingAgreementType?: number
				renewalTimeUnit?: number
				renewalTimePeriod?: number
				renewalPriceInCents?: Long
				formattedRenewalPrice?: string
			}
			freeToKeepEnds?: number
		}[]
		accessories?: {
			packageid?: number
			bundleid?: number
			purchaseOptionName?: string
			finalPriceInCents?: Long
			originalPriceInCents?: Long
			formattedFinalPrice?: string
			formattedOriginalPrice?: string
			discountPct?: number
			bundleDiscountPct?: number
			isFreeToKeep?: boolean
			priceBeforeBundleDiscount?: Long
			formattedPriceBeforeBundleDiscount?: string
			activeDiscounts?: {
				discountAmount?: Long
				discountDescription?: string
				discountEndDate?: number
			}[]
			userCanPurchaseAsGift?: boolean
			isCommercialLicense?: boolean
			shouldSuppressDiscountPct?: boolean
			hideDiscountPctForCompliance?: boolean
			includedGameCount?: number
			lowestRecentPriceInCents?: Long
			requiresShipping?: boolean
			recurrenceInfo?: {
				packageid?: number
				billingAgreementType?: number
				renewalTimeUnit?: number
				renewalTimePeriod?: number
				renewalPriceInCents?: Long
				formattedRenewalPrice?: string
			}
			freeToKeepEnds?: number
		}[]
		selfPurchaseOption?: {
			packageid?: number
			bundleid?: number
			purchaseOptionName?: string
			finalPriceInCents?: Long
			originalPriceInCents?: Long
			formattedFinalPrice?: string
			formattedOriginalPrice?: string
			discountPct?: number
			bundleDiscountPct?: number
			isFreeToKeep?: boolean
			priceBeforeBundleDiscount?: Long
			formattedPriceBeforeBundleDiscount?: string
			activeDiscounts?: {
				discountAmount?: Long
				discountDescription?: string
				discountEndDate?: number
			}[]
			userCanPurchaseAsGift?: boolean
			isCommercialLicense?: boolean
			shouldSuppressDiscountPct?: boolean
			hideDiscountPctForCompliance?: boolean
			includedGameCount?: number
			lowestRecentPriceInCents?: Long
			requiresShipping?: boolean
			recurrenceInfo?: {
				packageid?: number
				billingAgreementType?: number
				renewalTimeUnit?: number
				renewalTimePeriod?: number
				renewalPriceInCents?: Long
				formattedRenewalPrice?: string
			}
			freeToKeepEnds?: number
		}
		screenshots?: {
			allAgesScreenshots?: {
				filename?: string
				ordinal?: number
			}[]
			matureContentScreenshots?: {
				filename?: string
				ordinal?: number
			}[]
		}
		trailers?: {
			highlights?: {
				trailerName?: string
				trailerUrlFormat?: string
				trailerCategory?: typeof enums.ETrailerCategory[keyof typeof enums.ETrailerCategory]
				trailer_480p?: {
					filename?: string
					type?: string
				}[]
				trailerMax?: {
					filename?: string
					type?: string
				}[]
				microtrailer?: {
					filename?: string
					type?: string
				}[]
				screenshotMedium?: string
				screenshotFull?: string
				trailerBaseId?: number
			}[]
			otherTrailers?: {
				trailerName?: string
				trailerUrlFormat?: string
				trailerCategory?: typeof enums.ETrailerCategory[keyof typeof enums.ETrailerCategory]
				trailer_480p?: {
					filename?: string
					type?: string
				}[]
				trailerMax?: {
					filename?: string
					type?: string
				}[]
				microtrailer?: {
					filename?: string
					type?: string
				}[]
				screenshotMedium?: string
				screenshotFull?: string
				trailerBaseId?: number
			}[]
		}
		supportedLanguages?: {
			elanguage?: number
			eadditionallanguage?: number
			supported?: boolean
			fullAudio?: boolean
			subtitles?: boolean
		}[]
		storeUrlPathOverride?: string
		freeWeekend?: {
			startTime?: number
			endTime?: number
			text?: string
		}
		unlisted?: boolean
		gameCount?: number
		internalName?: string
		fullDescription?: string
		isFreeTemporarily?: boolean
		assetsWithoutOverrides?: {
			assetUrlFormat?: string
			mainCapsule?: string
			smallCapsule?: string
			header?: string
			packageHeader?: string
			pageBackground?: string
			heroCapsule?: string
			heroCapsule_2x?: string
			libraryCapsule?: string
			libraryCapsule_2x?: string
			libraryHero?: string
			libraryHero_2x?: string
			communityIcon?: string
			clanAvatar?: string
			pageBackgroundPath?: string
			rawPageBackground?: string
		}
		userFilterFailure?: {
			filterFailure?: typeof enums.EStoreBrowseFilterFailure[keyof typeof enums.EStoreBrowseFilterFailure]
			alreadyOwned?: boolean
			onWishlist?: boolean
			ignored?: boolean
			notInUsersLanguage?: boolean
			notOnUsersPlatform?: boolean
			demoForOwnedGame?: boolean
			dlcForUnownedGame?: boolean
			nonpreferredProductType?: boolean
			excludedTagids?: number[]
			excludedContentDescriptorids?: typeof enums.EContentDescriptorID[keyof typeof enums.EContentDescriptorID][]
		}
		links?: {
			linkType?: typeof enums.EStoreLinkType[keyof typeof enums.EStoreLinkType]
			url?: string
			text?: string
		}[]
	}[]
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
	allowLateFiring?: boolean
}

export type CStoreGetWishlistDemoEmailStatusResponse = {
	canFire?: boolean
	timeStaged?: number
	demoReleaseDate?: number
}

export type CStoreQueueWishlistDemoEmailToFireRequest = {
	appid?: number
	demoAppid?: number
	allowLateFiring?: boolean
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

