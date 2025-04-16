/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Tue Apr 15 2025 22:37:08 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";
import * as enums from "../../resources/language/steammessages_storebrowse.steamclient.js";

export type StoreItemID = {
	appid?: number
	packageid?: number
	bundleid?: number
	tagid?: number
	creatorid?: number
	hubcategoryid?: number
}

export type StoreBrowseContext = {
	language?: string
	elanguage?: number
	countryCode?: string
	steamRealm?: number
}

export type StoreBrowseItemDataRequest = {
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

export type CStoreBrowseGetItemsRequest = {
	ids?: {
		appid?: number
		packageid?: number
		bundleid?: number
		tagid?: number
		creatorid?: number
		hubcategoryid?: number
	}[]
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

export type StoreItem = {
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
}

export type StoreGameRating = {
	type?: string
	rating?: string
	descriptors?: string[]
	interactiveElements?: string
	requiredAge?: number
	useAgeGate?: boolean
	imageUrl?: string
	imageTarget?: string
}

export type StoreBrowseFilterFailure = {
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

export type CStoreBrowseGetItemsResponse = {
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

export type CStoreBrowseGetStoreCategoriesRequest = {
	language?: string
	elanguage?: number
}

export type CStoreBrowseGetStoreCategoriesResponse = {
	categories?: {
		categoryid?: number
		type?: typeof enums.EStoreCategoryType[keyof typeof enums.EStoreCategoryType]
		internalName?: string
		displayName?: string
		imageUrl?: string
		showInSearch?: boolean
		computed?: boolean
		editUrl?: string
		editSortOrder?: number
	}[]
}

export type CStoreBrowseGetContentHubConfigRequest = {
	context?: {
		language?: string
		elanguage?: number
		countryCode?: string
		steamRealm?: number
	}
}

export type CStoreBrowseGetContentHubConfigResponse = {
	hubconfigs?: {
		hubcategoryid?: number
		type?: string
		handle?: string
		displayName?: string
		urlPath?: string
	}[]
}

export type CStoreBrowseGetPriceStopsRequest = {
	countryCode?: string
	currencyCode?: string
}

export type CStoreBrowseGetPriceStopsResponse = {
	priceStops?: {
		formattedAmount?: string
		amountInCents?: Long
	}[]
	currencyCode?: string
}

export type CStoreBrowseGetDLCForAppsRequest = {
	context?: {
		language?: string
		elanguage?: number
		countryCode?: string
		steamRealm?: number
	}
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
	appids?: {
		appid?: number
		packageid?: number
		bundleid?: number
		tagid?: number
		creatorid?: number
		hubcategoryid?: number
	}[]
	steamid?: Long
}

export type CStoreBrowseGetDLCForAppsResponse = {
	dlcData?: {
		appid?: number
		parentappid?: number
		releaseDate?: number
		comingSoon?: boolean
		price?: Long
		discount?: number
		free?: boolean
	}[]
	playtime?: {
		appid?: number
		playtime?: number
		lastPlayed?: number
	}[]
}

export type CStoreBrowseGetDLCForAppsSolrRequest = {
	context?: {
		language?: string
		elanguage?: number
		countryCode?: string
		steamRealm?: number
	}
	appids?: number[]
	flavor?: string
	count?: number
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

export type CStoreBrowseGetDLCForAppsSolrResponse = {
	dlcLists?: {
		parentAppid?: number
		dlcAppids?: number[]
	}[]
}

export type CStoreBrowseGetHardwareItemsRequest = {
	packageid?: number[]
	context?: {
		language?: string
		elanguage?: number
		countryCode?: string
		steamRealm?: number
	}
}

export type CHardwarePackageDetails = {
	packageid?: number
	inventoryAvailable?: boolean
	highPendingOrders?: boolean
	accountRestrictedFromPurchasing?: boolean
	requiresReservation?: boolean
	rtimeEstimatedNotification?: number
	notificatonToken?: string
	reservationState?: number
	expired?: boolean
	timeExpires?: number
	timeReserved?: number
	allowQuantityPurchase?: boolean
	maxQuantityPerPurchase?: number
	allowPurchaseInCountry?: boolean
	estimatedDeliverySoonestBusinessDays?: number
	estimatedDeliveryLatestBusinessDays?: number
}

export type CStoreBrowseGetHardwareItemsResponse = {
	details?: {
		packageid?: number
		inventoryAvailable?: boolean
		highPendingOrders?: boolean
		accountRestrictedFromPurchasing?: boolean
		requiresReservation?: boolean
		rtimeEstimatedNotification?: number
		notificatonToken?: string
		reservationState?: number
		expired?: boolean
		timeExpires?: number
		timeReserved?: number
		allowQuantityPurchase?: boolean
		maxQuantityPerPurchase?: number
		allowPurchaseInCountry?: boolean
		estimatedDeliverySoonestBusinessDays?: number
		estimatedDeliveryLatestBusinessDays?: number
	}[]
}

