/**
 * Auto-generated file
 * Wed May 22 2024 20:34:57 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CPlayer_GetRecentPlaytimeSessionsForChild_Request = {
	steamid?: Long
}

export type CPlayer_GetRecentPlaytimeSessionsForChild_Response = {
	sessions?: .CPlayer_GetRecentPlaytimeSessionsForChild_Response.PlaytimeSession[]
}

export type CPlayer_GetPlayerLinkDetails_Request = {
	steamids?: Long[]
}

export type CPlayer_GetPlayerLinkDetails_Response = {
	accounts?: .CPlayer_GetPlayerLinkDetails_Response.PlayerLinkDetails[]
}

export type CPlayer_GetMutualFriendsForIncomingInvites_Request = {
}

export type CPlayer_IncomingInviteMutualFriendList = {
	steamid?: Long
	mutualFriendAccountIds?: number[]
}

export type CPlayer_GetMutualFriendsForIncomingInvites_Response = {
	incomingInviteMutualFriendsLists?: .CPlayer_IncomingInviteMutualFriendList[]
}

export type CPlayer_GetOwnedGames_Request = {
	steamid?: Long
	includeAppinfo?: boolean
	includePlayedFreeGames?: boolean
	appidsFilter?: number[]
	includeFreeSub?: boolean
	skipUnvettedApps?: boolean
	language?: string
	includeExtendedAppinfo?: boolean
}

export type CPlayer_GetOwnedGames_Response = {
	gameCount?: number
	games?: .CPlayer_GetOwnedGames_Response.Game[]
}

export type CPlayer_GetPlayNext_Request = {
	maxAgeSeconds?: number
	ignoreAppids?: number[]
}

export type CPlayer_GetPlayNext_Response = {
	lastUpdateTime?: number
	appids?: number[]
}

export type CPlayer_GetFriendsGameplayInfo_Request = {
	appid?: number
}

export type CPlayer_GetFriendsGameplayInfo_Response = {
	yourInfo?: .CPlayer_GetFriendsGameplayInfo_Response.OwnGameplayInfo
	inGame?: .CPlayer_GetFriendsGameplayInfo_Response.FriendsGameplayInfo[]
	playedRecently?: .CPlayer_GetFriendsGameplayInfo_Response.FriendsGameplayInfo[]
	playedEver?: .CPlayer_GetFriendsGameplayInfo_Response.FriendsGameplayInfo[]
	owns?: .CPlayer_GetFriendsGameplayInfo_Response.FriendsGameplayInfo[]
	inWishlist?: .CPlayer_GetFriendsGameplayInfo_Response.FriendsGameplayInfo[]
}

export type CPlayer_GetGameBadgeLevels_Request = {
	appid?: number
}

export type CPlayer_GetGameBadgeLevels_Response = {
	playerLevel?: number
	badges?: .CPlayer_GetGameBadgeLevels_Response.Badge[]
}

export type CPlayer_GetProfileBackground_Request = {
	steamid?: Long
	language?: string
}

export type ProfileItem = {
	communityitemid?: Long
	imageSmall?: string
	imageLarge?: string
	name?: string
	itemTitle?: string
	itemDescription?: string
	appid?: number
	itemType?: number
	itemClass?: number
	movieWebm?: string
	movieMp4?: string
	movieWebmSmall?: string
	movieMp4Small?: string
	equippedFlags?: number
	profileColors?: .ProfileItem.ProfileColor[]
}

export type CPlayer_GetProfileBackground_Response = {
	profileBackground?: .ProfileItem
}

export type CPlayer_SetProfileBackground_Request = {
	communityitemid?: Long
}

export type CPlayer_SetProfileBackground_Response = {
}

export type CPlayer_GetMiniProfileBackground_Request = {
	steamid?: Long
	language?: string
}

export type CPlayer_GetMiniProfileBackground_Response = {
	profileBackground?: .ProfileItem
}

export type CPlayer_SetMiniProfileBackground_Request = {
	communityitemid?: Long
}

export type CPlayer_SetMiniProfileBackground_Response = {
}

export type CPlayer_GetAvatarFrame_Request = {
	steamid?: Long
	language?: string
}

export type CPlayer_GetAvatarFrame_Response = {
	avatarFrame?: .ProfileItem
}

export type CPlayer_SetAvatarFrame_Request = {
	communityitemid?: Long
}

export type CPlayer_SetAvatarFrame_Response = {
}

export type CPlayer_GetAnimatedAvatar_Request = {
	steamid?: Long
	language?: string
}

export type CPlayer_GetAnimatedAvatar_Response = {
	avatar?: .ProfileItem
}

export type CPlayer_SetAnimatedAvatar_Request = {
	communityitemid?: Long
}

export type CPlayer_SetAnimatedAvatar_Response = {
}

export type CPlayer_GetSteamDeckKeyboardSkin_Request = {
	steamid?: Long
	language?: string
}

export type CPlayer_GetSteamDeckKeyboardSkin_Response = {
	steamDeckKeyboardSkin?: .ProfileItem
}

export type CPlayer_SetSteamDeckKeyboardSkin_Request = {
	communityitemid?: Long
}

export type CPlayer_SetSteamDeckKeyboardSkin_Response = {
}

export type CPlayer_GetProfileItemsOwned_Request = {
	language?: string
	filters?: .ECommunityItemClass[]
}

export type CPlayer_GetProfileItemsOwned_Response = {
	profileBackgrounds?: .ProfileItem[]
	miniProfileBackgrounds?: .ProfileItem[]
	avatarFrames?: .ProfileItem[]
	animatedAvatars?: .ProfileItem[]
	profileModifiers?: .ProfileItem[]
	steamDeckKeyboardSkins?: .ProfileItem[]
	steamDeckStartupMovies?: .ProfileItem[]
}

export type CPlayer_GetProfileItemsEquipped_Request = {
	steamid?: Long
	language?: string
}

export type CPlayer_GetProfileItemsEquipped_Response = {
	profileBackground?: .ProfileItem
	miniProfileBackground?: .ProfileItem
	avatarFrame?: .ProfileItem
	animatedAvatar?: .ProfileItem
	profileModifier?: .ProfileItem
	steamDeckKeyboardSkin?: .ProfileItem
}

export type CPlayer_SetEquippedProfileItemFlags_Request = {
	communityitemid?: Long
	flags?: number
}

export type CPlayer_SetEquippedProfileItemFlags_Response = {
}

export type CPlayer_GetEmoticonList_Request = {
}

export type CPlayer_GetEmoticonList_Response = {
	emoticons?: .CPlayer_GetEmoticonList_Response.Emoticon[]
}

export type CPlayer_GetCommunityBadgeProgress_Request = {
	steamid?: Long
	badgeid?: number
}

export type CPlayer_GetCommunityBadgeProgress_Response = {
	quests?: .CPlayer_GetCommunityBadgeProgress_Response.Quest[]
}

export type CPlayer_GetTopAchievementsForGames_Request = {
	steamid?: Long
	language?: string
	maxAchievements?: number
	appids?: number[]
}

export type CPlayer_GetTopAchievementsForGames_Response = {
	games?: .CPlayer_GetTopAchievementsForGames_Response.Game[]
}

export type CPlayer_GetAchievementsProgress_Request = {
	steamid?: Long
	language?: string
	appids?: number[]
}

export type CPlayer_GetAchievementsProgress_Response = {
	achievementProgress?: .CPlayer_GetAchievementsProgress_Response.AchievementProgress[]
}

export type CPlayer_GetGameAchievements_Request = {
	appid?: number
	language?: string
}

export type CPlayer_GetGameAchievements_Response = {
	achievements?: .CPlayer_GetGameAchievements_Response.Achievement[]
}

export type CPlayer_GetFavoriteBadge_Request = {
	steamid?: Long
}

export type CPlayer_GetFavoriteBadge_Response = {
	hasFavoriteBadge?: boolean
	badgeid?: number
	communityitemid?: Long
	itemType?: number
	borderColor?: number
	appid?: number
	level?: number
}

export type CPlayer_SetFavoriteBadge_Request = {
	communityitemid?: Long
	badgeid?: number
}

export type CPlayer_SetFavoriteBadge_Response = {
}

export type CPlayer_GetProfileCustomization_Request = {
	steamid?: Long
	includeInactiveCustomizations?: boolean
	includePurchasedCustomizations?: boolean
}

export type ProfileCustomizationSlot = {
	slot?: number
	appid?: number
	publishedfileid?: Long
	itemAssetid?: Long
	itemContextid?: Long
	notes?: string
	title?: string
	accountid?: number
	badgeid?: number
	borderColor?: number
	itemClassid?: Long
	itemInstanceid?: Long
	banCheckResult?: .EBanContentCheckResult
	replayYear?: number
}

export type ProfileCustomization = {
	customizationType?: .EProfileCustomizationType
	large?: boolean
	slots?: .ProfileCustomizationSlot[]
	active?: boolean
	customizationStyle?: .EProfileCustomizationStyle
	purchaseid?: Long
	level?: number
}

export type ProfileTheme = {
	themeId?: string
	title?: string
}

export type ProfilePreferences = {
	hideProfileAwards?: boolean
}

export type CPlayer_GetProfileCustomization_Response = {
	customizations?: .ProfileCustomization[]
	slotsAvailable?: number
	profileTheme?: .ProfileTheme
	purchasedCustomizations?: .CPlayer_GetProfileCustomization_Response.PurchasedCustomization[]
	profilePreferences?: .ProfilePreferences
}

export type CPlayer_GetPurchasedProfileCustomizations_Request = {
	steamid?: Long
}

export type CPlayer_GetPurchasedProfileCustomizations_Response = {
	purchasedCustomizations?: .CPlayer_GetPurchasedProfileCustomizations_Response.PurchasedCustomization[]
}

export type CPlayer_GetPurchasedAndUpgradedProfileCustomizations_Request = {
	steamid?: Long
}

export type CPlayer_GetPurchasedAndUpgradedProfileCustomizations_Response = {
	purchasedCustomizations?: .CPlayer_GetPurchasedAndUpgradedProfileCustomizations_Response.PurchasedCustomization[]
	upgradedCustomizations?: .CPlayer_GetPurchasedAndUpgradedProfileCustomizations_Response.UpgradedCustomization[]
}

export type CPlayer_GetProfileThemesAvailable_Request = {
}

export type CPlayer_GetProfileThemesAvailable_Response = {
	profileThemes?: .ProfileTheme[]
}

export type CPlayer_SetProfileTheme_Request = {
	themeId?: string
}

export type CPlayer_SetProfileTheme_Response = {
}

export type CPlayer_SetProfilePreferences_Request = {
	profilePreferences?: .ProfilePreferences
}

export type CPlayer_SetProfilePreferences_Response = {
}

export type CPlayer_PostStatusToFriends_Request = {
	appid?: number
	statusText?: string
}

export type CPlayer_PostStatusToFriends_Response = {
}

export type CPlayer_GetPostedStatus_Request = {
	steamid?: Long
	postid?: Long
}

export type CPlayer_GetPostedStatus_Response = {
	accountid?: number
	postid?: Long
	statusText?: string
	deleted?: boolean
	appid?: number
}

export type CPlayer_DeletePostedStatus_Request = {
	postid?: Long
}

export type CPlayer_DeletePostedStatus_Response = {
}

export type CPlayer_GetLastPlayedTimes_Request = {
	minLastPlayed?: number
}

export type CPlayer_GetLastPlayedTimes_Response = {
	games?: .CPlayer_GetLastPlayedTimes_Response.Game[]
}

export type CPlayer_GetTimeSSAAccepted_Request = {
}

export type CPlayer_GetTimeSSAAccepted_Response = {
	timeSsaAccepted?: number
	timeSsaUpdated?: number
	timeChinassaAccepted?: number
}

export type CPlayer_AcceptSSA_Request = {
	agreementType?: .EAgreementType
	timeSignedUtc?: number
}

export type CPlayer_AcceptSSA_Response = {
}

export type CPlayer_GetNicknameList_Request = {
}

export type CPlayer_GetNicknameList_Response = {
	nicknames?: .CPlayer_GetNicknameList_Response.PlayerNickname[]
}

export type CPlayer_GetPerFriendPreferences_Request = {
}

export type PerFriendPreferences = {
	accountid?: number
	nickname?: string
	notificationsShowingame?: .ENotificationSetting
	notificationsShowonline?: .ENotificationSetting
	notificationsShowmessages?: .ENotificationSetting
	soundsShowingame?: .ENotificationSetting
	soundsShowonline?: .ENotificationSetting
	soundsShowmessages?: .ENotificationSetting
	notificationsSendmobile?: .ENotificationSetting
}

export type CPlayer_GetPerFriendPreferences_Response = {
	preferences?: .PerFriendPreferences[]
}

export type CPlayer_SetPerFriendPreferences_Request = {
	preferences?: .PerFriendPreferences
}

export type CPlayer_SetPerFriendPreferences_Response = {
}

export type CPlayer_AddFriend_Request = {
	steamid?: Long
}

export type CPlayer_AddFriend_Response = {
	inviteSent?: boolean
	friendRelationship?: number
	result?: number
}

export type CPlayer_RemoveFriend_Request = {
	steamid?: Long
}

export type CPlayer_RemoveFriend_Response = {
	friendRelationship?: number
}

export type CPlayer_IgnoreFriend_Request = {
	steamid?: Long
	unignore?: boolean
}

export type CPlayer_IgnoreFriend_Response = {
	friendRelationship?: number
}

export type CPlayer_GetCommunityPreferences_Request = {
}

export type CPlayer_CommunityPreferences = {
	parenthesizeNicknames?: boolean
	textFilterSetting?: .ETextFilterSetting
	textFilterIgnoreFriends?: boolean
	textFilterWordsRevision?: number
	timestampUpdated?: number
}

export type CPlayer_GetCommunityPreferences_Response = {
	preferences?: .CPlayer_CommunityPreferences
	contentDescriptorPreferences?: .UserContentDescriptorPreferences
}

export type CPlayer_SetCommunityPreferences_Request = {
	preferences?: .CPlayer_CommunityPreferences
}

export type CPlayer_SetCommunityPreferences_Response = {
}

export type CPlayer_GetTextFilterWords_Request = {
}

export type CPlayer_TextFilterWords = {
	textFilterCustomBannedWords?: string[]
	textFilterCustomCleanWords?: string[]
	textFilterWordsRevision?: number
}

export type CPlayer_GetTextFilterWords_Response = {
	words?: .CPlayer_TextFilterWords
}

export type CPlayer_GetNewSteamAnnouncementState_Request = {
	language?: number
}

export type CPlayer_GetNewSteamAnnouncementState_Response = {
	state?: .ENewSteamAnnouncementState
	announcementHeadline?: string
	announcementUrl?: string
	timePosted?: number
	announcementGid?: Long
}

export type CPlayer_UpdateSteamAnnouncementLastRead_Request = {
	announcementGid?: Long
	timePosted?: number
}

export type CPlayer_UpdateSteamAnnouncementLastRead_Response = {
}

export type CPlayer_GetPrivacySettings_Request = {
}

export type CPrivacySettings = {
	privacyState?: number
	privacyStateInventory?: number
	privacyStateGifts?: number
	privacyStateOwnedgames?: number
	privacyStatePlaytime?: number
	privacyStateFriendslist?: number
}

export type CPlayer_GetPrivacySettings_Response = {
	privacySettings?: .CPrivacySettings
}

export type CPlayer_GetDurationControl_Request = {
	appid?: number
}

export type CPlayer_GetDurationControl_Response = {
	isEnabled?: boolean
	seconds?: number
	secondsToday?: number
	isSteamchinaAccount?: boolean
	isAgeVerified?: boolean
	secondsAllowedToday?: number
	ageVerificationPending?: boolean
	blockMinors?: boolean
}

export type CPlayer_RecordDisconnectedPlaytime_Request = {
	playSessions?: .CPlayer_RecordDisconnectedPlaytime_Request.PlayHistory[]
}

export type CPlayer_RecordDisconnectedPlaytime_Response = {
}

export type CPlayer_LastPlayedTimes_Notification = {
	games?: .CPlayer_GetLastPlayedTimes_Response.Game[]
}

export type CPlayer_FriendNicknameChanged_Notification = {
	accountid?: number
	nickname?: string
	isEchoToSelf?: boolean
}

export type CPlayer_FriendEquippedProfileItemsChanged_Notification = {
	accountid?: number
}

export type CPlayer_NewSteamAnnouncementState_Notification = {
	state?: .ENewSteamAnnouncementState
	announcementHeadline?: string
	announcementUrl?: string
	timePosted?: number
	announcementGid?: Long
}

export type CPlayer_CommunityPreferencesChanged_Notification = {
	preferences?: .CPlayer_CommunityPreferences
	contentDescriptorPreferences?: .UserContentDescriptorPreferences
}

export type CPlayer_TextFilterWordsChanged_Notification = {
	words?: .CPlayer_TextFilterWords
}

export type CPlayer_PerFriendPreferencesChanged_Notification = {
	accountid?: number
	preferences?: .PerFriendPreferences
}

export type CPlayer_PrivacySettingsChanged_Notification = {
	privacySettings?: .CPrivacySettings
}

