/* eslint-disable import/prefer-default-export */
/**
 * Auto-generated file
 * Tue Apr 15 2025 22:37:08 GMT-0400 (Eastern Daylight Time)
 */

export enum ESessionPersistence {
	Invalid = -1,
	Ephemeral = 0,
	Persistent = 1,
}

export enum EPublishedFileQueryType {
	RankedByVote = 0,
	RankedByPublicationDate = 1,
	AcceptedForGameRankedByAcceptanceDate = 2,
	RankedByTrend = 3,
	FavoritedByFriendsRankedByPublicationDate = 4,
	CreatedByFriendsRankedByPublicationDate = 5,
	RankedByNumTimesReported = 6,
	CreatedByFollowedUsersRankedByPublicationDate = 7,
	NotYetRated = 8,
	RankedByTotalUniqueSubscriptions = 9,
	RankedByTotalVotesAsc = 10,
	RankedByVotesUp = 11,
	RankedByTextSearch = 12,
	RankedByPlaytimeTrend = 13,
	RankedByTotalPlaytime = 14,
	RankedByAveragePlaytimeTrend = 15,
	RankedByLifetimeAveragePlaytime = 16,
	RankedByPlaytimeSessionsTrend = 17,
	RankedByLifetimePlaytimeSessions = 18,
	RankedByInappropriateContentRating = 19,
	RankedByBanContentCheck = 20,
	RankedByLastUpdatedDate = 21,
}

export enum EPublishedFileInappropriateProvider {
	Invalid = 0,
	Google = 1,
	Amazon = 2,
}

export enum EPublishedFileInappropriateResult {
	NotScanned = 0,
	VeryUnlikely = 1,
	Unlikely = 30,
	Possible = 50,
	Likely = 75,
	VeryLikely = 100,
}

export enum EPersonaStateFlag {
	HasRichPresence = 1,
	InJoinableGame = 2,
	Golden = 4,
	RemotePlayTogether = 8,
	ClientTypeWeb = 256,
	ClientTypeMobile = 512,
	ClientTypeTenfoot = 1024,
	ClientTypeVR = 2048,
	LaunchTypeGamepad = 4096,
	LaunchTypeCompatTool = 8192,
}

export enum EContentCheckProvider {
	Invalid = 0,
	Amazon = 2,
	Local = 3,
	GoogleVertexAI = 4,
	GoogleGemini = 5,
	SteamLearn = 6,
}

export enum EProfileCustomizationType {
	Invalid = 0,
	RareAchievementShowcase = 1,
	GameCollector = 2,
	ItemShowcase = 3,
	TradeShowcase = 4,
	Badges = 5,
	FavoriteGame = 6,
	ScreenshotShowcase = 7,
	CustomText = 8,
	FavoriteGroup = 9,
	Recommendation = 10,
	WorkshopItem = 11,
	MyWorkshop = 12,
	ArtworkShowcase = 13,
	VideoShowcase = 14,
	Guides = 15,
	MyGuides = 16,
	Achievements = 17,
	Greenlight = 18,
	MyGreenlight = 19,
	Salien = 20,
	LoyaltyRewardReactions = 21,
	SingleArtworkShowcase = 22,
	AchievementsCompletionist = 23,
	Replay = 24,
}

export enum EPublishedFileStorageSystem {
	Invalid = 0,
	LegacyCloud = 1,
	Depot = 2,
	UGCCloud = 3,
}

export enum ECloudStoragePersistState {
	Persisted = 0,
	Forgotten = 1,
	Deleted = 2,
}

export enum ESDCardFormatStage {
	Invalid = 0,
	Starting = 1,
	Testing = 2,
	Rescuing = 3,
	Formatting = 4,
	Finalizing = 5,
}

export enum EStorageFormatStage {
	Invalid = 0,
	NotRunning = 1,
	Starting = 2,
	Testing = 3,
	Rescuing = 4,
	Formatting = 5,
	Finalizing = 6,
}

export enum ESystemFanControlMode {
	Invalid = 0,
	Disabled = 1,
	Default = 2,
}

export enum EStartupMovieVariant {
	Invalid = 0,
	Generic = 1,
	DeckBlue = 2,
	DeckOrange = 3,
}

export enum EColorGamutLabelSet {
	Default = 0,
	Native = 1,
	Boosted = 2,
}

export enum EWindowStackingOrder {
	Invalid = 0,
	Top = 1,
	Bottom = 2,
}

export enum EBluetoothDeviceType {
	Invalid = 0,
	Unknown = 1,
	Phone = 2,
	Computer = 3,
	Headset = 4,
	Headphones = 5,
	Speakers = 6,
	OtherAudio = 7,
	Mouse = 8,
	Joystick = 9,
	Gamepad = 10,
	Keyboard = 11,
}

export enum ESystemAudioDirection {
	Invalid = 0,
	Input = 1,
	Output = 2,
}

export enum ESystemAudioChannel {
	Invalid = 0,
	Aggregated = 1,
	FrontLeft = 2,
	FrontRight = 3,
	LFE = 4,
	BackLeft = 5,
	BackRight = 6,
	FrontCenter = 7,
	Unknown = 8,
	Mono = 9,
}

export enum ESystemAudioPortType {
	Invalid = 0,
	Unknown = 1,
	Audio32f = 2,
	Midi8b = 3,
	Video32RGBA = 4,
}

export enum ESystemAudioPortDirection {
	Invalid = 0,
	Input = 1,
	Output = 2,
}

export enum ESystemServiceState {
	Unavailable = 0,
	Disabled = 1,
	Enabled = 2,
}

export enum EGraphicsPerfOverlayLevel {
	Hidden = 0,
	Basic = 1,
	Medium = 2,
	Full = 3,
	Minimal = 4,
}

export enum EGPUPerformanceLevel {
	Invalid = 0,
	Auto = 1,
	Manual = 2,
	Low = 3,
	High = 4,
	Profiling = 5,
}

export enum ESplitScalingFilter {
	Invalid = 0,
	Linear = 1,
	Nearest = 2,
	Sharp = 3,
}

export enum ESplitScalingScaler {
	Invalid = 0,
	Auto = 1,
	Integer = 2,
	Fit = 3,
	Fill = 4,
	Stretch = 5,
}

export enum EGamescopeBlurMode {
	Disabled = 0,
	IfOccluded = 1,
	Always = 2,
}

export enum ESLSHelper {
	Invalid = 0,
	Minidump = 1,
	Kdump = 2,
	Journal = 3,
	Gpu = 4,
	SystemInfo = 5,
}

export enum EHDRVisualization {
	None = 0,
	Heatmap = 1,
	Analysis = 2,
	HeatmapExtended = 3,
	HeatmapClassic = 4,
}

export enum EHDRToneMapOperator {
	Invalid = 0,
	Uncharted = 1,
	Reinhard = 2,
}

export enum ECPUGovernor {
	Invalid = 0,
	Perf = 1,
	Powersave = 2,
	Manual = 3,
}

export enum EUpdaterType {
	Invalid = 0,
	Client = 1,
	OS = 2,
	BIOS = 3,
	Aggregated = 4,
	Test1 = 5,
	Test2 = 6,
	Dummy = 7,
}

export enum EUpdaterState {
	Invalid = 0,
	UpToDate = 2,
	Checking = 3,
	Available = 4,
	Applying = 5,
	ClientRestartPending = 6,
	SystemRestartPending = 7,
	RollBack = 8,
}

export enum EStorageBlockContentType {
	Invalid = 0,
	Unknown = 1,
	FileSystem = 2,
	Crypto = 3,
	Raid = 4,
}

export enum EStorageBlockFileSystemType {
	Invalid = 0,
	Unknown = 1,
	VFat = 2,
	Ext4 = 3,
}

export enum EStorageDriveMediaType {
	Invalid = 0,
	Unknown = 1,
	HDD = 2,
	SSD = 3,
	Removable = 4,
}

export enum ESystemDisplayCompatibilityMode {
	Invalid = 0,
	None = 1,
	MinimalBandwith = 2,
}

export enum ESteamDeckCompatibilityCategory {
	Unknown = 0,
	Unsupported = 1,
	Playable = 2,
	Verified = 3,
}

export enum ESteamDeckCompatibilityResultDisplayType {
	Invisible = 0,
	Informational = 1,
	Unsupported = 2,
	Playable = 3,
	Verified = 4,
}

export enum ESteamDeckCompatibilityTestResult {
	Invalid = 0,
	NotApplicable = 1,
	Pass = 2,
	Fail = 3,
	FailMinor = 4,
}

export enum EACState {
	Unknown = 0,
	Disconnected = 1,
	Connected = 2,
	ConnectedSlow = 3,
}

export enum EBatteryState {
	Unknown = 0,
	Discharging = 1,
	Charging = 2,
	Full = 3,
}

export enum EOSBranch {
	Unknown = 0,
	Release = 1,
	ReleaseCandidate = 2,
	Beta = 3,
	BetaCandidate = 4,
	Preview = 5,
	PreviewCandidate = 6,
	Main = 7,
	Staging = 8,
}

export enum EBrowserGPUStatus {
	Invalid = 0,
	Enabled = 1,
	DisabledUnknown = 2,
	DisabledCrashCount = 4,
	DisabledBlocklist = 5,
	DisabledJSRequest = 6,
	DisabledCommandLine = 7,
	DisabledRuntimeDetect = 8,
	DisabledChildCommandLine = 9,
	DisabledCompositingCommandLine = 10,
}

export enum EBrowserFeatureStatus {
	Invalid = 0,
	NotFound = 1,
	Unknown = 2,
	DisabledSoftware = 3,
	DisabledOff = 4,
	DisabledOffOk = 5,
	UnavailableSoftware = 6,
	UnavailableOff = 7,
	UnavailableOffOk = 8,
	EnabledReadback = 9,
	EnabledForce = 10,
	Enabled = 11,
	EnabledOn = 12,
	EnabledForceOn = 13,
}

export enum EGpuDriverId {
	Invalid = 0,
	Unknown = 1,
	AmdProprietary = 2,
	AmdOpenSource = 3,
	MesaRadv = 4,
	NvidiaProprietary = 5,
	IntelPropietary = 6,
	MesaIntel = 7,
	QualcommProprietary = 8,
	ArmProprietary = 9,
	GoogleSwiftshader = 10,
	BroadcomProprietary = 11,
	MesaLLVMPipe = 12,
	MoltenVK = 13,
	MesaTurnip = 14,
	MesaPanVK = 15,
	MesaVenus = 16,
	MesaDozen = 17,
	MesaNVK = 18,
	MesaHoneyKrisp = 19,
}

export enum ECommunityItemClass {
	Invalid = 0,
	Badge = 1,
	GameCard = 2,
	ProfileBackground = 3,
	Emoticon = 4,
	BoosterPack = 5,
	Consumable = 6,
	GameGoo = 7,
	ProfileModifier = 8,
	Scene = 9,
	SalienItem = 10,
	Sticker = 11,
	ChatEffect = 12,
	MiniProfileBackground = 13,
	AvatarFrame = 14,
	AnimatedAvatar = 15,
	SteamDeckKeyboardSkin = 16,
	SteamDeckStartupMovie = 17,
}

export enum ESteamDeckCompatibilityFeedback {
	Unset = 0,
	Agree = 1,
	Disagree = 2,
	Ignore = 3,
}

export enum EProvideDeckFeedbackPreference {
	Unset = 0,
	Yes = 1,
	No = 2,
}

export enum ETouchGesture {
	None = 0,
	Touch = 1,
	Tap = 2,
	DoubleTap = 3,
	ShortPress = 4,
	LongPress = 5,
	LongTap = 6,
	TwoFingerTap = 7,
	TapCancelled = 8,
	PinchBegin = 9,
	PinchUpdate = 10,
	PinchEnd = 11,
	FlingStart = 12,
	FlingCancelled = 13,
}

export enum ENewSteamAnnouncementState {
	Invalid = 0,
	AllRead = 1,
	NewAnnouncement = 2,
	FeaturedAnnouncement = 3,
}

export enum EForumType {
	Invalid = 0,
	General = 1,
	ReportedPosts = 2,
	Workshop = 3,
	PublishedFile = 4,
	Trading = 5,
	PlayTest = 6,
	Event = 7,
	Max = 8,
}

export enum ECommentThreadType {
	Invalid = 0,
	Developer = 2,
	Public = 3,
	Test = 6,
	ForumTopic = 7,
	Recommendation = 8,
	Profile = 10,
	NewsPost = 11,
	Clan = 12,
	ClanAnnouncement = 13,
	ClanEvent = 14,
	UserStatusPublished = 15,
	UserReceivedNewGame = 16,
	Announcement = 17,
	ModeratorMessage = 18,
	ClanCuratedApp = 19,
	QAndASession = 20,
	Max = 21,
}

export enum EBroadcastPermission {
	Disabled = 0,
	FriendsApprove = 1,
	FriendsAllowed = 2,
	Public = 3,
	Subscribers = 4,
}

export enum EBroadcastEncoderSetting {
	EBroadcastEncoderBestQuality = 0,
	EBroadcastEncoderBestPerformance = 1,
}

export enum ECloudGamingPlatform {
	None = 0,
	Valve = 1,
	NVIDIA = 2,
}

export enum ECompromiseDetectionType {
	None = 0,
	TradeEvent = 1,
	ApiCallRate = 2,
	Manual = 3,
	TicketAction = 4,
	MaliciousRefund = 5,
	Move2FA = 6,
}

export enum EAsyncGameSessionUserState {
	Unknown = -1,
	WaitingForOthers = 0,
	ReadyForAction = 1,
	Done = 2,
}

export enum EAsyncGameSessionUserVisibility {
	EnvelopeAndSessionList = 0,
	SessionListOnly = 1,
	Dismissed = 2,
}

export enum EGameRecordingType {
	Unknown = 0,
	NotRecording = 1,
	ManualRecording = 2,
	BackgroundRecording = 3,
	Clip = 4,
}

export enum EExportCodec {
	Default = 0,
	H264 = 1,
	H265 = 2,
}

export enum EProtoAppType {
	EAppTypeInvalid = 0,
	EAppTypeGame = 1,
	EAppTypeApplication = 2,
	EAppTypeTool = 4,
	EAppTypeDemo = 8,
	EAppTypeDeprected = 16,
	EAppTypeDLC = 32,
	EAppTypeGuide = 64,
	EAppTypeDriver = 128,
	EAppTypeConfig = 256,
	EAppTypeHardware = 512,
	EAppTypeFranchise = 1024,
	EAppTypeVideo = 2048,
	EAppTypePlugin = 4096,
	EAppTypeMusicAlbum = 8192,
	EAppTypeSeries = 16384,
	EAppTypeComic = 32768,
	EAppTypeBeta = 65536,
	EAppTypeShortcut = 1073741824,
	EAppTypeDepotOnly = -2147483648,
}

export enum EChildProcessQueryCommand {
	Invalid = 0,
	GpuTopology = 1,
	Max = 2,
}

export enum EChildProcessQueryExitCode {
	Success = 0,
	ErrorCommandline = -1,
	ErrorOther = -2,
	ErrorUnimplemented = -3,
	ErrorFileSave = -4,
	ErrorNotSupportedByPlatform = -5,
}

export enum EWindowsUpdateInstallationImpact {
	Unknown = -1,
	Normal = 0,
	Minor = 1,
	ExclusiveHandling = 2,
}

export enum EWindowsUpdateRebootBehavior {
	Unknown = -1,
	NeverNeedsReboot = 0,
	AlwaysNeedsReboot = 1,
	MightNeedReboot = 2,
}

export enum EExternalSaleEventType {
	Unknown = 0,
	Publisher = 1,
	Showcase = 2,
	Region = 3,
	Theme = 4,
	Franchise = 5,
}

