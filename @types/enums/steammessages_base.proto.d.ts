export default interface EBanContentCheckResult
{
	"NotScanned": 0,
	"Reset": 1,
	"NeedsChecking": 2,
	"VeryUnlikely": 5,
	"Unlikely": 30,
	"Possible": 50,
	"Likely": 75,
	"VeryLikely": 100
}
export default interface EProtoClanEventType
{
	"OtherEvent": 1,
	"GameEvent": 2,
	"PartyEvent": 3,
	"MeetingEvent": 4,
	"SpecialCauseEvent": 5,
	"MusicAndArtsEvent": 6,
	"SportsEvent": 7,
	"ripEvent": 8,
	"ChatEvent": 9,
	"GameReleaseEvent": 10,
	"BroadcastEvent": 11,
	"SmallUpdateEvent": 12,
	"PreAnnounceMajorUpdateEvent": 13,
	"MajorUpdateEvent": 14,
	"DLCReleaseEvent": 15,
	"FutureReleaseEvent": 16,
	"SportTournamentStreamEvent": 17,
	"DevStreamEvent": 18,
	"FamousStreamEvent": 19,
	"GameSalesEvent": 20,
	"GameItemSalesEvent": 21,
	"InGameBonusXPEvent": 22,
	"InGameLootEvent": 23,
	"InGamePerksEvent": 24,
	"InGameChallengeEvent": 25,
	"InGameContestEvent": 26,
	"IRLEvent": 27,
	"NewsEvent": 28,
	"BetaReleaseEvent": 29,
	"InGameContentReleaseEvent": 30,
	"FreeTrial": 31,
	"SeasonRelease": 32,
	"SeasonUpdate": 33,
	"CrosspostEvent": 34,
	"InGameEventGeneral": 35
}
export default interface ESessionDisposition
{
	"Normal": 0,
	"Disconnect": 1
}
export default interface PartnerEventNotificationType
{
	"EventStart": 0,
	"EventBroadcastStart": 1,
	"EventMatchStart": 2,
	"EventPartnerMaxType": 3
}
