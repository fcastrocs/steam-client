/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Tue Apr 15 2025 22:37:08 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";
import * as enums from "../../resources/language/steammessages_player.steamclient.js";

export type CPlayerGetRecentPlaytimeSessionsForChildRequest = {
	steamid?: Long
}

export type CPlayerGetRecentPlaytimeSessionsForChildResponse = {
	sessions?: {
		timeStart?: number
		timeEnd?: number
		appid?: number
		deviceType?: number
		disconnected?: boolean
	}[]
}

export type CPlayerGetPlayerLinkDetailsRequest = {
	steamids?: Long[]
}

export type CPlayerGetPlayerLinkDetailsResponse = {
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
			gameIsPrivate?: boolean
		}
	}[]
}

export type CPlayerGetMutualFriendsForIncomingInvitesRequest = {
}

export type CPlayerIncomingInviteMutualFriendList = {
	steamid?: Long
	mutualFriendAccountIds?: number[]
}

export type CPlayerGetMutualFriendsForIncomingInvitesResponse = {
	incomingInviteMutualFriendsLists?: {
		steamid?: Long
		mutualFriendAccountIds?: number[]
	}[]
}

export type CPlayerGetOwnedGamesRequest = {
	steamid?: Long
	includeAppinfo?: boolean
	includePlayedFreeGames?: boolean
	appidsFilter?: number[]
	includeFreeSub?: boolean
	skipUnvettedApps?: boolean
	language?: string
	includeExtendedAppinfo?: boolean
}

export type CPlayerGetOwnedGamesResponse = {
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
		playtimeDeckForever?: number
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

export type CPlayerGetPlayNextRequest = {
	maxAgeSeconds?: number
	ignoreAppids?: number[]
}

export type CPlayerGetPlayNextResponse = {
	lastUpdateTime?: number
	appids?: number[]
}

export type CPlayerGetFriendsGameplayInfoRequest = {
	appid?: number
}

export type CPlayerGetFriendsGameplayInfoResponse = {
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

export type CPlayerGetGameBadgeLevelsRequest = {
	appid?: number
}

export type CPlayerGetGameBadgeLevelsResponse = {
	playerLevel?: number
	badges?: {
		level?: number
		series?: number
		borderColor?: number
	}[]
}

export type CPlayerGetProfileBackgroundRequest = {
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
	tiled?: boolean
}

export type CPlayerGetProfileBackgroundResponse = {
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
		tiled?: boolean
	}
}

export type CPlayerSetProfileBackgroundRequest = {
	communityitemid?: Long
}

export type CPlayerSetProfileBackgroundResponse = {
}

export type CPlayerGetMiniProfileBackgroundRequest = {
	steamid?: Long
	language?: string
}

export type CPlayerGetMiniProfileBackgroundResponse = {
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
		tiled?: boolean
	}
}

export type CPlayerSetMiniProfileBackgroundRequest = {
	communityitemid?: Long
}

export type CPlayerSetMiniProfileBackgroundResponse = {
}

export type CPlayerGetAvatarFrameRequest = {
	steamid?: Long
	language?: string
}

export type CPlayerGetAvatarFrameResponse = {
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
		tiled?: boolean
	}
}

export type CPlayerSetAvatarFrameRequest = {
	communityitemid?: Long
}

export type CPlayerSetAvatarFrameResponse = {
}

export type CPlayerGetAnimatedAvatarRequest = {
	steamid?: Long
	language?: string
}

export type CPlayerGetAnimatedAvatarResponse = {
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
		tiled?: boolean
	}
}

export type CPlayerSetAnimatedAvatarRequest = {
	communityitemid?: Long
}

export type CPlayerSetAnimatedAvatarResponse = {
}

export type CPlayerGetSteamDeckKeyboardSkinRequest = {
	steamid?: Long
	language?: string
}

export type CPlayerGetSteamDeckKeyboardSkinResponse = {
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
		tiled?: boolean
	}
}

export type CPlayerSetSteamDeckKeyboardSkinRequest = {
	communityitemid?: Long
}

export type CPlayerSetSteamDeckKeyboardSkinResponse = {
}

export type CPlayerGetProfileItemsOwnedRequest = {
	language?: string
	filters?: typeof enums.ECommunityItemClass[keyof typeof enums.ECommunityItemClass][]
}

export type CPlayerGetProfileItemsOwnedResponse = {
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
	}[]
}

export type CPlayerGetProfileItemsEquippedRequest = {
	steamid?: Long
	language?: string
}

export type CPlayerGetProfileItemsEquippedResponse = {
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
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
		tiled?: boolean
	}
}

export type CPlayerSetEquippedProfileItemFlagsRequest = {
	communityitemid?: Long
	flags?: number
}

export type CPlayerSetEquippedProfileItemFlagsResponse = {
}

export type CPlayerGetEmoticonListRequest = {
}

export type CPlayerGetEmoticonListResponse = {
	emoticons?: {
		name?: string
		count?: number
		timeLastUsed?: number
		useCount?: number
		timeReceived?: number
		appid?: number
	}[]
}

export type CPlayerGetCommunityBadgeProgressRequest = {
	steamid?: Long
	badgeid?: number
}

export type CPlayerGetCommunityBadgeProgressResponse = {
	quests?: {
		questid?: number
		completed?: boolean
	}[]
}

export type CPlayerGetTopAchievementsForGamesRequest = {
	steamid?: Long
	language?: string
	maxAchievements?: number
	appids?: number[]
}

export type CPlayerGetTopAchievementsForGamesResponse = {
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

export type CPlayerGetAchievementsProgressRequest = {
	steamid?: Long
	language?: string
	appids?: number[]
	includeUnvettedApps?: boolean
}

export type CPlayerGetAchievementsProgressResponse = {
	achievementProgress?: {
		appid?: number
		unlocked?: number
		total?: number
		percentage?: number
		allUnlocked?: boolean
		cacheTime?: number
		vetted?: boolean
	}[]
}

export type CPlayerGetGameAchievementsRequest = {
	appid?: number
	language?: string
}

export type CPlayerGetGameAchievementsResponse = {
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

export type CPlayerGetFavoriteBadgeRequest = {
	steamid?: Long
}

export type CPlayerGetFavoriteBadgeResponse = {
	hasFavoriteBadge?: boolean
	badgeid?: number
	communityitemid?: Long
	itemType?: number
	borderColor?: number
	appid?: number
	level?: number
}

export type CPlayerSetFavoriteBadgeRequest = {
	communityitemid?: Long
	badgeid?: number
}

export type CPlayerSetFavoriteBadgeResponse = {
}

export type CPlayerGetProfileCustomizationRequest = {
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
	banCheckResult?: typeof enums.EBanContentCheckResult[keyof typeof enums.EBanContentCheckResult]
	replayYear?: number
}

export type ProfileCustomization = {
	customizationType?: typeof enums.EProfileCustomizationType[keyof typeof enums.EProfileCustomizationType]
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
		banCheckResult?: typeof enums.EBanContentCheckResult[keyof typeof enums.EBanContentCheckResult]
		replayYear?: number
	}[]
	active?: boolean
	customizationStyle?: typeof enums.EProfileCustomizationStyle[keyof typeof enums.EProfileCustomizationStyle]
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

export type CPlayerGetProfileCustomizationResponse = {
	customizations?: {
		customizationType?: typeof enums.EProfileCustomizationType[keyof typeof enums.EProfileCustomizationType]
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
			banCheckResult?: typeof enums.EBanContentCheckResult[keyof typeof enums.EBanContentCheckResult]
			replayYear?: number
		}[]
		active?: boolean
		customizationStyle?: typeof enums.EProfileCustomizationStyle[keyof typeof enums.EProfileCustomizationStyle]
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
		customizationType?: typeof enums.EProfileCustomizationType[keyof typeof enums.EProfileCustomizationType]
		level?: number
	}[]
	profilePreferences?: {
		hideProfileAwards?: boolean
	}
}

export type CPlayerGetPurchasedProfileCustomizationsRequest = {
	steamid?: Long
}

export type CPlayerGetPurchasedProfileCustomizationsResponse = {
	purchasedCustomizations?: {
		purchaseid?: Long
		customizationType?: typeof enums.EProfileCustomizationType[keyof typeof enums.EProfileCustomizationType]
	}[]
}

export type CPlayerGetPurchasedAndUpgradedProfileCustomizationsRequest = {
	steamid?: Long
}

export type CPlayerGetPurchasedAndUpgradedProfileCustomizationsResponse = {
	purchasedCustomizations?: {
		customizationType?: typeof enums.EProfileCustomizationType[keyof typeof enums.EProfileCustomizationType]
		count?: number
	}[]
	upgradedCustomizations?: {
		customizationType?: typeof enums.EProfileCustomizationType[keyof typeof enums.EProfileCustomizationType]
		level?: number
	}[]
}

export type CPlayerGetProfileThemesAvailableRequest = {
}

export type CPlayerGetProfileThemesAvailableResponse = {
	profileThemes?: {
		themeId?: string
		title?: string
	}[]
}

export type CPlayerSetProfileThemeRequest = {
	themeId?: string
}

export type CPlayerSetProfileThemeResponse = {
}

export type CPlayerSetProfilePreferencesRequest = {
	profilePreferences?: {
		hideProfileAwards?: boolean
	}
}

export type CPlayerSetProfilePreferencesResponse = {
}

export type CPlayerPostStatusToFriendsRequest = {
	appid?: number
	statusText?: string
}

export type CPlayerPostStatusToFriendsResponse = {
}

export type CPlayerGetPostedStatusRequest = {
	steamid?: Long
	postid?: Long
}

export type CPlayerGetPostedStatusResponse = {
	accountid?: number
	postid?: Long
	statusText?: string
	deleted?: boolean
	appid?: number
}

export type CPlayerDeletePostedStatusRequest = {
	postid?: Long
}

export type CPlayerDeletePostedStatusResponse = {
}

export type CPlayerGetLastPlayedTimesRequest = {
	minLastPlayed?: number
}

export type CPlayerGetLastPlayedTimesResponse = {
	games?: {
		appid?: number
		lastPlaytime?: number
		playtime_2weeks?: number
		playtimeForever?: number
		firstPlaytime?: number
		playtimeWindowsForever?: number
		playtimeMacForever?: number
		playtimeLinuxForever?: number
		playtimeDeckForever?: number
		firstWindowsPlaytime?: number
		firstMacPlaytime?: number
		firstLinuxPlaytime?: number
		firstDeckPlaytime?: number
		lastWindowsPlaytime?: number
		lastMacPlaytime?: number
		lastLinuxPlaytime?: number
		lastDeckPlaytime?: number
		playtimeDisconnected?: number
	}[]
}

export type CPlayerGetTimeSSAAcceptedRequest = {
}

export type CPlayerGetTimeSSAAcceptedResponse = {
	timeSsaAccepted?: number
	timeSsaUpdated?: number
	timeChinassaAccepted?: number
}

export type CPlayerAcceptSSARequest = {
	agreementType?: typeof enums.EAgreementType[keyof typeof enums.EAgreementType]
	timeSignedUtc?: number
}

export type CPlayerAcceptSSAResponse = {
}

export type CPlayerGetNicknameListRequest = {
}

export type CPlayerGetNicknameListResponse = {
	nicknames?: {
		accountid?: number
		nickname?: string
	}[]
}

export type CPlayerGetPerFriendPreferencesRequest = {
}

export type PerFriendPreferences = {
	accountid?: number
	nickname?: string
	notificationsShowingame?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	notificationsShowonline?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	notificationsShowmessages?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	soundsShowingame?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	soundsShowonline?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	soundsShowmessages?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	notificationsSendmobile?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
}

export type CPlayerGetPerFriendPreferencesResponse = {
	preferences?: {
		accountid?: number
		nickname?: string
		notificationsShowingame?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsShowonline?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsShowmessages?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowingame?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowonline?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowmessages?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsSendmobile?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	}[]
}

export type CPlayerSetPerFriendPreferencesRequest = {
	preferences?: {
		accountid?: number
		nickname?: string
		notificationsShowingame?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsShowonline?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsShowmessages?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowingame?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowonline?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowmessages?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsSendmobile?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	}
}

export type CPlayerSetPerFriendPreferencesResponse = {
}

export type CPlayerAddFriendRequest = {
	steamid?: Long
}

export type CPlayerAddFriendResponse = {
	inviteSent?: boolean
	friendRelationship?: number
	result?: number
}

export type CPlayerRemoveFriendRequest = {
	steamid?: Long
}

export type CPlayerRemoveFriendResponse = {
	friendRelationship?: number
}

export type CPlayerIgnoreFriendRequest = {
	steamid?: Long
	unignore?: boolean
}

export type CPlayerIgnoreFriendResponse = {
	friendRelationship?: number
}

export type CPlayerGetCommunityPreferencesRequest = {
}

export type CPlayerCommunityPreferences = {
	parenthesizeNicknames?: boolean
	textFilterSetting?: typeof enums.ETextFilterSetting[keyof typeof enums.ETextFilterSetting]
	textFilterIgnoreFriends?: boolean
	textFilterWordsRevision?: number
	timestampUpdated?: number
}

export type CPlayerGetCommunityPreferencesResponse = {
	preferences?: {
		parenthesizeNicknames?: boolean
		textFilterSetting?: typeof enums.ETextFilterSetting[keyof typeof enums.ETextFilterSetting]
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

export type CPlayerSetCommunityPreferencesRequest = {
	preferences?: {
		parenthesizeNicknames?: boolean
		textFilterSetting?: typeof enums.ETextFilterSetting[keyof typeof enums.ETextFilterSetting]
		textFilterIgnoreFriends?: boolean
		textFilterWordsRevision?: number
		timestampUpdated?: number
	}
}

export type CPlayerSetCommunityPreferencesResponse = {
}

export type CPlayerGetTextFilterWordsRequest = {
}

export type CPlayerTextFilterWords = {
	textFilterCustomBannedWords?: string[]
	textFilterCustomCleanWords?: string[]
	textFilterWordsRevision?: number
}

export type CPlayerGetTextFilterWordsResponse = {
	words?: {
		textFilterCustomBannedWords?: string[]
		textFilterCustomCleanWords?: string[]
		textFilterWordsRevision?: number
	}
}

export type CPlayerGetNewSteamAnnouncementStateRequest = {
	language?: number
}

export type CPlayerGetNewSteamAnnouncementStateResponse = {
	state?: typeof enums.ENewSteamAnnouncementState[keyof typeof enums.ENewSteamAnnouncementState]
	announcementHeadline?: string
	announcementUrl?: string
	timePosted?: number
	announcementGid?: Long
}

export type CPlayerUpdateSteamAnnouncementLastReadRequest = {
	announcementGid?: Long
	timePosted?: number
}

export type CPlayerUpdateSteamAnnouncementLastReadResponse = {
}

export type CPlayerGetPrivacySettingsRequest = {
}

export type CPrivacySettings = {
	privacyState?: number
	privacyStateInventory?: number
	privacyStateGifts?: number
	privacyStateOwnedgames?: number
	privacyStatePlaytime?: number
	privacyStateFriendslist?: number
}

export type CPlayerGetPrivacySettingsResponse = {
	privacySettings?: {
		privacyState?: number
		privacyStateInventory?: number
		privacyStateGifts?: number
		privacyStateOwnedgames?: number
		privacyStatePlaytime?: number
		privacyStateFriendslist?: number
	}
}

export type CPlayerGetDurationControlRequest = {
	appid?: number
}

export type CPlayerGetDurationControlResponse = {
	isEnabled?: boolean
	seconds?: number
	secondsToday?: number
	isSteamchinaAccount?: boolean
	isAgeVerified?: boolean
	secondsAllowedToday?: number
	ageVerificationPending?: boolean
	blockMinors?: boolean
}

export type CPlayerRecordDisconnectedPlaytimeRequest = {
	playSessions?: {
		appid?: number
		sessionTimeStart?: number
		seconds?: number
		offline?: boolean
		owner?: number
	}[]
}

export type CPlayerRecordDisconnectedPlaytimeResponse = {
}

export type CPlayerLastPlayedTimesNotification = {
	games?: {
		appid?: number
		lastPlaytime?: number
		playtime_2weeks?: number
		playtimeForever?: number
		firstPlaytime?: number
		playtimeWindowsForever?: number
		playtimeMacForever?: number
		playtimeLinuxForever?: number
		playtimeDeckForever?: number
		firstWindowsPlaytime?: number
		firstMacPlaytime?: number
		firstLinuxPlaytime?: number
		firstDeckPlaytime?: number
		lastWindowsPlaytime?: number
		lastMacPlaytime?: number
		lastLinuxPlaytime?: number
		lastDeckPlaytime?: number
		playtimeDisconnected?: number
	}[]
}

export type CPlayerFriendNicknameChangedNotification = {
	accountid?: number
	nickname?: string
	isEchoToSelf?: boolean
}

export type CPlayerFriendEquippedProfileItemsChangedNotification = {
	accountid?: number
}

export type CPlayerNewSteamAnnouncementStateNotification = {
	state?: typeof enums.ENewSteamAnnouncementState[keyof typeof enums.ENewSteamAnnouncementState]
	announcementHeadline?: string
	announcementUrl?: string
	timePosted?: number
	announcementGid?: Long
}

export type CPlayerCommunityPreferencesChangedNotification = {
	preferences?: {
		parenthesizeNicknames?: boolean
		textFilterSetting?: typeof enums.ETextFilterSetting[keyof typeof enums.ETextFilterSetting]
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

export type CPlayerTextFilterWordsChangedNotification = {
	words?: {
		textFilterCustomBannedWords?: string[]
		textFilterCustomCleanWords?: string[]
		textFilterWordsRevision?: number
	}
}

export type CPlayerPerFriendPreferencesChangedNotification = {
	accountid?: number
	preferences?: {
		accountid?: number
		nickname?: string
		notificationsShowingame?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsShowonline?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsShowmessages?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowingame?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowonline?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		soundsShowmessages?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
		notificationsSendmobile?: typeof enums.ENotificationSetting[keyof typeof enums.ENotificationSetting]
	}
}

export type CPlayerPrivacySettingsChangedNotification = {
	privacySettings?: {
		privacyState?: number
		privacyStateInventory?: number
		privacyStateGifts?: number
		privacyStateOwnedgames?: number
		privacyStatePlaytime?: number
		privacyStateFriendslist?: number
	}
}

