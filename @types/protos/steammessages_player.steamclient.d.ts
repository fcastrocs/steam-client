/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CPlayer_GetMutualFriendsForIncomingInvites_Request = {
}

type CPlayer_IncomingInviteMutualFriendList = {
	steamid?: Long;
	mutualFriendAccountIds?: number[];
}

type CPlayer_GetMutualFriendsForIncomingInvites_Response = {
	incomingInviteMutualFriendsLists?: {
		steamid?: Long;
		mutualFriendAccountIds?: number[];
	}[];
}

type CPlayer_GetOwnedGames_Request = {
	steamid?: Long;
	includeAppinfo?: boolean;
	includePlayedFreeGames?: boolean;
	appidsFilter?: number[];
	includeFreeSub?: boolean;
	skipUnvettedApps?: boolean;
	language?: string;
	includeExtendedAppinfo?: boolean;
}

type CPlayer_GetOwnedGames_Response = {
	gameCount?: number;
	games?: {
		appid?: number;
		name?: string;
		playtime_2weeks?: number;
		playtimeForever?: number;
		imgIconUrl?: string;
		hasCommunityVisibleStats?: boolean;
		playtimeWindowsForever?: number;
		playtimeMacForever?: number;
		playtimeLinuxForever?: number;
		rtimeLastPlayed?: number;
		capsuleFilename?: string;
		sortAs?: string;
		hasWorkshop?: boolean;
		hasMarket?: boolean;
		hasDlc?: boolean;
		hasLeaderboards?: boolean;
		contentDescriptorids?: number[];
		playtimeDisconnected?: number;
	}[];
}

type CPlayer_GetPlayNext_Request = {
	maxAgeSeconds?: number;
	ignoreAppids?: number[];
}

type CPlayer_GetPlayNext_Response = {
	lastUpdateTime?: number;
	appids?: number[];
}

type CPlayer_GetFriendsGameplayInfo_Request = {
	appid?: number;
}

type CPlayer_GetFriendsGameplayInfo_Response = {
	yourInfo?: {
		steamid?: Long;
		minutesPlayed?: number;
		minutesPlayedForever?: number;
		inWishlist?: boolean;
		owned?: boolean;
	};
	inGame?: {
		steamid?: Long;
		minutesPlayed?: number;
		minutesPlayedForever?: number;
	}[];
	playedRecently?: {
		steamid?: Long;
		minutesPlayed?: number;
		minutesPlayedForever?: number;
	}[];
	playedEver?: {
		steamid?: Long;
		minutesPlayed?: number;
		minutesPlayedForever?: number;
	}[];
	owns?: {
		steamid?: Long;
		minutesPlayed?: number;
		minutesPlayedForever?: number;
	}[];
	inWishlist?: {
		steamid?: Long;
		minutesPlayed?: number;
		minutesPlayedForever?: number;
	}[];
}

type CPlayer_GetGameBadgeLevels_Request = {
	appid?: number;
}

type CPlayer_GetGameBadgeLevels_Response = {
	playerLevel?: number;
	badges?: {
		level?: number;
		series?: number;
		borderColor?: number;
	}[];
}

type CPlayer_GetProfileBackground_Request = {
	steamid?: Long;
	language?: string;
}

type ProfileItem = {
	communityitemid?: Long;
	imageSmall?: string;
	imageLarge?: string;
	name?: string;
	itemTitle?: string;
	itemDescription?: string;
	appid?: number;
	itemType?: number;
	itemClass?: number;
	movieWebm?: string;
	movieMp4?: string;
	movieWebmSmall?: string;
	movieMp4Small?: string;
	equippedFlags?: number;
	profileColors?: {
		styleName?: string;
		color?: string;
	}[];
}

type CPlayer_GetProfileBackground_Response = {
	profileBackground?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
}

type CPlayer_SetProfileBackground_Request = {
	communityitemid?: Long;
}

type CPlayer_SetProfileBackground_Response = {
}

type CPlayer_GetMiniProfileBackground_Request = {
	steamid?: Long;
	language?: string;
}

type CPlayer_GetMiniProfileBackground_Response = {
	profileBackground?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
}

type CPlayer_SetMiniProfileBackground_Request = {
	communityitemid?: Long;
}

type CPlayer_SetMiniProfileBackground_Response = {
}

type CPlayer_GetAvatarFrame_Request = {
	steamid?: Long;
	language?: string;
}

type CPlayer_GetAvatarFrame_Response = {
	avatarFrame?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
}

type CPlayer_SetAvatarFrame_Request = {
	communityitemid?: Long;
}

type CPlayer_SetAvatarFrame_Response = {
}

type CPlayer_GetAnimatedAvatar_Request = {
	steamid?: Long;
	language?: string;
}

type CPlayer_GetAnimatedAvatar_Response = {
	avatar?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
}

type CPlayer_SetAnimatedAvatar_Request = {
	communityitemid?: Long;
}

type CPlayer_SetAnimatedAvatar_Response = {
}

type CPlayer_GetSteamDeckKeyboardSkin_Request = {
	steamid?: Long;
	language?: string;
}

type CPlayer_GetSteamDeckKeyboardSkin_Response = {
	steamDeckKeyboardSkin?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
}

type CPlayer_SetSteamDeckKeyboardSkin_Request = {
	communityitemid?: Long;
}

type CPlayer_SetSteamDeckKeyboardSkin_Response = {
}

type CPlayer_GetProfileItemsOwned_Request = {
	language?: string;
	filters?: ValueOf<typeof ECommunityItemClass>[];
}

type CPlayer_GetProfileItemsOwned_Response = {
	profileBackgrounds?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	}[];
	miniProfileBackgrounds?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	}[];
	avatarFrames?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	}[];
	animatedAvatars?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	}[];
	profileModifiers?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	}[];
	steamDeckKeyboardSkins?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	}[];
	steamDeckStartupMovies?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	}[];
}

type CPlayer_GetProfileItemsEquipped_Request = {
	steamid?: Long;
	language?: string;
}

type CPlayer_GetProfileItemsEquipped_Response = {
	profileBackground?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
	miniProfileBackground?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
	avatarFrame?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
	animatedAvatar?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
	profileModifier?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
	steamDeckKeyboardSkin?: {
		communityitemid?: Long;
		imageSmall?: string;
		imageLarge?: string;
		name?: string;
		itemTitle?: string;
		itemDescription?: string;
		appid?: number;
		itemType?: number;
		itemClass?: number;
		movieWebm?: string;
		movieMp4?: string;
		movieWebmSmall?: string;
		movieMp4Small?: string;
		equippedFlags?: number;
		profileColors?: {
			styleName?: string;
			color?: string;
		}[];
	};
}

type CPlayer_SetEquippedProfileItemFlags_Request = {
	communityitemid?: Long;
	flags?: number;
}

type CPlayer_SetEquippedProfileItemFlags_Response = {
}

type CPlayer_GetEmoticonList_Request = {
}

type CPlayer_GetEmoticonList_Response = {
	emoticons?: {
		name?: string;
		count?: number;
		timeLastUsed?: number;
		useCount?: number;
		timeReceived?: number;
		appid?: number;
	}[];
}

type CPlayer_GetTopAchievementsForGames_Request = {
	steamid?: Long;
	language?: string;
	maxAchievements?: number;
	appids?: number[];
}

type CPlayer_GetTopAchievementsForGames_Response = {
	games?: {
		appid?: number;
		totalAchievements?: number;
		achievements?: {
			statid?: number;
			bit?: number;
			name?: string;
			desc?: string;
			icon?: string;
			iconGray?: string;
			hidden?: boolean;
			playerPercentUnlocked?: string;
		}[];
	}[];
}

type CPlayer_GetAchievementsProgress_Request = {
	steamid?: Long;
	language?: string;
	appids?: number[];
}

type CPlayer_GetAchievementsProgress_Response = {
	achievementProgress?: {
		appid?: number;
		unlocked?: number;
		total?: number;
		percentage?: number;
		allUnlocked?: boolean;
		cacheTime?: number;
	}[];
}

type CPlayer_GetGameAchievements_Request = {
	appid?: number;
	language?: string;
}

type CPlayer_GetGameAchievements_Response = {
	achievements?: {
		internalName?: string;
		localizedName?: string;
		localizedDesc?: string;
		icon?: string;
		iconGray?: string;
		hidden?: boolean;
		playerPercentUnlocked?: string;
	}[];
}

type CPlayer_GetFavoriteBadge_Request = {
	steamid?: Long;
}

type CPlayer_GetFavoriteBadge_Response = {
	hasFavoriteBadge?: boolean;
	badgeid?: number;
	communityitemid?: Long;
	itemType?: number;
	borderColor?: number;
	appid?: number;
	level?: number;
}

type CPlayer_SetFavoriteBadge_Request = {
	communityitemid?: Long;
	badgeid?: number;
}

type CPlayer_SetFavoriteBadge_Response = {
}

type CPlayer_GetProfileCustomization_Request = {
	steamid?: Long;
	includeInactiveCustomizations?: boolean;
	includePurchasedCustomizations?: boolean;
}

type ProfileCustomizationSlot = {
	slot?: number;
	appid?: number;
	publishedfileid?: Long;
	itemAssetid?: Long;
	itemContextid?: Long;
	notes?: string;
	title?: string;
	accountid?: number;
	badgeid?: number;
	borderColor?: number;
	itemClassid?: Long;
	itemInstanceid?: Long;
	banCheckResult?: ValueOf<typeof EBanContentCheckResult>;
	replayYear?: number;
}

type ProfileCustomization = {
	customizationType?: ValueOf<typeof EProfileCustomizationType>;
	large?: boolean;
	slots?: {
		slot?: number;
		appid?: number;
		publishedfileid?: Long;
		itemAssetid?: Long;
		itemContextid?: Long;
		notes?: string;
		title?: string;
		accountid?: number;
		badgeid?: number;
		borderColor?: number;
		itemClassid?: Long;
		itemInstanceid?: Long;
		banCheckResult?: ValueOf<typeof EBanContentCheckResult>;
		replayYear?: number;
	}[];
	active?: boolean;
	customizationStyle?: ValueOf<typeof EProfileCustomizationStyle>;
	purchaseid?: Long;
	level?: number;
}

type ProfileTheme = {
	themeId?: string;
	title?: string;
}

type ProfilePreferences = {
	hideProfileAwards?: boolean;
}

type CPlayer_GetProfileCustomization_Response = {
	customizations?: {
		customizationType?: ValueOf<typeof EProfileCustomizationType>;
		large?: boolean;
		slots?: {
			slot?: number;
			appid?: number;
			publishedfileid?: Long;
			itemAssetid?: Long;
			itemContextid?: Long;
			notes?: string;
			title?: string;
			accountid?: number;
			badgeid?: number;
			borderColor?: number;
			itemClassid?: Long;
			itemInstanceid?: Long;
			banCheckResult?: ValueOf<typeof EBanContentCheckResult>;
			replayYear?: number;
		}[];
		active?: boolean;
		customizationStyle?: ValueOf<typeof EProfileCustomizationStyle>;
		purchaseid?: Long;
		level?: number;
	}[];
	slotsAvailable?: number;
	profileTheme?: {
		themeId?: string;
		title?: string;
	};
	purchasedCustomizations?: {
		purchaseid?: Long;
		customizationType?: ValueOf<typeof EProfileCustomizationType>;
		level?: number;
	}[];
	profilePreferences?: {
		hideProfileAwards?: boolean;
	};
}

type CPlayer_GetPurchasedProfileCustomizations_Request = {
	steamid?: Long;
}

type CPlayer_GetPurchasedProfileCustomizations_Response = {
	purchasedCustomizations?: {
		purchaseid?: Long;
		customizationType?: ValueOf<typeof EProfileCustomizationType>;
	}[];
}

type CPlayer_GetPurchasedAndUpgradedProfileCustomizations_Request = {
	steamid?: Long;
}

type CPlayer_GetPurchasedAndUpgradedProfileCustomizations_Response = {
	purchasedCustomizations?: {
		customizationType?: ValueOf<typeof EProfileCustomizationType>;
		count?: number;
	}[];
	upgradedCustomizations?: {
		customizationType?: ValueOf<typeof EProfileCustomizationType>;
		level?: number;
	}[];
}

type CPlayer_GetProfileThemesAvailable_Request = {
}

type CPlayer_GetProfileThemesAvailable_Response = {
	profileThemes?: {
		themeId?: string;
		title?: string;
	}[];
}

type CPlayer_SetProfileTheme_Request = {
	themeId?: string;
}

type CPlayer_SetProfileTheme_Response = {
}

type CPlayer_SetProfilePreferences_Request = {
	profilePreferences?: {
		hideProfileAwards?: boolean;
	};
}

type CPlayer_SetProfilePreferences_Response = {
}

type CPlayer_PostStatusToFriends_Request = {
	appid?: number;
	statusText?: string;
}

type CPlayer_PostStatusToFriends_Response = {
}

type CPlayer_GetPostedStatus_Request = {
	steamid?: Long;
	postid?: Long;
}

type CPlayer_GetPostedStatus_Response = {
	accountid?: number;
	postid?: Long;
	statusText?: string;
	deleted?: boolean;
	appid?: number;
}

type CPlayer_DeletePostedStatus_Request = {
	postid?: Long;
}

type CPlayer_DeletePostedStatus_Response = {
}

type CPlayer_GetLastPlayedTimes_Request = {
	minLastPlayed?: number;
}

type CPlayer_GetLastPlayedTimes_Response = {
	games?: {
		appid?: number;
		lastPlaytime?: number;
		playtime_2weeks?: number;
		playtimeForever?: number;
		firstPlaytime?: number;
		playtimeWindowsForever?: number;
		playtimeMacForever?: number;
		playtimeLinuxForever?: number;
		firstWindowsPlaytime?: number;
		firstMacPlaytime?: number;
		firstLinuxPlaytime?: number;
		lastWindowsPlaytime?: number;
		lastMacPlaytime?: number;
		lastLinuxPlaytime?: number;
		playtimeDisconnected?: number;
	}[];
}

type CPlayer_GetTimeSSAAccepted_Request = {
}

type CPlayer_GetTimeSSAAccepted_Response = {
	timeSsaAccepted?: number;
	timeSsaUpdated?: number;
	timeChinassaAccepted?: number;
}

type CPlayer_AcceptSSA_Request = {
	agreementType?: ValueOf<typeof EAgreementType>;
	timeSignedUtc?: number;
}

type CPlayer_AcceptSSA_Response = {
}

type CPlayer_GetNicknameList_Request = {
}

type CPlayer_GetNicknameList_Response = {
	nicknames?: {
		accountid?: number;
		nickname?: string;
	}[];
}

type CPlayer_GetPerFriendPreferences_Request = {
}

type PerFriendPreferences = {
	accountid?: number;
	nickname?: string;
	notificationsShowingame?: ValueOf<typeof ENotificationSetting>;
	notificationsShowonline?: ValueOf<typeof ENotificationSetting>;
	notificationsShowmessages?: ValueOf<typeof ENotificationSetting>;
	soundsShowingame?: ValueOf<typeof ENotificationSetting>;
	soundsShowonline?: ValueOf<typeof ENotificationSetting>;
	soundsShowmessages?: ValueOf<typeof ENotificationSetting>;
	notificationsSendmobile?: ValueOf<typeof ENotificationSetting>;
}

type CPlayer_GetPerFriendPreferences_Response = {
	preferences?: {
		accountid?: number;
		nickname?: string;
		notificationsShowingame?: ValueOf<typeof ENotificationSetting>;
		notificationsShowonline?: ValueOf<typeof ENotificationSetting>;
		notificationsShowmessages?: ValueOf<typeof ENotificationSetting>;
		soundsShowingame?: ValueOf<typeof ENotificationSetting>;
		soundsShowonline?: ValueOf<typeof ENotificationSetting>;
		soundsShowmessages?: ValueOf<typeof ENotificationSetting>;
		notificationsSendmobile?: ValueOf<typeof ENotificationSetting>;
	}[];
}

type CPlayer_SetPerFriendPreferences_Request = {
	preferences?: {
		accountid?: number;
		nickname?: string;
		notificationsShowingame?: ValueOf<typeof ENotificationSetting>;
		notificationsShowonline?: ValueOf<typeof ENotificationSetting>;
		notificationsShowmessages?: ValueOf<typeof ENotificationSetting>;
		soundsShowingame?: ValueOf<typeof ENotificationSetting>;
		soundsShowonline?: ValueOf<typeof ENotificationSetting>;
		soundsShowmessages?: ValueOf<typeof ENotificationSetting>;
		notificationsSendmobile?: ValueOf<typeof ENotificationSetting>;
	};
}

type CPlayer_SetPerFriendPreferences_Response = {
}

type CPlayer_AddFriend_Request = {
	steamid?: Long;
}

type CPlayer_AddFriend_Response = {
	inviteSent?: boolean;
	friendRelationship?: number;
	result?: number;
}

type CPlayer_RemoveFriend_Request = {
	steamid?: Long;
}

type CPlayer_RemoveFriend_Response = {
	friendRelationship?: number;
}

type CPlayer_IgnoreFriend_Request = {
	steamid?: Long;
	unignore?: boolean;
}

type CPlayer_IgnoreFriend_Response = {
	friendRelationship?: number;
}

type CPlayer_GetCommunityPreferences_Request = {
}

type CPlayer_CommunityPreferences = {
	parenthesizeNicknames?: boolean;
	textFilterSetting?: ValueOf<typeof ETextFilterSetting>;
	textFilterIgnoreFriends?: boolean;
	textFilterWordsRevision?: number;
	timestampUpdated?: number;
}

type CPlayer_GetCommunityPreferences_Response = {
	preferences?: {
		parenthesizeNicknames?: boolean;
		textFilterSetting?: ValueOf<typeof ETextFilterSetting>;
		textFilterIgnoreFriends?: boolean;
		textFilterWordsRevision?: number;
		timestampUpdated?: number;
	};
	contentDescriptorPreferences?: {
		contentDescriptorsToExclude?: {
			contentDescriptorid?: number;
			timestampAdded?: number;
		}[];
	};
}

type CPlayer_SetCommunityPreferences_Request = {
	preferences?: {
		parenthesizeNicknames?: boolean;
		textFilterSetting?: ValueOf<typeof ETextFilterSetting>;
		textFilterIgnoreFriends?: boolean;
		textFilterWordsRevision?: number;
		timestampUpdated?: number;
	};
}

type CPlayer_SetCommunityPreferences_Response = {
}

type CPlayer_GetTextFilterWords_Request = {
}

type CPlayer_TextFilterWords = {
	textFilterCustomBannedWords?: string[];
	textFilterCustomCleanWords?: string[];
	textFilterWordsRevision?: number;
}

type CPlayer_GetTextFilterWords_Response = {
	words?: {
		textFilterCustomBannedWords?: string[];
		textFilterCustomCleanWords?: string[];
		textFilterWordsRevision?: number;
	};
}

type CPlayer_GetNewSteamAnnouncementState_Request = {
	language?: number;
}

type CPlayer_GetNewSteamAnnouncementState_Response = {
	state?: ValueOf<typeof ENewSteamAnnouncementState>;
	announcementHeadline?: string;
	announcementUrl?: string;
	timePosted?: number;
	announcementGid?: Long;
}

type CPlayer_UpdateSteamAnnouncementLastRead_Request = {
	announcementGid?: Long;
	timePosted?: number;
}

type CPlayer_UpdateSteamAnnouncementLastRead_Response = {
}

type CPlayer_GetPrivacySettings_Request = {
}

type CPrivacySettings = {
	privacyState?: number;
	privacyStateInventory?: number;
	privacyStateGifts?: number;
	privacyStateOwnedgames?: number;
	privacyStatePlaytime?: number;
	privacyStateFriendslist?: number;
}

type CPlayer_GetPrivacySettings_Response = {
	privacySettings?: {
		privacyState?: number;
		privacyStateInventory?: number;
		privacyStateGifts?: number;
		privacyStateOwnedgames?: number;
		privacyStatePlaytime?: number;
		privacyStateFriendslist?: number;
	};
}

type CPlayer_GetDurationControl_Request = {
	appid?: number;
}

type CPlayer_GetDurationControl_Response = {
	isEnabled?: boolean;
	seconds?: number;
	secondsToday?: number;
	isSteamchinaAccount?: boolean;
	isAgeVerified?: boolean;
	secondsAllowedToday?: number;
	ageVerificationPending?: boolean;
	blockMinors?: boolean;
}

type CPlayer_RecordDisconnectedPlaytime_Request = {
	playSessions?: {
		appid?: number;
		sessionTimeStart?: number;
		seconds?: number;
		offline?: boolean;
	}[];
}

type CPlayer_RecordDisconnectedPlaytime_Response = {
}

type CPlayer_LastPlayedTimes_Notification = {
	games?: {
		appid?: number;
		lastPlaytime?: number;
		playtime_2weeks?: number;
		playtimeForever?: number;
		firstPlaytime?: number;
		playtimeWindowsForever?: number;
		playtimeMacForever?: number;
		playtimeLinuxForever?: number;
		firstWindowsPlaytime?: number;
		firstMacPlaytime?: number;
		firstLinuxPlaytime?: number;
		lastWindowsPlaytime?: number;
		lastMacPlaytime?: number;
		lastLinuxPlaytime?: number;
		playtimeDisconnected?: number;
	}[];
}

type CPlayer_FriendNicknameChanged_Notification = {
	accountid?: number;
	nickname?: string;
	isEchoToSelf?: boolean;
}

type CPlayer_FriendEquippedProfileItemsChanged_Notification = {
	accountid?: number;
}

type CPlayer_NewSteamAnnouncementState_Notification = {
	state?: ValueOf<typeof ENewSteamAnnouncementState>;
	announcementHeadline?: string;
	announcementUrl?: string;
	timePosted?: number;
	announcementGid?: Long;
}

type CPlayer_CommunityPreferencesChanged_Notification = {
	preferences?: {
		parenthesizeNicknames?: boolean;
		textFilterSetting?: ValueOf<typeof ETextFilterSetting>;
		textFilterIgnoreFriends?: boolean;
		textFilterWordsRevision?: number;
		timestampUpdated?: number;
	};
	contentDescriptorPreferences?: {
		contentDescriptorsToExclude?: {
			contentDescriptorid?: number;
			timestampAdded?: number;
		}[];
	};
}

type CPlayer_TextFilterWordsChanged_Notification = {
	words?: {
		textFilterCustomBannedWords?: string[];
		textFilterCustomCleanWords?: string[];
		textFilterWordsRevision?: number;
	};
}

type CPlayer_PerFriendPreferencesChanged_Notification = {
	accountid?: number;
	preferences?: {
		accountid?: number;
		nickname?: string;
		notificationsShowingame?: ValueOf<typeof ENotificationSetting>;
		notificationsShowonline?: ValueOf<typeof ENotificationSetting>;
		notificationsShowmessages?: ValueOf<typeof ENotificationSetting>;
		soundsShowingame?: ValueOf<typeof ENotificationSetting>;
		soundsShowonline?: ValueOf<typeof ENotificationSetting>;
		soundsShowmessages?: ValueOf<typeof ENotificationSetting>;
		notificationsSendmobile?: ValueOf<typeof ENotificationSetting>;
	};
}

type CPlayer_PrivacySettingsChanged_Notification = {
	privacySettings?: {
		privacyState?: number;
		privacyStateInventory?: number;
		privacyStateGifts?: number;
		privacyStateOwnedgames?: number;
		privacyStatePlaytime?: number;
		privacyStateFriendslist?: number;
	};
}

