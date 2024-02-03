/**
 * Auto-generated file
 * Fri Feb 02 2024 20:32:00 GMT-0500 (Eastern Standard Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CPlayer_GetPlayerLinkDetails_Request = {
	steamids?: Long[]
}

export type CPlayer_GetPlayerLinkDetails_Response = {
	accounts?: {
		publicData?: {
			steamid?: Long[]
			visibilityState?: number
			privacyState?: number
			profileState?: number
			banExpiresTime?: number
			accountFlags?: number
			shaDigestAvatar?: Buffer
			personaName?: string
			profileUrl?: string
			contentCountryRestricted?: boolean
		}
		privateData?: {
			personaState?: number
			personaStateFlags?: number
			timeCreated?: number
			gameId?: Long
			gameServerSteamId?: Long
			gameServerIpAddress?: number
			gameServerPort?: number
			gameExtraInfo?: string
			accountName?: string
			lobbySteamId?: Long
			richPresenceKv?: string
			broadcastSessionId?: Long
			watchingBroadcastAccountid?: number
			watchingBroadcastAppid?: number
			watchingBroadcastViewers?: number
			watchingBroadcastTitle?: string
			lastLogoffTime?: number
			lastSeenOnline?: number
			gameOsType?: number
			gameDeviceType?: number
			gameDeviceName?: string
		}
	}[]
}

export type CPlayer_GetMutualFriendsForIncomingInvites_Request = {
}

export type CPlayer_IncomingInviteMutualFriendList = {
	steamid?: Long
	mutualFriendAccountIds?: number[]
}

export type CPlayer_GetMutualFriendsForIncomingInvites_Response = {
	incomingInviteMutualFriendsLists?: {
		steamid?: Long
		mutualFriendAccountIds?: number[]
	}[]
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
	games?: {
		appid?: number
		name?: string
		playtime_2weeks?: number
		playtimeForever?: number
		imgIconUrl?: string
		hasCommunityVisibleStats?: boolean
		playtimeWindowsForever?: number
		playtimeMacForever?: number
		playtimeLinuxForever?: number
		rtimeLastPlayed?: number
		capsuleFilename?: string
		sortAs?: string
		hasWorkshop?: boolean
		hasMarket?: boolean
		hasDlc?: boolean
		hasLeaderboards?: boolean
		contentDescriptorids?: number[]
		playtimeDisconnected?: number
	}[]
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
	yourInfo?: {
		steamid?: Long
		minutesPlayed?: number
		minutesPlayedForever?: number
		inWishlist?: boolean
		owned?: boolean
	}
	inGame?: {
		steamid?: Long
		minutesPlayed?: number
		minutesPlayedForever?: number
	}[]
	playedRecently?: {
		steamid?: Long
		minutesPlayed?: number
		minutesPlayedForever?: number
	}[]
	playedEver?: {
		steamid?: Long
		minutesPlayed?: number
		minutesPlayedForever?: number
	}[]
	owns?: {
		steamid?: Long
		minutesPlayed?: number
		minutesPlayedForever?: number
	}[]
	inWishlist?: {
		steamid?: Long
		minutesPlayed?: number
		minutesPlayedForever?: number
	}[]
}

export type CPlayer_GetGameBadgeLevels_Request = {
	appid?: number
}

export type CPlayer_GetGameBadgeLevels_Response = {
	playerLevel?: number
	badges?: {
		level?: number
		series?: number
		borderColor?: number
	}[]
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
	profileColors?: {
		styleName?: string
		color?: string
	}[]
}

export type CPlayer_GetProfileBackground_Response = {
	profileBackground?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
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
	profileBackground?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
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
	avatarFrame?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
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
	avatar?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
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
	steamDeckKeyboardSkin?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
}

export type CPlayer_SetSteamDeckKeyboardSkin_Request = {
	communityitemid?: Long
}

export type CPlayer_SetSteamDeckKeyboardSkin_Response = {
}

export type CPlayer_GetProfileItemsOwned_Request = {
	language?: string
	filters?: typeof ECommunityItemClass[keyof typeof ECommunityItemClass][]
}

export type CPlayer_GetProfileItemsOwned_Response = {
	profileBackgrounds?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}[]
	miniProfileBackgrounds?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}[]
	avatarFrames?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}[]
	animatedAvatars?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}[]
	profileModifiers?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}[]
	steamDeckKeyboardSkins?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}[]
	steamDeckStartupMovies?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}[]
}

export type CPlayer_GetProfileItemsEquipped_Request = {
	steamid?: Long
	language?: string
}

export type CPlayer_GetProfileItemsEquipped_Response = {
	profileBackground?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
	miniProfileBackground?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
	avatarFrame?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
	animatedAvatar?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
	profileModifier?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
	steamDeckKeyboardSkin?: {
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
		profileColors?: {
			styleName?: string
			color?: string
		}[]
	}
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
	emoticons?: {
		name?: string
		count?: number
		timeLastUsed?: number
		useCount?: number
		timeReceived?: number
		appid?: number
	}[]
}

export type CPlayer_GetCommunityBadgeProgress_Request = {
	steamid?: Long
	badgeid?: number
}

export type CPlayer_GetCommunityBadgeProgress_Response = {
	quests?: {
		questid?: number
		completed?: boolean
	}[]
}

export type CPlayer_GetTopAchievementsForGames_Request = {
	steamid?: Long
	language?: string
	maxAchievements?: number
	appids?: number[]
}

export type CPlayer_GetTopAchievementsForGames_Response = {
	games?: {
		appid?: number
		totalAchievements?: number
		achievements?: {
			statid?: number
			bit?: number
			name?: string
			desc?: string
			icon?: string
			iconGray?: string
			hidden?: boolean
			playerPercentUnlocked?: string
		}[]
	}[]
}

export type CPlayer_GetAchievementsProgress_Request = {
	steamid?: Long
	language?: string
	appids?: number[]
}

export type CPlayer_GetAchievementsProgress_Response = {
	achievementProgress?: {
		appid?: number
		unlocked?: number
		total?: number
		percentage?: number
		allUnlocked?: boolean
		cacheTime?: number
	}[]
}

export type CPlayer_GetGameAchievements_Request = {
	appid?: number
	language?: string
}

export type CPlayer_GetGameAchievements_Response = {
	achievements?: {
		internalName?: string
		localizedName?: string
		localizedDesc?: string
		icon?: string
		iconGray?: string
		hidden?: boolean
		playerPercentUnlocked?: string
	}[]
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
	banCheckResult?: typeof EBanContentCheckResult[keyof typeof EBanContentCheckResult]
	replayYear?: number
}

export type ProfileCustomization = {
	customizationType?: typeof EProfileCustomizationType[keyof typeof EProfileCustomizationType]
	large?: boolean
	slots?: {
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
		banCheckResult?: typeof EBanContentCheckResult[keyof typeof EBanContentCheckResult]
		replayYear?: number
	}[]
	active?: boolean
	customizationStyle?: typeof EProfileCustomizationStyle[keyof typeof EProfileCustomizationStyle]
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
	customizations?: {
		customizationType?: typeof EProfileCustomizationType[keyof typeof EProfileCustomizationType]
		large?: boolean
		slots?: {
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
			banCheckResult?: typeof EBanContentCheckResult[keyof typeof EBanContentCheckResult]
			replayYear?: number
		}[]
		active?: boolean
		customizationStyle?: typeof EProfileCustomizationStyle[keyof typeof EProfileCustomizationStyle]
		purchaseid?: Long
		level?: number
	}[]
	slotsAvailable?: number
	profileTheme?: {
		themeId?: string
		title?: string
	}
	purchasedCustomizations?: {
		purchaseid?: Long
		customizationType?: typeof EProfileCustomizationType[keyof typeof EProfileCustomizationType]
		level?: number
	}[]
	profilePreferences?: {
		hideProfileAwards?: boolean
	}
}

export type CPlayer_GetPurchasedProfileCustomizations_Request = {
	steamid?: Long
}

export type CPlayer_GetPurchasedProfileCustomizations_Response = {
	purchasedCustomizations?: {
		purchaseid?: Long
		customizationType?: typeof EProfileCustomizationType[keyof typeof EProfileCustomizationType]
	}[]
}

export type CPlayer_GetPurchasedAndUpgradedProfileCustomizations_Request = {
	steamid?: Long
}

export type CPlayer_GetPurchasedAndUpgradedProfileCustomizations_Response = {
	purchasedCustomizations?: {
		customizationType?: typeof EProfileCustomizationType[keyof typeof EProfileCustomizationType]
		count?: number
	}[]
	upgradedCustomizations?: {
		customizationType?: typeof EProfileCustomizationType[keyof typeof EProfileCustomizationType]
		level?: number
	}[]
}

export type CPlayer_GetProfileThemesAvailable_Request = {
}

export type CPlayer_GetProfileThemesAvailable_Response = {
	profileThemes?: {
		themeId?: string
		title?: string
	}[]
}

export type CPlayer_SetProfileTheme_Request = {
	themeId?: string
}

export type CPlayer_SetProfileTheme_Response = {
}

export type CPlayer_SetProfilePreferences_Request = {
	profilePreferences?: {
		hideProfileAwards?: boolean
	}
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
	games?: {
		appid?: number
		lastPlaytime?: number
		playtime_2weeks?: number
		playtimeForever?: number
		firstPlaytime?: number
		playtimeWindowsForever?: number
		playtimeMacForever?: number
		playtimeLinuxForever?: number
		firstWindowsPlaytime?: number
		firstMacPlaytime?: number
		firstLinuxPlaytime?: number
		lastWindowsPlaytime?: number
		lastMacPlaytime?: number
		lastLinuxPlaytime?: number
		playtimeDisconnected?: number
	}[]
}

export type CPlayer_GetTimeSSAAccepted_Request = {
}

export type CPlayer_GetTimeSSAAccepted_Response = {
	timeSsaAccepted?: number
	timeSsaUpdated?: number
	timeChinassaAccepted?: number
}

export type CPlayer_AcceptSSA_Request = {
	agreementType?: typeof EAgreementType[keyof typeof EAgreementType]
	timeSignedUtc?: number
}

export type CPlayer_AcceptSSA_Response = {
}

export type CPlayer_GetNicknameList_Request = {
}

export type CPlayer_GetNicknameList_Response = {
	nicknames?: {
		accountid?: number
		nickname?: string
	}[]
}

export type CPlayer_GetPerFriendPreferences_Request = {
}

export type PerFriendPreferences = {
	accountid?: number
	nickname?: string
	notificationsShowingame?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	notificationsShowonline?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	notificationsShowmessages?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	soundsShowingame?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	soundsShowonline?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	soundsShowmessages?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	notificationsSendmobile?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
}

export type CPlayer_GetPerFriendPreferences_Response = {
	preferences?: {
		accountid?: number
		nickname?: string
		notificationsShowingame?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsShowonline?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsShowmessages?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowingame?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowonline?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowmessages?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsSendmobile?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	}[]
}

export type CPlayer_SetPerFriendPreferences_Request = {
	preferences?: {
		accountid?: number
		nickname?: string
		notificationsShowingame?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsShowonline?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsShowmessages?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowingame?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowonline?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowmessages?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsSendmobile?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	}
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
	textFilterSetting?: typeof ETextFilterSetting[keyof typeof ETextFilterSetting]
	textFilterIgnoreFriends?: boolean
	textFilterWordsRevision?: number
	timestampUpdated?: number
}

export type CPlayer_GetCommunityPreferences_Response = {
	preferences?: {
		parenthesizeNicknames?: boolean
		textFilterSetting?: typeof ETextFilterSetting[keyof typeof ETextFilterSetting]
		textFilterIgnoreFriends?: boolean
		textFilterWordsRevision?: number
		timestampUpdated?: number
	}
	contentDescriptorPreferences?: {
		contentDescriptorsToExclude?: {
			contentDescriptorid?: number
			timestampAdded?: number
		}[]
	}
}

export type CPlayer_SetCommunityPreferences_Request = {
	preferences?: {
		parenthesizeNicknames?: boolean
		textFilterSetting?: typeof ETextFilterSetting[keyof typeof ETextFilterSetting]
		textFilterIgnoreFriends?: boolean
		textFilterWordsRevision?: number
		timestampUpdated?: number
	}
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
	words?: {
		textFilterCustomBannedWords?: string[]
		textFilterCustomCleanWords?: string[]
		textFilterWordsRevision?: number
	}
}

export type CPlayer_GetNewSteamAnnouncementState_Request = {
	language?: number
}

export type CPlayer_GetNewSteamAnnouncementState_Response = {
	state?: typeof ENewSteamAnnouncementState[keyof typeof ENewSteamAnnouncementState]
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
	privacySettings?: {
		privacyState?: number
		privacyStateInventory?: number
		privacyStateGifts?: number
		privacyStateOwnedgames?: number
		privacyStatePlaytime?: number
		privacyStateFriendslist?: number
	}
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
	playSessions?: {
		appid?: number
		sessionTimeStart?: number
		seconds?: number
		offline?: boolean
		owner?: number
	}[]
}

export type CPlayer_RecordDisconnectedPlaytime_Response = {
}

export type CPlayer_LastPlayedTimes_Notification = {
	games?: {
		appid?: number
		lastPlaytime?: number
		playtime_2weeks?: number
		playtimeForever?: number
		firstPlaytime?: number
		playtimeWindowsForever?: number
		playtimeMacForever?: number
		playtimeLinuxForever?: number
		firstWindowsPlaytime?: number
		firstMacPlaytime?: number
		firstLinuxPlaytime?: number
		lastWindowsPlaytime?: number
		lastMacPlaytime?: number
		lastLinuxPlaytime?: number
		playtimeDisconnected?: number
	}[]
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
	state?: typeof ENewSteamAnnouncementState[keyof typeof ENewSteamAnnouncementState]
	announcementHeadline?: string
	announcementUrl?: string
	timePosted?: number
	announcementGid?: Long
}

export type CPlayer_CommunityPreferencesChanged_Notification = {
	preferences?: {
		parenthesizeNicknames?: boolean
		textFilterSetting?: typeof ETextFilterSetting[keyof typeof ETextFilterSetting]
		textFilterIgnoreFriends?: boolean
		textFilterWordsRevision?: number
		timestampUpdated?: number
	}
	contentDescriptorPreferences?: {
		contentDescriptorsToExclude?: {
			contentDescriptorid?: number
			timestampAdded?: number
		}[]
	}
}

export type CPlayer_TextFilterWordsChanged_Notification = {
	words?: {
		textFilterCustomBannedWords?: string[]
		textFilterCustomCleanWords?: string[]
		textFilterWordsRevision?: number
	}
}

export type CPlayer_PerFriendPreferencesChanged_Notification = {
	accountid?: number
	preferences?: {
		accountid?: number
		nickname?: string
		notificationsShowingame?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsShowonline?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsShowmessages?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowingame?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowonline?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		soundsShowmessages?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
		notificationsSendmobile?: typeof ENotificationSetting[keyof typeof ENotificationSetting]
	}
}

export type CPlayer_PrivacySettingsChanged_Notification = {
	privacySettings?: {
		privacyState?: number
		privacyStateInventory?: number
		privacyStateGifts?: number
		privacyStateOwnedgames?: number
		privacyStatePlaytime?: number
		privacyStateFriendslist?: number
	}
}

