/**
 * Auto-generated file
 * Tue Nov 07 2023 11:47:11 GMT-0500 (Eastern Standard Time)
 */

declare const EStoreDiscoveryQueueType = {
	New = 0,
	ComingSoon = 1,
	Recommended = 2,
	EveryNewRelease = 3,
	MLRecommender = 5,
	WishlistOnSale = 6,
	DLC = 7,
	DLCOnSale = 8,
	RecommendedComingSoon = 9,
	RecommendedFree = 10,
	RecommendedOnSale = 11,
	RecommendedDemos = 12,
	DLCNewReleases = 13,
	DLCTopSellers = 14,
	MAX = 15,
} as const;

declare const EPlaytestStatus = {
	ETesterStatusNone = 0,
	ETesterStatusPending = 1,
	ETesterStatusInvited = 2,
	ETesterStatusGranted = 3,
} as const;

declare const EUserReviewScorePreference = {
	Unset = 0,
	IncludeAll = 1,
	ExcludeBombs = 2,
} as const;

declare const EPartnerLinkTrackingBackfillSource = {
	None = 0,
	Web = 1,
	Mobile = 2,
	Desktop = 3,
} as const;

