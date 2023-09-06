/**
 * Auto-generated file
 * Wed Sep 06 2023 10:11:32 GMT-0400 (Eastern Daylight Time)
 */
export var EPublishedFileQueryType;
(function (EPublishedFileQueryType) {
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByVote"] = 0] = "RankedByVote";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByPublicationDate"] = 1] = "RankedByPublicationDate";
    EPublishedFileQueryType[EPublishedFileQueryType["AcceptedForGameRankedByAcceptanceDate"] = 2] = "AcceptedForGameRankedByAcceptanceDate";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByTrend"] = 3] = "RankedByTrend";
    EPublishedFileQueryType[EPublishedFileQueryType["FavoritedByFriendsRankedByPublicationDate"] = 4] = "FavoritedByFriendsRankedByPublicationDate";
    EPublishedFileQueryType[EPublishedFileQueryType["CreatedByFriendsRankedByPublicationDate"] = 5] = "CreatedByFriendsRankedByPublicationDate";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByNumTimesReported"] = 6] = "RankedByNumTimesReported";
    EPublishedFileQueryType[EPublishedFileQueryType["CreatedByFollowedUsersRankedByPublicationDate"] = 7] = "CreatedByFollowedUsersRankedByPublicationDate";
    EPublishedFileQueryType[EPublishedFileQueryType["NotYetRated"] = 8] = "NotYetRated";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByTotalUniqueSubscriptions"] = 9] = "RankedByTotalUniqueSubscriptions";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByTotalVotesAsc"] = 10] = "RankedByTotalVotesAsc";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByVotesUp"] = 11] = "RankedByVotesUp";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByTextSearch"] = 12] = "RankedByTextSearch";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByPlaytimeTrend"] = 13] = "RankedByPlaytimeTrend";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByTotalPlaytime"] = 14] = "RankedByTotalPlaytime";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByAveragePlaytimeTrend"] = 15] = "RankedByAveragePlaytimeTrend";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByLifetimeAveragePlaytime"] = 16] = "RankedByLifetimeAveragePlaytime";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByPlaytimeSessionsTrend"] = 17] = "RankedByPlaytimeSessionsTrend";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByLifetimePlaytimeSessions"] = 18] = "RankedByLifetimePlaytimeSessions";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByInappropriateContentRating"] = 19] = "RankedByInappropriateContentRating";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByBanContentCheck"] = 20] = "RankedByBanContentCheck";
    EPublishedFileQueryType[EPublishedFileQueryType["RankedByLastUpdatedDate"] = 21] = "RankedByLastUpdatedDate";
})(EPublishedFileQueryType || (EPublishedFileQueryType = {}));
export var EPublishedFileInappropriateProvider;
(function (EPublishedFileInappropriateProvider) {
    EPublishedFileInappropriateProvider[EPublishedFileInappropriateProvider["Invalid"] = 0] = "Invalid";
    EPublishedFileInappropriateProvider[EPublishedFileInappropriateProvider["Google"] = 1] = "Google";
    EPublishedFileInappropriateProvider[EPublishedFileInappropriateProvider["Amazon"] = 2] = "Amazon";
})(EPublishedFileInappropriateProvider || (EPublishedFileInappropriateProvider = {}));
export var EPublishedFileInappropriateResult;
(function (EPublishedFileInappropriateResult) {
    EPublishedFileInappropriateResult[EPublishedFileInappropriateResult["NotScanned"] = 0] = "NotScanned";
    EPublishedFileInappropriateResult[EPublishedFileInappropriateResult["VeryUnlikely"] = 1] = "VeryUnlikely";
    EPublishedFileInappropriateResult[EPublishedFileInappropriateResult["Unlikely"] = 30] = "Unlikely";
    EPublishedFileInappropriateResult[EPublishedFileInappropriateResult["Possible"] = 50] = "Possible";
    EPublishedFileInappropriateResult[EPublishedFileInappropriateResult["Likely"] = 75] = "Likely";
    EPublishedFileInappropriateResult[EPublishedFileInappropriateResult["VeryLikely"] = 100] = "VeryLikely";
})(EPublishedFileInappropriateResult || (EPublishedFileInappropriateResult = {}));
export var EPersonaStateFlag;
(function (EPersonaStateFlag) {
    EPersonaStateFlag[EPersonaStateFlag["HasRichPresence"] = 1] = "HasRichPresence";
    EPersonaStateFlag[EPersonaStateFlag["InJoinableGame"] = 2] = "InJoinableGame";
    EPersonaStateFlag[EPersonaStateFlag["Golden"] = 4] = "Golden";
    EPersonaStateFlag[EPersonaStateFlag["RemotePlayTogether"] = 8] = "RemotePlayTogether";
    EPersonaStateFlag[EPersonaStateFlag["ClientTypeWeb"] = 256] = "ClientTypeWeb";
    EPersonaStateFlag[EPersonaStateFlag["ClientTypeMobile"] = 512] = "ClientTypeMobile";
    EPersonaStateFlag[EPersonaStateFlag["ClientTypeTenfoot"] = 1024] = "ClientTypeTenfoot";
    EPersonaStateFlag[EPersonaStateFlag["ClientTypeVR"] = 2048] = "ClientTypeVR";
    EPersonaStateFlag[EPersonaStateFlag["LaunchTypeGamepad"] = 4096] = "LaunchTypeGamepad";
    EPersonaStateFlag[EPersonaStateFlag["LaunchTypeCompatTool"] = 8192] = "LaunchTypeCompatTool";
})(EPersonaStateFlag || (EPersonaStateFlag = {}));
export var EContentCheckProvider;
(function (EContentCheckProvider) {
    EContentCheckProvider[EContentCheckProvider["Invalid"] = 0] = "Invalid";
    EContentCheckProvider[EContentCheckProvider["Google"] = 1] = "Google";
    EContentCheckProvider[EContentCheckProvider["Amazon"] = 2] = "Amazon";
    EContentCheckProvider[EContentCheckProvider["Local"] = 3] = "Local";
})(EContentCheckProvider || (EContentCheckProvider = {}));
export var EProfileCustomizationType;
(function (EProfileCustomizationType) {
    EProfileCustomizationType[EProfileCustomizationType["Invalid"] = 0] = "Invalid";
    EProfileCustomizationType[EProfileCustomizationType["RareAchievementShowcase"] = 1] = "RareAchievementShowcase";
    EProfileCustomizationType[EProfileCustomizationType["GameCollector"] = 2] = "GameCollector";
    EProfileCustomizationType[EProfileCustomizationType["ItemShowcase"] = 3] = "ItemShowcase";
    EProfileCustomizationType[EProfileCustomizationType["TradeShowcase"] = 4] = "TradeShowcase";
    EProfileCustomizationType[EProfileCustomizationType["Badges"] = 5] = "Badges";
    EProfileCustomizationType[EProfileCustomizationType["FavoriteGame"] = 6] = "FavoriteGame";
    EProfileCustomizationType[EProfileCustomizationType["ScreenshotShowcase"] = 7] = "ScreenshotShowcase";
    EProfileCustomizationType[EProfileCustomizationType["CustomText"] = 8] = "CustomText";
    EProfileCustomizationType[EProfileCustomizationType["FavoriteGroup"] = 9] = "FavoriteGroup";
    EProfileCustomizationType[EProfileCustomizationType["Recommendation"] = 10] = "Recommendation";
    EProfileCustomizationType[EProfileCustomizationType["WorkshopItem"] = 11] = "WorkshopItem";
    EProfileCustomizationType[EProfileCustomizationType["MyWorkshop"] = 12] = "MyWorkshop";
    EProfileCustomizationType[EProfileCustomizationType["ArtworkShowcase"] = 13] = "ArtworkShowcase";
    EProfileCustomizationType[EProfileCustomizationType["VideoShowcase"] = 14] = "VideoShowcase";
    EProfileCustomizationType[EProfileCustomizationType["Guides"] = 15] = "Guides";
    EProfileCustomizationType[EProfileCustomizationType["MyGuides"] = 16] = "MyGuides";
    EProfileCustomizationType[EProfileCustomizationType["Achievements"] = 17] = "Achievements";
    EProfileCustomizationType[EProfileCustomizationType["Greenlight"] = 18] = "Greenlight";
    EProfileCustomizationType[EProfileCustomizationType["MyGreenlight"] = 19] = "MyGreenlight";
    EProfileCustomizationType[EProfileCustomizationType["Salien"] = 20] = "Salien";
    EProfileCustomizationType[EProfileCustomizationType["LoyaltyRewardReactions"] = 21] = "LoyaltyRewardReactions";
    EProfileCustomizationType[EProfileCustomizationType["SingleArtworkShowcase"] = 22] = "SingleArtworkShowcase";
    EProfileCustomizationType[EProfileCustomizationType["AchievementsCompletionist"] = 23] = "AchievementsCompletionist";
    EProfileCustomizationType[EProfileCustomizationType["Replay"] = 24] = "Replay";
})(EProfileCustomizationType || (EProfileCustomizationType = {}));
export var EPublishedFileStorageSystem;
(function (EPublishedFileStorageSystem) {
    EPublishedFileStorageSystem[EPublishedFileStorageSystem["Invalid"] = 0] = "Invalid";
    EPublishedFileStorageSystem[EPublishedFileStorageSystem["LegacyCloud"] = 1] = "LegacyCloud";
    EPublishedFileStorageSystem[EPublishedFileStorageSystem["Depot"] = 2] = "Depot";
    EPublishedFileStorageSystem[EPublishedFileStorageSystem["UGCCloud"] = 3] = "UGCCloud";
})(EPublishedFileStorageSystem || (EPublishedFileStorageSystem = {}));
export var ECloudStoragePersistState;
(function (ECloudStoragePersistState) {
    ECloudStoragePersistState[ECloudStoragePersistState["Persisted"] = 0] = "Persisted";
    ECloudStoragePersistState[ECloudStoragePersistState["Forgotten"] = 1] = "Forgotten";
    ECloudStoragePersistState[ECloudStoragePersistState["Deleted"] = 2] = "Deleted";
})(ECloudStoragePersistState || (ECloudStoragePersistState = {}));
export var ESDCardFormatStage;
(function (ESDCardFormatStage) {
    ESDCardFormatStage[ESDCardFormatStage["Invalid"] = 0] = "Invalid";
    ESDCardFormatStage[ESDCardFormatStage["Starting"] = 1] = "Starting";
    ESDCardFormatStage[ESDCardFormatStage["Testing"] = 2] = "Testing";
    ESDCardFormatStage[ESDCardFormatStage["Rescuing"] = 3] = "Rescuing";
    ESDCardFormatStage[ESDCardFormatStage["Formatting"] = 4] = "Formatting";
    ESDCardFormatStage[ESDCardFormatStage["Finalizing"] = 5] = "Finalizing";
})(ESDCardFormatStage || (ESDCardFormatStage = {}));
export var ESystemFanControlMode;
(function (ESystemFanControlMode) {
    ESystemFanControlMode[ESystemFanControlMode["Invalid"] = 0] = "Invalid";
    ESystemFanControlMode[ESystemFanControlMode["Disabled"] = 1] = "Disabled";
    ESystemFanControlMode[ESystemFanControlMode["Default"] = 2] = "Default";
})(ESystemFanControlMode || (ESystemFanControlMode = {}));
export var EBluetoothDeviceType;
(function (EBluetoothDeviceType) {
    EBluetoothDeviceType[EBluetoothDeviceType["Invalid"] = 0] = "Invalid";
    EBluetoothDeviceType[EBluetoothDeviceType["Unknown"] = 1] = "Unknown";
    EBluetoothDeviceType[EBluetoothDeviceType["Phone"] = 2] = "Phone";
    EBluetoothDeviceType[EBluetoothDeviceType["Computer"] = 3] = "Computer";
    EBluetoothDeviceType[EBluetoothDeviceType["Headset"] = 4] = "Headset";
    EBluetoothDeviceType[EBluetoothDeviceType["Headphones"] = 5] = "Headphones";
    EBluetoothDeviceType[EBluetoothDeviceType["Speakers"] = 6] = "Speakers";
    EBluetoothDeviceType[EBluetoothDeviceType["OtherAudio"] = 7] = "OtherAudio";
    EBluetoothDeviceType[EBluetoothDeviceType["Mouse"] = 8] = "Mouse";
    EBluetoothDeviceType[EBluetoothDeviceType["Joystick"] = 9] = "Joystick";
    EBluetoothDeviceType[EBluetoothDeviceType["Gamepad"] = 10] = "Gamepad";
    EBluetoothDeviceType[EBluetoothDeviceType["Keyboard"] = 11] = "Keyboard";
})(EBluetoothDeviceType || (EBluetoothDeviceType = {}));
export var ESystemAudioDirection;
(function (ESystemAudioDirection) {
    ESystemAudioDirection[ESystemAudioDirection["Invalid"] = 0] = "Invalid";
    ESystemAudioDirection[ESystemAudioDirection["Input"] = 1] = "Input";
    ESystemAudioDirection[ESystemAudioDirection["Output"] = 2] = "Output";
})(ESystemAudioDirection || (ESystemAudioDirection = {}));
export var ESystemAudioChannel;
(function (ESystemAudioChannel) {
    ESystemAudioChannel[ESystemAudioChannel["Invalid"] = 0] = "Invalid";
    ESystemAudioChannel[ESystemAudioChannel["Aggregated"] = 1] = "Aggregated";
    ESystemAudioChannel[ESystemAudioChannel["FrontLeft"] = 2] = "FrontLeft";
    ESystemAudioChannel[ESystemAudioChannel["FrontRight"] = 3] = "FrontRight";
    ESystemAudioChannel[ESystemAudioChannel["LFE"] = 4] = "LFE";
    ESystemAudioChannel[ESystemAudioChannel["BackLeft"] = 5] = "BackLeft";
    ESystemAudioChannel[ESystemAudioChannel["BackRight"] = 6] = "BackRight";
    ESystemAudioChannel[ESystemAudioChannel["FrontCenter"] = 7] = "FrontCenter";
    ESystemAudioChannel[ESystemAudioChannel["Unknown"] = 8] = "Unknown";
    ESystemAudioChannel[ESystemAudioChannel["Mono"] = 9] = "Mono";
})(ESystemAudioChannel || (ESystemAudioChannel = {}));
export var ESystemAudioPortType;
(function (ESystemAudioPortType) {
    ESystemAudioPortType[ESystemAudioPortType["Invalid"] = 0] = "Invalid";
    ESystemAudioPortType[ESystemAudioPortType["Unknown"] = 1] = "Unknown";
    ESystemAudioPortType[ESystemAudioPortType["Audio32f"] = 2] = "Audio32f";
    ESystemAudioPortType[ESystemAudioPortType["Midi8b"] = 3] = "Midi8b";
    ESystemAudioPortType[ESystemAudioPortType["Video32RGBA"] = 4] = "Video32RGBA";
})(ESystemAudioPortType || (ESystemAudioPortType = {}));
export var ESystemAudioPortDirection;
(function (ESystemAudioPortDirection) {
    ESystemAudioPortDirection[ESystemAudioPortDirection["Invalid"] = 0] = "Invalid";
    ESystemAudioPortDirection[ESystemAudioPortDirection["Input"] = 1] = "Input";
    ESystemAudioPortDirection[ESystemAudioPortDirection["Output"] = 2] = "Output";
})(ESystemAudioPortDirection || (ESystemAudioPortDirection = {}));
export var ESystemServiceState;
(function (ESystemServiceState) {
    ESystemServiceState[ESystemServiceState["Unavailable"] = 0] = "Unavailable";
    ESystemServiceState[ESystemServiceState["Disabled"] = 1] = "Disabled";
    ESystemServiceState[ESystemServiceState["Enabled"] = 2] = "Enabled";
})(ESystemServiceState || (ESystemServiceState = {}));
export var EGraphicsPerfOverlayLevel;
(function (EGraphicsPerfOverlayLevel) {
    EGraphicsPerfOverlayLevel[EGraphicsPerfOverlayLevel["Hidden"] = 0] = "Hidden";
    EGraphicsPerfOverlayLevel[EGraphicsPerfOverlayLevel["Basic"] = 1] = "Basic";
    EGraphicsPerfOverlayLevel[EGraphicsPerfOverlayLevel["Medium"] = 2] = "Medium";
    EGraphicsPerfOverlayLevel[EGraphicsPerfOverlayLevel["Full"] = 3] = "Full";
    EGraphicsPerfOverlayLevel[EGraphicsPerfOverlayLevel["Minimal"] = 4] = "Minimal";
})(EGraphicsPerfOverlayLevel || (EGraphicsPerfOverlayLevel = {}));
export var EGPUPerformanceLevel;
(function (EGPUPerformanceLevel) {
    EGPUPerformanceLevel[EGPUPerformanceLevel["Invalid"] = 0] = "Invalid";
    EGPUPerformanceLevel[EGPUPerformanceLevel["Auto"] = 1] = "Auto";
    EGPUPerformanceLevel[EGPUPerformanceLevel["Manual"] = 2] = "Manual";
    EGPUPerformanceLevel[EGPUPerformanceLevel["Low"] = 3] = "Low";
    EGPUPerformanceLevel[EGPUPerformanceLevel["High"] = 4] = "High";
    EGPUPerformanceLevel[EGPUPerformanceLevel["Profiling"] = 5] = "Profiling";
})(EGPUPerformanceLevel || (EGPUPerformanceLevel = {}));
export var EScalingFilter;
(function (EScalingFilter) {
    EScalingFilter[EScalingFilter["Invalid"] = 0] = "Invalid";
    EScalingFilter[EScalingFilter["FSR"] = 1] = "FSR";
    EScalingFilter[EScalingFilter["Nearest"] = 2] = "Nearest";
    EScalingFilter[EScalingFilter["Integer"] = 3] = "Integer";
    EScalingFilter[EScalingFilter["Linear"] = 4] = "Linear";
    EScalingFilter[EScalingFilter["NIS"] = 5] = "NIS";
})(EScalingFilter || (EScalingFilter = {}));
export var ESplitScalingFilter;
(function (ESplitScalingFilter) {
    ESplitScalingFilter[ESplitScalingFilter["Invalid"] = 0] = "Invalid";
    ESplitScalingFilter[ESplitScalingFilter["Linear"] = 1] = "Linear";
    ESplitScalingFilter[ESplitScalingFilter["Nearest"] = 2] = "Nearest";
    ESplitScalingFilter[ESplitScalingFilter["FSR"] = 3] = "FSR";
    ESplitScalingFilter[ESplitScalingFilter["NIS"] = 4] = "NIS";
})(ESplitScalingFilter || (ESplitScalingFilter = {}));
export var ESplitScalingScaler;
(function (ESplitScalingScaler) {
    ESplitScalingScaler[ESplitScalingScaler["Invalid"] = 0] = "Invalid";
    ESplitScalingScaler[ESplitScalingScaler["Auto"] = 1] = "Auto";
    ESplitScalingScaler[ESplitScalingScaler["Integer"] = 2] = "Integer";
    ESplitScalingScaler[ESplitScalingScaler["Fit"] = 3] = "Fit";
    ESplitScalingScaler[ESplitScalingScaler["Fill"] = 4] = "Fill";
    ESplitScalingScaler[ESplitScalingScaler["Stretch"] = 5] = "Stretch";
})(ESplitScalingScaler || (ESplitScalingScaler = {}));
export var EHDRToneMapOperator;
(function (EHDRToneMapOperator) {
    EHDRToneMapOperator[EHDRToneMapOperator["Invalid"] = 0] = "Invalid";
    EHDRToneMapOperator[EHDRToneMapOperator["Uncharted"] = 1] = "Uncharted";
    EHDRToneMapOperator[EHDRToneMapOperator["Reinhard"] = 2] = "Reinhard";
})(EHDRToneMapOperator || (EHDRToneMapOperator = {}));
export var ECPUGovernor;
(function (ECPUGovernor) {
    ECPUGovernor[ECPUGovernor["Invalid"] = 0] = "Invalid";
    ECPUGovernor[ECPUGovernor["Perf"] = 1] = "Perf";
    ECPUGovernor[ECPUGovernor["Powersave"] = 2] = "Powersave";
    ECPUGovernor[ECPUGovernor["Manual"] = 3] = "Manual";
})(ECPUGovernor || (ECPUGovernor = {}));
export var EUpdaterType;
(function (EUpdaterType) {
    EUpdaterType[EUpdaterType["Invalid"] = 0] = "Invalid";
    EUpdaterType[EUpdaterType["Client"] = 1] = "Client";
    EUpdaterType[EUpdaterType["OS"] = 2] = "OS";
    EUpdaterType[EUpdaterType["BIOS"] = 3] = "BIOS";
    EUpdaterType[EUpdaterType["Aggregated"] = 4] = "Aggregated";
    EUpdaterType[EUpdaterType["Test1"] = 5] = "Test1";
    EUpdaterType[EUpdaterType["Test2"] = 6] = "Test2";
    EUpdaterType[EUpdaterType["Dummy"] = 7] = "Dummy";
})(EUpdaterType || (EUpdaterType = {}));
export var EUpdaterState;
(function (EUpdaterState) {
    EUpdaterState[EUpdaterState["Invalid"] = 0] = "Invalid";
    EUpdaterState[EUpdaterState["UpToDate"] = 2] = "UpToDate";
    EUpdaterState[EUpdaterState["Checking"] = 3] = "Checking";
    EUpdaterState[EUpdaterState["Available"] = 4] = "Available";
    EUpdaterState[EUpdaterState["Applying"] = 5] = "Applying";
    EUpdaterState[EUpdaterState["ClientRestartPending"] = 6] = "ClientRestartPending";
    EUpdaterState[EUpdaterState["SystemRestartPending"] = 7] = "SystemRestartPending";
})(EUpdaterState || (EUpdaterState = {}));
export var EStorageBlockContentType;
(function (EStorageBlockContentType) {
    EStorageBlockContentType[EStorageBlockContentType["Invalid"] = 0] = "Invalid";
    EStorageBlockContentType[EStorageBlockContentType["Unknown"] = 1] = "Unknown";
    EStorageBlockContentType[EStorageBlockContentType["FileSystem"] = 2] = "FileSystem";
    EStorageBlockContentType[EStorageBlockContentType["Crypto"] = 3] = "Crypto";
    EStorageBlockContentType[EStorageBlockContentType["Raid"] = 4] = "Raid";
})(EStorageBlockContentType || (EStorageBlockContentType = {}));
export var EStorageBlockFileSystemType;
(function (EStorageBlockFileSystemType) {
    EStorageBlockFileSystemType[EStorageBlockFileSystemType["Invalid"] = 0] = "Invalid";
    EStorageBlockFileSystemType[EStorageBlockFileSystemType["Unknown"] = 1] = "Unknown";
    EStorageBlockFileSystemType[EStorageBlockFileSystemType["VFat"] = 2] = "VFat";
    EStorageBlockFileSystemType[EStorageBlockFileSystemType["Ext4"] = 3] = "Ext4";
})(EStorageBlockFileSystemType || (EStorageBlockFileSystemType = {}));
export var EStorageDriveMediaType;
(function (EStorageDriveMediaType) {
    EStorageDriveMediaType[EStorageDriveMediaType["Invalid"] = 0] = "Invalid";
    EStorageDriveMediaType[EStorageDriveMediaType["Unknown"] = 1] = "Unknown";
    EStorageDriveMediaType[EStorageDriveMediaType["HDD"] = 2] = "HDD";
    EStorageDriveMediaType[EStorageDriveMediaType["SSD"] = 3] = "SSD";
    EStorageDriveMediaType[EStorageDriveMediaType["Removable"] = 4] = "Removable";
})(EStorageDriveMediaType || (EStorageDriveMediaType = {}));
export var ESystemDisplayCompatibilityMode;
(function (ESystemDisplayCompatibilityMode) {
    ESystemDisplayCompatibilityMode[ESystemDisplayCompatibilityMode["Invalid"] = 0] = "Invalid";
    ESystemDisplayCompatibilityMode[ESystemDisplayCompatibilityMode["None"] = 1] = "None";
    ESystemDisplayCompatibilityMode[ESystemDisplayCompatibilityMode["MinimalBandwith"] = 2] = "MinimalBandwith";
})(ESystemDisplayCompatibilityMode || (ESystemDisplayCompatibilityMode = {}));
export var ESteamDeckCompatibilityCategory;
(function (ESteamDeckCompatibilityCategory) {
    ESteamDeckCompatibilityCategory[ESteamDeckCompatibilityCategory["Unknown"] = 0] = "Unknown";
    ESteamDeckCompatibilityCategory[ESteamDeckCompatibilityCategory["Unsupported"] = 1] = "Unsupported";
    ESteamDeckCompatibilityCategory[ESteamDeckCompatibilityCategory["Playable"] = 2] = "Playable";
    ESteamDeckCompatibilityCategory[ESteamDeckCompatibilityCategory["Verified"] = 3] = "Verified";
})(ESteamDeckCompatibilityCategory || (ESteamDeckCompatibilityCategory = {}));
export var ESteamDeckCompatibilityResultDisplayType;
(function (ESteamDeckCompatibilityResultDisplayType) {
    ESteamDeckCompatibilityResultDisplayType[ESteamDeckCompatibilityResultDisplayType["Invisible"] = 0] = "Invisible";
    ESteamDeckCompatibilityResultDisplayType[ESteamDeckCompatibilityResultDisplayType["Informational"] = 1] = "Informational";
    ESteamDeckCompatibilityResultDisplayType[ESteamDeckCompatibilityResultDisplayType["Unsupported"] = 2] = "Unsupported";
    ESteamDeckCompatibilityResultDisplayType[ESteamDeckCompatibilityResultDisplayType["Playable"] = 3] = "Playable";
    ESteamDeckCompatibilityResultDisplayType[ESteamDeckCompatibilityResultDisplayType["Verified"] = 4] = "Verified";
})(ESteamDeckCompatibilityResultDisplayType || (ESteamDeckCompatibilityResultDisplayType = {}));
export var EACState;
(function (EACState) {
    EACState[EACState["Unknown"] = 0] = "Unknown";
    EACState[EACState["Disconnected"] = 1] = "Disconnected";
    EACState[EACState["Connected"] = 2] = "Connected";
    EACState[EACState["ConnectedSlow"] = 3] = "ConnectedSlow";
})(EACState || (EACState = {}));
export var EBatteryState;
(function (EBatteryState) {
    EBatteryState[EBatteryState["Unknown"] = 0] = "Unknown";
    EBatteryState[EBatteryState["Discharging"] = 1] = "Discharging";
    EBatteryState[EBatteryState["Charging"] = 2] = "Charging";
    EBatteryState[EBatteryState["Full"] = 3] = "Full";
})(EBatteryState || (EBatteryState = {}));
export var EOSBranch;
(function (EOSBranch) {
    EOSBranch[EOSBranch["Unknown"] = 0] = "Unknown";
    EOSBranch[EOSBranch["Release"] = 1] = "Release";
    EOSBranch[EOSBranch["ReleaseCandidate"] = 2] = "ReleaseCandidate";
    EOSBranch[EOSBranch["Beta"] = 3] = "Beta";
    EOSBranch[EOSBranch["BetaCandidate"] = 4] = "BetaCandidate";
    EOSBranch[EOSBranch["Main"] = 5] = "Main";
    EOSBranch[EOSBranch["Staging"] = 6] = "Staging";
})(EOSBranch || (EOSBranch = {}));
export var ECommunityItemClass;
(function (ECommunityItemClass) {
    ECommunityItemClass[ECommunityItemClass["Invalid"] = 0] = "Invalid";
    ECommunityItemClass[ECommunityItemClass["Badge"] = 1] = "Badge";
    ECommunityItemClass[ECommunityItemClass["GameCard"] = 2] = "GameCard";
    ECommunityItemClass[ECommunityItemClass["ProfileBackground"] = 3] = "ProfileBackground";
    ECommunityItemClass[ECommunityItemClass["Emoticon"] = 4] = "Emoticon";
    ECommunityItemClass[ECommunityItemClass["BoosterPack"] = 5] = "BoosterPack";
    ECommunityItemClass[ECommunityItemClass["Consumable"] = 6] = "Consumable";
    ECommunityItemClass[ECommunityItemClass["GameGoo"] = 7] = "GameGoo";
    ECommunityItemClass[ECommunityItemClass["ProfileModifier"] = 8] = "ProfileModifier";
    ECommunityItemClass[ECommunityItemClass["Scene"] = 9] = "Scene";
    ECommunityItemClass[ECommunityItemClass["SalienItem"] = 10] = "SalienItem";
    ECommunityItemClass[ECommunityItemClass["Sticker"] = 11] = "Sticker";
    ECommunityItemClass[ECommunityItemClass["ChatEffect"] = 12] = "ChatEffect";
    ECommunityItemClass[ECommunityItemClass["MiniProfileBackground"] = 13] = "MiniProfileBackground";
    ECommunityItemClass[ECommunityItemClass["AvatarFrame"] = 14] = "AvatarFrame";
    ECommunityItemClass[ECommunityItemClass["AnimatedAvatar"] = 15] = "AnimatedAvatar";
    ECommunityItemClass[ECommunityItemClass["SteamDeckKeyboardSkin"] = 16] = "SteamDeckKeyboardSkin";
    ECommunityItemClass[ECommunityItemClass["SteamDeckStartupMovie"] = 17] = "SteamDeckStartupMovie";
})(ECommunityItemClass || (ECommunityItemClass = {}));
export var ESteamDeckCompatibilityFeedback;
(function (ESteamDeckCompatibilityFeedback) {
    ESteamDeckCompatibilityFeedback[ESteamDeckCompatibilityFeedback["Unset"] = 0] = "Unset";
    ESteamDeckCompatibilityFeedback[ESteamDeckCompatibilityFeedback["Agree"] = 1] = "Agree";
    ESteamDeckCompatibilityFeedback[ESteamDeckCompatibilityFeedback["Disagree"] = 2] = "Disagree";
    ESteamDeckCompatibilityFeedback[ESteamDeckCompatibilityFeedback["Ignore"] = 3] = "Ignore";
})(ESteamDeckCompatibilityFeedback || (ESteamDeckCompatibilityFeedback = {}));
export var EProvideDeckFeedbackPreference;
(function (EProvideDeckFeedbackPreference) {
    EProvideDeckFeedbackPreference[EProvideDeckFeedbackPreference["Unset"] = 0] = "Unset";
    EProvideDeckFeedbackPreference[EProvideDeckFeedbackPreference["Yes"] = 1] = "Yes";
    EProvideDeckFeedbackPreference[EProvideDeckFeedbackPreference["No"] = 2] = "No";
})(EProvideDeckFeedbackPreference || (EProvideDeckFeedbackPreference = {}));
export var ETouchGesture;
(function (ETouchGesture) {
    ETouchGesture[ETouchGesture["None"] = 0] = "None";
    ETouchGesture[ETouchGesture["Touch"] = 1] = "Touch";
    ETouchGesture[ETouchGesture["Tap"] = 2] = "Tap";
    ETouchGesture[ETouchGesture["DoubleTap"] = 3] = "DoubleTap";
    ETouchGesture[ETouchGesture["ShortPress"] = 4] = "ShortPress";
    ETouchGesture[ETouchGesture["LongPress"] = 5] = "LongPress";
    ETouchGesture[ETouchGesture["LongTap"] = 6] = "LongTap";
    ETouchGesture[ETouchGesture["TwoFingerTap"] = 7] = "TwoFingerTap";
    ETouchGesture[ETouchGesture["TapCancelled"] = 8] = "TapCancelled";
    ETouchGesture[ETouchGesture["PinchBegin"] = 9] = "PinchBegin";
    ETouchGesture[ETouchGesture["PinchUpdate"] = 10] = "PinchUpdate";
    ETouchGesture[ETouchGesture["PinchEnd"] = 11] = "PinchEnd";
    ETouchGesture[ETouchGesture["FlingStart"] = 12] = "FlingStart";
    ETouchGesture[ETouchGesture["FlingCancelled"] = 13] = "FlingCancelled";
})(ETouchGesture || (ETouchGesture = {}));
export var ESessionPersistence;
(function (ESessionPersistence) {
    ESessionPersistence[ESessionPersistence["Invalid"] = -1] = "Invalid";
    ESessionPersistence[ESessionPersistence["Ephemeral"] = 0] = "Ephemeral";
    ESessionPersistence[ESessionPersistence["Persistent"] = 1] = "Persistent";
})(ESessionPersistence || (ESessionPersistence = {}));
export var ENewSteamAnnouncementState;
(function (ENewSteamAnnouncementState) {
    ENewSteamAnnouncementState[ENewSteamAnnouncementState["Invalid"] = 0] = "Invalid";
    ENewSteamAnnouncementState[ENewSteamAnnouncementState["AllRead"] = 1] = "AllRead";
    ENewSteamAnnouncementState[ENewSteamAnnouncementState["NewAnnouncement"] = 2] = "NewAnnouncement";
    ENewSteamAnnouncementState[ENewSteamAnnouncementState["FeaturedAnnouncement"] = 3] = "FeaturedAnnouncement";
})(ENewSteamAnnouncementState || (ENewSteamAnnouncementState = {}));
export var ECommentThreadType;
(function (ECommentThreadType) {
    ECommentThreadType[ECommentThreadType["Invalid"] = 0] = "Invalid";
    ECommentThreadType[ECommentThreadType["Developer"] = 2] = "Developer";
    ECommentThreadType[ECommentThreadType["Public"] = 3] = "Public";
    ECommentThreadType[ECommentThreadType["Test"] = 6] = "Test";
    ECommentThreadType[ECommentThreadType["ForumTopic"] = 7] = "ForumTopic";
    ECommentThreadType[ECommentThreadType["Recommendation"] = 8] = "Recommendation";
    ECommentThreadType[ECommentThreadType["Profile"] = 10] = "Profile";
    ECommentThreadType[ECommentThreadType["NewsPost"] = 11] = "NewsPost";
    ECommentThreadType[ECommentThreadType["Clan"] = 12] = "Clan";
    ECommentThreadType[ECommentThreadType["ClanAnnouncement"] = 13] = "ClanAnnouncement";
    ECommentThreadType[ECommentThreadType["ClanEvent"] = 14] = "ClanEvent";
    ECommentThreadType[ECommentThreadType["UserStatusPublished"] = 15] = "UserStatusPublished";
    ECommentThreadType[ECommentThreadType["UserReceivedNewGame"] = 16] = "UserReceivedNewGame";
    ECommentThreadType[ECommentThreadType["Announcement"] = 17] = "Announcement";
    ECommentThreadType[ECommentThreadType["ModeratorMessage"] = 18] = "ModeratorMessage";
    ECommentThreadType[ECommentThreadType["ClanCuratedApp"] = 19] = "ClanCuratedApp";
    ECommentThreadType[ECommentThreadType["QAndASession"] = 20] = "QAndASession";
    ECommentThreadType[ECommentThreadType["Max"] = 21] = "Max";
})(ECommentThreadType || (ECommentThreadType = {}));
export var EBroadcastPermission;
(function (EBroadcastPermission) {
    EBroadcastPermission[EBroadcastPermission["Disabled"] = 0] = "Disabled";
    EBroadcastPermission[EBroadcastPermission["FriendsApprove"] = 1] = "FriendsApprove";
    EBroadcastPermission[EBroadcastPermission["FriendsAllowed"] = 2] = "FriendsAllowed";
    EBroadcastPermission[EBroadcastPermission["Public"] = 3] = "Public";
    EBroadcastPermission[EBroadcastPermission["Subscribers"] = 4] = "Subscribers";
})(EBroadcastPermission || (EBroadcastPermission = {}));
export var EBroadcastEncoderSetting;
(function (EBroadcastEncoderSetting) {
    EBroadcastEncoderSetting[EBroadcastEncoderSetting["EBroadcastEncoderBestQuality"] = 0] = "EBroadcastEncoderBestQuality";
    EBroadcastEncoderSetting[EBroadcastEncoderSetting["EBroadcastEncoderBestPerformance"] = 1] = "EBroadcastEncoderBestPerformance";
})(EBroadcastEncoderSetting || (EBroadcastEncoderSetting = {}));
export var ECloudGamingPlatform;
(function (ECloudGamingPlatform) {
    ECloudGamingPlatform[ECloudGamingPlatform["None"] = 0] = "None";
    ECloudGamingPlatform[ECloudGamingPlatform["Valve"] = 1] = "Valve";
    ECloudGamingPlatform[ECloudGamingPlatform["NVIDIA"] = 2] = "NVIDIA";
})(ECloudGamingPlatform || (ECloudGamingPlatform = {}));
