export default interface EACState
{
	"Unknown": 0,
	"Disconnected": 1,
	"Connected": 2,
	"ConnectedSlow": 3
}
export default interface EBatteryState
{
	"Unknown": 0,
	"Discharging": 1,
	"Charging": 2,
	"Full": 3
}
export default interface EBluetoothDeviceType
{
	"Invalid": 0,
	"Unknown": 1,
	"Phone": 2,
	"Computer": 3,
	"Headset": 4,
	"Headphones": 5,
	"Speakers": 6,
	"OtherAudio": 7,
	"Mouse": 8,
	"Joystick": 9,
	"Gamepad": 10,
	"Keyboard": 11
}
export default interface EBroadcastEncoderSetting
{
	"BestQuality": 0,
	"BestPerformance": 1
}
export default interface EBroadcastPermission
{
	"Disabled": 0,
	"FriendsApprove": 1,
	"FriendsAllowed": 2,
	"Public": 3,
	"Subscribers": 4
}
export default interface ECPUGovernor
{
	"Invalid": 0,
	"Perf": 1,
	"Powersave": 2,
	"Manual": 3
}
export default interface ECloudGamingPlatform
{
	"None": 0,
	"Valve": 1,
	"NVIDIA": 2
}
export default interface ECloudStoragePersistState
{
	"Persisted": 0,
	"Forgotten": 1,
	"Deleted": 2
}
export default interface ECommentThreadType
{
	"Invalid": 0,
	"Screenshot_Deprecated": 1,
	"WorkshopAccount_Developer": 2,
	"WorkshopAccount_Public": 3,
	"PublishedFile_Developer": 4,
	"PublishedFile_Public": 5,
	"Test": 6,
	"ForumTopic": 7,
	"Recommendation": 8,
	"Video_Deprecated": 9,
	"Profile": 10,
	"NewsPost": 11,
	"Clan": 12,
	"ClanAnnouncement": 13,
	"ClanEvent": 14,
	"UserStatusPublished": 15,
	"UserReceivedNewGame": 16,
	"PublishedFile_Announcement": 17,
	"ModeratorMessage": 18,
	"ClanCuratedApp": 19,
	"QAndASession": 20,
	"Max": 21
}
export default interface ECommunityItemClass
{
	"Invalid": 0,
	"Badge": 1,
	"GameCard": 2,
	"ProfileBackground": 3,
	"Emoticon": 4,
	"BoosterPack": 5,
	"Consumable": 6,
	"GameGoo": 7,
	"ProfileModifier": 8,
	"Scene": 9,
	"SalienItem": 10,
	"Sticker": 11,
	"ChatEffect": 12,
	"MiniProfileBackground": 13,
	"AvatarFrame": 14,
	"AnimatedAvatar": 15,
	"SteamDeckKeyboardSkin": 16,
	"SteamDeckStartupMovie": 17
}
export default interface EContentCheckProvider
{
	"Invalid": 0,
	"Google": 1,
	"Amazon": 2,
	"Local": 3
}
export default interface EGPUPerformanceLevel
{
	"Invalid": 0,
	"Auto": 1,
	"Manual": 2,
	"Low": 3,
	"High": 4,
	"Profiling": 5
}
export default interface EGraphicsPerfOverlayLevel
{
	"Hidden": 0,
	"Basic": 1,
	"Medium": 2,
	"Full": 3,
	"Minimal": 4
}
export default interface EHDRToneMapOperator
{
	"Invalid": 0,
	"Uncharted": 1,
	"Reinhard": 2
}
export default interface ENewSteamAnnouncementState
{
	"Invalid": 0,
	"AllRead": 1,
	"NewAnnouncement": 2,
	"FeaturedAnnouncement": 3
}
export default interface EOSBranch
{
	"Unknown": 0,
	"Release": 1,
	"ReleaseCandidate": 2,
	"Beta": 3,
	"BetaCandidate": 4,
	"Main": 5,
	"Staging": 6
}
export default interface EPersonaStateFlag
{
	"HasRichPresence": 1,
	"InJoinableGame": 2,
	"Golden": 4,
	"RemotePlayTogether": 8,
	"ClientTypeWeb": 256,
	"ClientTypeMobile": 512,
	"ClientTypeTenfoot": 1024,
	"ClientTypeVR": 2048,
	"LaunchTypeGamepad": 4096,
	"LaunchTypeCompatTool": 8192
}
export default interface EProfileCustomizationType
{
	"Invalid": 0,
	"RareAchievementShowcase": 1,
	"GameCollector": 2,
	"ItemShowcase": 3,
	"TradeShowcase": 4,
	"Badges": 5,
	"FavoriteGame": 6,
	"ScreenshotShowcase": 7,
	"CustomText": 8,
	"FavoriteGroup": 9,
	"Recommendation": 10,
	"WorkshopItem": 11,
	"MyWorkshop": 12,
	"ArtworkShowcase": 13,
	"VideoShowcase": 14,
	"Guides": 15,
	"MyGuides": 16,
	"Achievements": 17,
	"Greenlight": 18,
	"MyGreenlight": 19,
	"Salien": 20,
	"LoyaltyRewardReactions": 21,
	"SingleArtworkShowcase": 22,
	"AchievementsCompletionist": 23,
	"Replay": 24
}
export default interface EProvideDeckFeedbackPreference
{
	"Unset": 0,
	"Yes": 1,
	"No": 2
}
export default interface EPublishedFileInappropriateProvider
{
	"Invalid": 0,
	"Google": 1,
	"Amazon": 2
}
export default interface EPublishedFileInappropriateResult
{
	"NotScanned": 0,
	"VeryUnlikely": 1,
	"Unlikely": 30,
	"Possible": 50,
	"Likely": 75,
	"VeryLikely": 100
}
export default interface EPublishedFileQueryType
{
	"RankedByVote": 0,
	"RankedByPublicationDate": 1,
	"AcceptedForGameRankedByAcceptanceDate": 2,
	"RankedByTrend": 3,
	"FavoritedByFriendsRankedByPublicationDate": 4,
	"CreatedByFriendsRankedByPublicationDate": 5,
	"RankedByNumTimesReported": 6,
	"CreatedByFollowedUsersRankedByPublicationDate": 7,
	"NotYetRated": 8,
	"RankedByTotalUniqueSubscriptions": 9,
	"RankedByTotalVotesAsc": 10,
	"RankedByVotesUp": 11,
	"RankedByTextSearch": 12,
	"RankedByPlaytimeTrend": 13,
	"RankedByTotalPlaytime": 14,
	"RankedByAveragePlaytimeTrend": 15,
	"RankedByLifetimeAveragePlaytime": 16,
	"RankedByPlaytimeSessionsTrend": 17,
	"RankedByLifetimePlaytimeSessions": 18,
	"RankedByInappropriateContentRating": 19,
	"RankedByBanContentCheck": 20,
	"RankedByLastUpdatedDate": 21
}
export default interface EPublishedFileStorageSystem
{
	"Invalid": 0,
	"LegacyCloud": 1,
	"Depot": 2,
	"UGCCloud": 3
}
export default interface ESDCardFormatStage
{
	"Invalid": 0,
	"Starting": 1,
	"Testing": 2,
	"Rescuing": 3,
	"Formatting": 4,
	"Finalizing": 5
}
export default interface EScalingFilter
{
	"Invalid": 0,
	"FSR": 1,
	"Nearest": 2,
	"Integer": 3,
	"Linear": 4,
	"NIS": 5
}
export default interface ESessionPersistence
{
	"Invalid": -1,
	"Ephemeral": 0,
	"Persistent": 1
}
export default interface ESplitScalingFilter
{
	"Invalid": 0,
	"Linear": 1,
	"Nearest": 2,
	"FSR": 3,
	"NIS": 4
}
export default interface ESplitScalingScaler
{
	"Invalid": 0,
	"Auto": 1,
	"Integer": 2,
	"Fit": 3,
	"Fill": 4,
	"Stretch": 5
}
export default interface ESteamDeckCompatibilityCategory
{
	"Unknown": 0,
	"Unsupported": 1,
	"Playable": 2,
	"Verified": 3
}
export default interface ESteamDeckCompatibilityFeedback
{
	"Unset": 0,
	"Agree": 1,
	"Disagree": 2,
	"Ignore": 3
}
export default interface ESteamDeckCompatibilityResultDisplayType
{
	"Invisible": 0,
	"Informational": 1,
	"Unsupported": 2,
	"Playable": 3,
	"Verified": 4
}
export default interface EStorageBlockContentType
{
	"Invalid": 0,
	"Unknown": 1,
	"FileSystem": 2,
	"Crypto": 3,
	"Raid": 4
}
export default interface EStorageBlockFileSystemType
{
	"Invalid": 0,
	"Unknown": 1,
	"VFat": 2,
	"Ext4": 3
}
export default interface EStorageDriveMediaType
{
	"Invalid": 0,
	"Unknown": 1,
	"HDD": 2,
	"SSD": 3,
	"Removable": 4
}
export default interface ESystemAudioChannel
{
	"Invalid": 0,
	"Aggregated": 1,
	"FrontLeft": 2,
	"FrontRight": 3,
	"LFE": 4,
	"BackLeft": 5,
	"BackRight": 6,
	"FrontCenter": 7,
	"Unknown": 8,
	"Mono": 9
}
export default interface ESystemAudioDirection
{
	"Invalid": 0,
	"Input": 1,
	"Output": 2
}
export default interface ESystemAudioPortDirection
{
	"Invalid": 0,
	"Input": 1,
	"Output": 2
}
export default interface ESystemAudioPortType
{
	"Invalid": 0,
	"Unknown": 1,
	"Audio32f": 2,
	"Midi8b": 3,
	"Video32RGBA": 4
}
export default interface ESystemDisplayCompatibilityMode
{
	"Invalid": 0,
	"None": 1,
	"MinimalBandwith": 2
}
export default interface ESystemFanControlMode
{
	"Invalid": 0,
	"Disabled": 1,
	"Default": 2
}
export default interface ESystemServiceState
{
	"Unavailable": 0,
	"Disabled": 1,
	"Enabled": 2
}
export default interface ETouchGesture
{
	"None": 0,
	"Touch": 1,
	"Tap": 2,
	"DoubleTap": 3,
	"ShortPress": 4,
	"LongPress": 5,
	"LongTap": 6,
	"TwoFingerTap": 7,
	"TapCancelled": 8,
	"PinchBegin": 9,
	"PinchUpdate": 10,
	"PinchEnd": 11,
	"FlingStart": 12,
	"FlingCancelled": 13
}
export default interface EUpdaterState
{
	"Invalid": 0,
	"UpToDate": 2,
	"Checking": 3,
	"Available": 4,
	"Applying": 5,
	"ClientRestartPending": 6,
	"SystemRestartPending": 7
}
export default interface EUpdaterType
{
	"Invalid": 0,
	"Client": 1,
	"OS": 2,
	"BIOS": 3,
	"Aggregated": 4,
	"Test1": 5,
	"Test2": 6,
	"Dummy": 7
}
