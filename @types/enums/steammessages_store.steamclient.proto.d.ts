export interface EPlaytestStatus
{
	"TesterStatusNone": 0,
	"TesterStatusPending": 1,
	"TesterStatusInvited": 2,
	"TesterStatusGranted": 3
}
export interface EStoreDiscoveryQueueType
{
	"New": 0,
	"ComingSoon": 1,
	"Recommended": 2,
	"EveryNewRelease": 3,
	"MLRecommender": 5,
	"WishlistOnSale": 6,
	"DLC": 7,
	"DLCOnSale": 8,
	"RecommendedComingSoon": 9,
	"RecommendedFree": 10,
	"RecommendedOnSale": 11,
	"RecommendedDemos": 12,
	"DLCNewReleases": 13,
	"DLCTopSellers": 14,
	"MAX": 15
}
export interface EUserReviewScorePreference
{
	"Unset": 0,
	"IncludeAll": 1,
	"ExcludeBombs": 2
}
