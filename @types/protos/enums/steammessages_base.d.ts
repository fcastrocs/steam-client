/**
 * Auto-generated file
 * Sun Nov 05 2023 23:46:33 GMT-0500 (Eastern Standard Time)
 */

declare enum EBanContentCheckResult {
	NotScanned = 0,
	Reset = 1,
	NeedsChecking = 2,
	VeryUnlikely = 5,
	Unlikely = 30,
	Possible = 50,
	Likely = 75,
	VeryLikely = 100,
}

declare enum EProtoClanEventType {
	EClanOtherEvent = 1,
	EClanGameEvent = 2,
	EClanPartyEvent = 3,
	EClanMeetingEvent = 4,
	EClanSpecialCauseEvent = 5,
	EClanMusicAndArtsEvent = 6,
	EClanSportsEvent = 7,
	EClanTripEvent = 8,
	EClanChatEvent = 9,
	EClanGameReleaseEvent = 10,
	EClanBroadcastEvent = 11,
	EClanSmallUpdateEvent = 12,
	EClanPreAnnounceMajorUpdateEvent = 13,
	EClanMajorUpdateEvent = 14,
	EClanDLCReleaseEvent = 15,
	EClanFutureReleaseEvent = 16,
	EClanESportTournamentStreamEvent = 17,
	EClanDevStreamEvent = 18,
	EClanFamousStreamEvent = 19,
	EClanGameSalesEvent = 20,
	EClanGameItemSalesEvent = 21,
	EClanInGameBonusXPEvent = 22,
	EClanInGameLootEvent = 23,
	EClanInGamePerksEvent = 24,
	EClanInGameChallengeEvent = 25,
	EClanInGameContestEvent = 26,
	EClanIRLEvent = 27,
	EClanNewsEvent = 28,
	EClanBetaReleaseEvent = 29,
	EClanInGameContentReleaseEvent = 30,
	EClanFreeTrial = 31,
	EClanSeasonRelease = 32,
	EClanSeasonUpdate = 33,
	EClanCrosspostEvent = 34,
	EClanInGameEventGeneral = 35,
}

declare enum PartnerEventNotificationType {
	EEventStart = 0,
	EEventBroadcastStart = 1,
	EEventMatchStart = 2,
	EEventPartnerMaxType = 3,
}

declare enum ESessionDisposition {
	Normal = 0,
	Disconnect = 1,
}

