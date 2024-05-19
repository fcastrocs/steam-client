/**
 * Auto-generated file
 * Fri Feb 02 2024 20:32:00 GMT-0500 (Eastern Standard Time)
 */

import Long from 'long';
import { ValueOf } from 'type-fest';

export type CStore_RegisterCDKey_Request = {
    activationCode?: string;
    purchasePlatform?: number;
    isRequestFromClient?: boolean;
};

export type CStore_PurchaseReceiptInfo = {
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

export type CStore_RegisterCDKey_Response = {
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
};

export type CStore_GetMostPopularTags_Request = {
    language?: string;
};

export type CStore_GetMostPopularTags_Response = {
    tags?: {
        tagid?: number;
        name?: string;
    }[];
};

export type CStore_GetLocalizedNameForTags_Request = {
    language?: string;
    tagids?: number[];
};

export type CStore_GetLocalizedNameForTags_Response = {
    tags?: {
        tagid?: number;
        englishName?: string;
        name?: string;
        normalizedName?: string;
    }[];
};

export type CStore_GetTagList_Request = {
    language?: string;
    haveVersionHash?: string;
};

export type CStore_GetTagList_Response = {
    versionHash?: string;
    tags?: {
        tagid?: number;
        name?: string;
    }[];
};

export type CStoreDiscoveryQueueSettings = {
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

export type CStore_GetDiscoveryQueue_Request = {
    queueType?: (typeof EStoreDiscoveryQueueType)[keyof typeof EStoreDiscoveryQueueType];
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
            discountFilter?: (typeof EContentHubDiscountFilterType)[keyof typeof EContentHubDiscountFilterType];
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
};

export type CStore_GetDiscoveryQueue_Response = {
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
};

export type CStore_GetDiscoveryQueueSettings_Request = {
    queueType?: (typeof EStoreDiscoveryQueueType)[keyof typeof EStoreDiscoveryQueueType];
    storePageFilter?: {
        saleFilter?: {
            saleTagid?: number;
        };
        contentHubFilter?: {
            hubType?: string;
            hubCategory?: string;
            hubTagid?: number;
            discountFilter?: (typeof EContentHubDiscountFilterType)[keyof typeof EContentHubDiscountFilterType];
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
};

export type CStore_GetDiscoveryQueueSettings_Response = {
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
};

export type CStore_SkipDiscoveryQueueItem_Request = {
    queueType?: (typeof EStoreDiscoveryQueueType)[keyof typeof EStoreDiscoveryQueueType];
    appid?: number;
    storePageFilter?: {
        saleFilter?: {
            saleTagid?: number;
        };
        contentHubFilter?: {
            hubType?: string;
            hubCategory?: string;
            hubTagid?: number;
            discountFilter?: (typeof EContentHubDiscountFilterType)[keyof typeof EContentHubDiscountFilterType];
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
};

export type CStore_SkipDiscoveryQueueItem_Response = {};

export type CStore_GetUserGameInterestState_Request = {
    appid?: number;
    storeAppid?: number;
    betaAppid?: number;
};

export type CStore_GetUserGameInterestState_Response = {
    owned?: boolean;
    wishlist?: boolean;
    ignored?: boolean;
    following?: boolean;
    inQueues?: (typeof EStoreDiscoveryQueueType)[keyof typeof EStoreDiscoveryQueueType][];
    queuesWithSkip?: (typeof EStoreDiscoveryQueueType)[keyof typeof EStoreDiscoveryQueueType][];
    queueItemsRemaining?: number[];
    queueItemsNextAppid?: number[];
    temporarilyOwned?: boolean;
    queues?: {
        type?: (typeof EStoreDiscoveryQueueType)[keyof typeof EStoreDiscoveryQueueType];
        skipped?: boolean;
        itemsRemaining?: number;
        nextAppid?: number;
        experimentalCohort?: number;
    }[];
    ignoredReason?: number;
    betaStatus?: (typeof EPlaytestStatus)[keyof typeof EPlaytestStatus];
};

export type CStore_GetDiscoveryQueueSkippedApps_Request = {
    steamid?: Long;
    queueType?: (typeof EStoreDiscoveryQueueType)[keyof typeof EStoreDiscoveryQueueType];
    storePageFilter?: {
        saleFilter?: {
            saleTagid?: number;
        };
        contentHubFilter?: {
            hubType?: string;
            hubCategory?: string;
            hubTagid?: number;
            discountFilter?: (typeof EContentHubDiscountFilterType)[keyof typeof EContentHubDiscountFilterType];
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
};

export type CStore_GetDiscoveryQueueSkippedApps_Response = {
    appids?: number[];
};

export type CStore_ReportApp_Request = {
    appid?: number;
    reportType?: (typeof EAppReportType)[keyof typeof EAppReportType];
    report?: string;
};

export type CStore_ReportApp_Response = {};

export type CStore_GetStorePreferences_Request = {};

export type CStore_UserPreferences = {
    primaryLanguage?: number;
    secondaryLanguages?: number;
    platformWindows?: boolean;
    platformMac?: boolean;
    platformLinux?: boolean;
    timestampUpdated?: number;
    hideStoreBroadcast?: boolean;
    reviewScorePreference?: (typeof EUserReviewScorePreference)[keyof typeof EUserReviewScorePreference];
    timestampContentDescriptorPreferencesUpdated?: number;
    provideDeckFeedback?: (typeof EProvideDeckFeedbackPreference)[keyof typeof EProvideDeckFeedbackPreference];
    additionalLanguages?: string;
};

export type CStore_UserTagPreferences = {
    tagsToExclude?: {
        tagid?: number;
        name?: string;
        timestampAdded?: number;
    }[];
};

export type CStore_GetStorePreferences_Response = {
    preferences?: {
        primaryLanguage?: number;
        secondaryLanguages?: number;
        platformWindows?: boolean;
        platformMac?: boolean;
        platformLinux?: boolean;
        timestampUpdated?: number;
        hideStoreBroadcast?: boolean;
        reviewScorePreference?: (typeof EUserReviewScorePreference)[keyof typeof EUserReviewScorePreference];
        timestampContentDescriptorPreferencesUpdated?: number;
        provideDeckFeedback?: (typeof EProvideDeckFeedbackPreference)[keyof typeof EProvideDeckFeedbackPreference];
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
};

export type CStore_GetTrendingAppsAmongFriends_Request = {
    numApps?: number;
    numTopFriends?: number;
};

export type CStore_GetTrendingAppsAmongFriends_Response = {
    trendingApps?: {
        appid?: number;
        steamidsTopFriends?: Long[];
        totalFriends?: number;
    }[];
};

export type CStore_MigratePartnerLinkTracking_Notification = {
    accountid?: number;
    browserid?: Long;
    backfillSource?: (typeof EPartnerLinkTrackingBackfillSource)[keyof typeof EPartnerLinkTrackingBackfillSource];
};

export type CStore_UpdatePackageReservations_Request = {
    packagesToReserve?: number[];
    packagesToUnreserve?: number[];
    countryCode?: string;
};

export type CStore_UpdatePackageReservations_Response = {
    reservationStatus?: {
        packageid?: number;
        reservationState?: number;
        queuePosition?: number;
        totalQueueSize?: number;
        reservationCountryCode?: string;
        expired?: boolean;
        timeExpires?: number;
        timeReserved?: number;
        rtimeEstimatedNotification?: number;
        notificatonToken?: string;
    }[];
};

export type CReservationPositionMessage = {
    edistributor?: number;
    productIdentifier?: string;
    startQueuePosition?: number;
    rtimeEstimatedNotification?: number;
    localizationToken?: string;
    accountid?: number;
    rtimeCreated?: number;
};

export type CStore_SetReservationPositionMessage_Request = {
    settings?: {
        edistributor?: number;
        productIdentifier?: string;
        startQueuePosition?: number;
        rtimeEstimatedNotification?: number;
        localizationToken?: string;
        accountid?: number;
        rtimeCreated?: number;
    }[];
};

export type CStore_SetReservationPositionMessage_Response = {};

export type CStore_DeleteReservationPositionMessage_Request = {
    edistributor?: number;
    productIdentifier?: string;
    startQueuePosition?: number;
};

export type CStore_DeleteReservationPositionMessage_Response = {};

export type CStore_GetAllReservationPositionMessages_Request = {};

export type CStore_GetAllReservationPositionMessages_Response = {
    settings?: {
        edistributor?: number;
        productIdentifier?: string;
        startQueuePosition?: number;
        rtimeEstimatedNotification?: number;
        localizationToken?: string;
        accountid?: number;
        rtimeCreated?: number;
    }[];
};

export type CStore_ReloadAllReservationPositionMessages_Notification = {};

export type CSteamDeckCompatibility_SetFeedback_Request = {
    appid?: number;
    feedback?: (typeof ESteamDeckCompatibilityFeedback)[keyof typeof ESteamDeckCompatibilityFeedback];
};

export type CSteamDeckCompatibility_SetFeedback_Response = {};

export type CSteamDeckCompatibility_ShouldPrompt_Request = {
    appid?: number;
};

export type CSteamDeckCompatibility_ShouldPrompt_Response = {
    prompt?: boolean;
    feedbackEligible?: boolean;
    existingFeedback?: (typeof ESteamDeckCompatibilityFeedback)[keyof typeof ESteamDeckCompatibilityFeedback];
};

export type CStore_StorePreferencesChanged_Notification = {
    preferences?: {
        primaryLanguage?: number;
        secondaryLanguages?: number;
        platformWindows?: boolean;
        platformMac?: boolean;
        platformLinux?: boolean;
        timestampUpdated?: number;
        hideStoreBroadcast?: boolean;
        reviewScorePreference?: (typeof EUserReviewScorePreference)[keyof typeof EUserReviewScorePreference];
        timestampContentDescriptorPreferencesUpdated?: number;
        provideDeckFeedback?: (typeof EProvideDeckFeedbackPreference)[keyof typeof EProvideDeckFeedbackPreference];
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
};
