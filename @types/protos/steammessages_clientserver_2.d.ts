/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Tue Apr 15 2025 22:37:08 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CMsgClientUpdateUserGameInfo = {
	steamidIdgs?: Long
	gameid?: Long
	gameIp?: number
	gamePort?: number
	token?: Buffer
}

export type CMsgClientRichPresenceUpload = {
	richPresenceKv?: Buffer
	steamidBroadcast?: Long[]
}

export type CMsgClientRichPresenceRequest = {
	steamidRequest?: Long[]
}

export type CMsgClientRichPresenceInfo = {
	richPresence?: {
		steamidUser?: Long
		richPresenceKv?: Buffer
		richPresense?: {
			key?: string
			value?: string
		}[]
	}[]
}

export type CMsgClientCheckFileSignature = {
	appId?: number
}

export type CMsgClientCheckFileSignatureResponse = {
	appId?: number
	pid?: number
	eresult?: number
	filename?: string
	esignatureresult?: number
	shaFile?: Buffer
	signatureheader?: Buffer
	filesize?: number
	getlasterror?: number
	evalvesignaturecheckdetail?: number
}

export type CMsgClientRegisterKey = {
	key?: string
}

export type CMsgClientPurchaseResponse = {
	eresult?: number
	purchaseResultDetails?: number
	purchaseReceiptInfo?: Buffer
}

export type CMsgClientActivateOEMLicense = {
	biosManufacturer?: string
	biosSerialnumber?: string
	licenseFile?: Buffer
	mainboardManufacturer?: string
	mainboardProduct?: string
	mainboardSerialnumber?: string
}

export type CMsgClientRegisterOEMMachine = {
	oemRegisterFile?: Buffer
}

export type CMsgClientRegisterOEMMachineResponse = {
	eresult?: number
}

export type CMsgClientPurchaseWithMachineID = {
	packageId?: number
	machineInfo?: Buffer
}

export type CMsgTradingInitiateTradeRequest = {
	tradeRequestId?: number
	otherSteamid?: Long
	otherName?: string
}

export type CMsgTradingInitiateTradeResponse = {
	response?: number
	tradeRequestId?: number
	otherSteamid?: Long
	steamguardRequiredDays?: number
	newDeviceCooldownDays?: number
	defaultPasswordResetProbationDays?: number
	passwordResetProbationDays?: number
	defaultEmailChangeProbationDays?: number
	emailChangeProbationDays?: number
}

export type CMsgTradingCancelTradeRequest = {
	otherSteamid?: Long
}

export type CMsgTradingStartSession = {
	otherSteamid?: Long
}

export type CMsgClientGetDepotDecryptionKey = {
	depotId?: number
	appId?: number
}

export type CMsgClientGetDepotDecryptionKeyResponse = {
	eresult?: number
	depotId?: number
	depotEncryptionKey?: Buffer
}

export type CMsgClientCheckAppBetaPassword = {
	appId?: number
	betapassword?: string
	language?: number
}

export type CMsgClientCheckAppBetaPasswordResponse = {
	eresult?: number
	betapasswords?: {
		betaname?: string
		betapassword?: string
		betadescription?: string
	}[]
}

export type CMsgClientUGSGetGlobalStats = {
	gameid?: Long
	historyDaysRequested?: number
	timeLastRequested?: number
	firstDayCached?: number
	daysCached?: number
}

export type CMsgClientUGSGetGlobalStatsResponse = {
	eresult?: number
	timestamp?: number
	dayCurrent?: number
	days?: {
		dayId?: number
		stats?: {
			statId?: number
			data?: Long
		}[]
	}[]
}

export type CMsgClientRedeemGuestPass = {
	guestPassId?: Long
}

export type CMsgClientRedeemGuestPassResponse = {
	eresult?: number
	packageId?: number
	mustOwnAppid?: number
}

export type CMsgClientGetClanActivityCounts = {
	steamidClans?: Long[]
}

export type CMsgClientGetClanActivityCountsResponse = {
	eresult?: number
}

export type CMsgClientOGSReportString = {
	accumulated?: boolean
	sessionid?: Long
	severity?: number
	formatter?: string
	varargs?: Buffer
}

export type CMsgClientOGSReportBug = {
	sessionid?: Long
	bugtext?: string
	screenshot?: Buffer
}

export type CMsgClientSentLogs = {
}

export type CMsgGCClient = {
	appid?: number
	msgtype?: number
	payload?: Buffer
	steamid?: Long
	gcname?: string
	ip?: number
}

export type CMsgClientRequestFreeLicense = {
	appids?: number[]
}

export type CMsgClientRequestFreeLicenseResponse = {
	eresult?: number
	grantedPackageids?: number[]
	grantedAppids?: number[]
}

export type CMsgDRMDownloadRequestWithCrashData = {
	downloadFlags?: number
	downloadTypesKnown?: number
	guidDrm?: Buffer
	guidSplit?: Buffer
	guidMerge?: Buffer
	moduleName?: string
	modulePath?: string
	crashData?: Buffer
}

export type CMsgDRMDownloadResponse = {
	eresult?: number
	appId?: number
	blobDownloadType?: number
	mergeGuid?: Buffer
	downloadFileDfsIp?: number
	downloadFileDfsPort?: number
	downloadFileUrl?: string
	modulePath?: string
}

export type CMsgDRMFinalResult = {
	eResult?: number
	appId?: number
	blobDownloadType?: number
	errorDetail?: number
	mergeGuid?: Buffer
	downloadFileDfsIp?: number
	downloadFileDfsPort?: number
	downloadFileUrl?: string
}

export type CMsgClientDPCheckSpecialSurvey = {
	surveyId?: number
}

export type CMsgClientDPCheckSpecialSurveyResponse = {
	eResult?: number
	state?: number
	name?: string
	customUrl?: string
	includeSoftware?: boolean
	token?: Buffer
}

export type CMsgClientDPSendSpecialSurveyResponse = {
	surveyId?: number
	data?: Buffer
}

export type CMsgClientDPSendSpecialSurveyResponseReply = {
	eResult?: number
	token?: Buffer
}

export type CMsgClientRequestForgottenPasswordEmail = {
	accountName?: string
	passwordTried?: string
}

export type CMsgClientRequestForgottenPasswordEmailResponse = {
	eResult?: number
	useSecretQuestion?: boolean
}

export type CMsgClientItemAnnouncements = {
	countNewItems?: number
	unseenItems?: {
		appid?: number
		contextId?: Long
		assetId?: Long
		amount?: Long
		rtime32Gained?: number
		sourceAppid?: number
	}[]
}

export type CMsgClientRequestItemAnnouncements = {
}

export type CMsgClientUserNotifications = {
	notifications?: {
		userNotificationType?: number
		count?: number
	}[]
}

export type CMsgClientCommentNotifications = {
	countNewComments?: number
	countNewCommentsOwner?: number
	countNewCommentsSubscriptions?: number
}

export type CMsgClientRequestCommentNotifications = {
}

export type CMsgClientOfflineMessageNotification = {
	offlineMessages?: number
	friendsWithOfflineMessages?: number[]
}

export type CMsgClientRequestOfflineMessageCount = {
}

export type CMsgClientChatGetFriendMessageHistory = {
	steamid?: Long
}

export type CMsgClientChatGetFriendMessageHistoryResponse = {
	steamid?: Long
	success?: number
	messages?: {
		accountid?: number
		timestamp?: number
		message?: string
		unread?: boolean
	}[]
}

export type CMsgClientChatGetFriendMessageHistoryForOfflineMessages = {
}

export type CMsgClientFSGetFriendsSteamLevels = {
	accountids?: number[]
}

export type CMsgClientFSGetFriendsSteamLevelsResponse = {
	friends?: {
		accountid?: number
		level?: number
	}[]
}

export type CMsgClientEmailAddrInfo = {
	emailAddress?: string
	emailIsValidated?: boolean
	emailValidationChanged?: boolean
	credentialChangeRequiresCode?: boolean
	passwordOrSecretqaChangeRequiresCode?: boolean
}

export type CMsgCREItemVoteSummary = {
	publishedFileIds?: {
		publishedFileId?: Long
	}[]
}

export type CMsgCREItemVoteSummaryResponse = {
	eresult?: number
	itemVoteSummaries?: {
		publishedFileId?: Long
		votesFor?: number
		votesAgainst?: number
		reports?: number
		score?: number
	}[]
}

export type CMsgCREUpdateUserPublishedItemVote = {
	publishedFileId?: Long
	voteUp?: boolean
}

export type CMsgCREUpdateUserPublishedItemVoteResponse = {
	eresult?: number
}

export type CMsgCREGetUserPublishedItemVoteDetails = {
	publishedFileIds?: {
		publishedFileId?: Long
	}[]
}

export type CMsgCREGetUserPublishedItemVoteDetailsResponse = {
	eresult?: number
	userItemVoteDetails?: {
		publishedFileId?: Long
		vote?: number
	}[]
}

export type CMsgFSGetFollowerCount = {
	steamId?: Long
}

export type CMsgFSGetFollowerCountResponse = {
	eresult?: number
	count?: number
}

export type CMsgFSGetIsFollowing = {
	steamId?: Long
}

export type CMsgFSGetIsFollowingResponse = {
	eresult?: number
	isFollowing?: boolean
}

export type CMsgFSEnumerateFollowingList = {
	startIndex?: number
}

export type CMsgFSEnumerateFollowingListResponse = {
	eresult?: number
	totalResults?: number
	steamIds?: Long[]
}

export type CMsgDPGetNumberOfCurrentPlayers = {
	appid?: number
}

export type CMsgDPGetNumberOfCurrentPlayersResponse = {
	eresult?: number
	playerCount?: number
}

export type CMsgClientFriendUserStatusPublished = {
	friendSteamid?: Long
	appid?: number
	statusText?: string
}

export type CMsgClientServiceMethodLegacy = {
	methodName?: string
	serializedMethod?: Buffer
	isNotification?: boolean
}

export type CMsgClientServiceMethodLegacyResponse = {
	methodName?: string
	serializedMethodResponse?: Buffer
}

export type CMsgClientUIMode = {
	uimode?: number
	chatMode?: number
}

export type CMsgClientVanityURLChangedNotification = {
	vanityUrl?: string
}

export type CMsgClientAuthorizeLocalDeviceRequest = {
	deviceDescription?: string
	ownerAccountId?: number
	localDeviceToken?: Long
}

export type CMsgClientAuthorizeLocalDevice = {
	eresult?: number
	ownerAccountId?: number
	authedDeviceToken?: Long
}

export type CMsgClientAuthorizeLocalDeviceNotification = {
	eresult?: number
	ownerAccountId?: number
	localDeviceToken?: Long
}

export type CMsgClientDeauthorizeDeviceRequest = {
	deauthorizationAccountId?: number
	deauthorizationDeviceToken?: Long
}

export type CMsgClientDeauthorizeDevice = {
	eresult?: number
	deauthorizationAccountId?: number
}

export type CMsgClientUseLocalDeviceAuthorizations = {
	authorizationAccountId?: number[]
	deviceTokens?: {
		ownerAccountId?: number
		tokenId?: Long
	}[]
}

export type CMsgClientGetAuthorizedDevices = {
}

export type CMsgClientGetAuthorizedDevicesResponse = {
	eresult?: number
	authorizedDevice?: {
		authDeviceToken?: Long
		deviceName?: string
		lastAccessTime?: number
		borrowerId?: number
		isPending?: boolean
		appPlayed?: number
	}[]
}

export type CMsgClientSharedLibraryLockStatus = {
	lockedLibrary?: {
		ownerId?: number
		lockedBy?: number
	}[]
	ownLibraryLockedBy?: number
}

export type CMsgClientSharedLibraryStopPlaying = {
	secondsLeft?: number
	stopApps?: {
		appId?: number
		ownerId?: number
	}[]
}

export type CMsgClientServiceCall = {
	sysidRouting?: Buffer
	callHandle?: number
	moduleCrc?: number
	moduleHash?: Buffer
	functionId?: number
	cubOutputMax?: number
	flags?: number
	callparameter?: Buffer
	pingOnly?: boolean
	maxOutstandingCalls?: number
	appId?: number
}

export type CMsgClientServiceModule = {
	moduleCrc?: number
	moduleHash?: Buffer
	moduleContent?: Buffer
}

export type CMsgClientServiceCallResponse = {
	sysidRouting?: Buffer
	callHandle?: number
	moduleCrc?: number
	moduleHash?: Buffer
	ecallresult?: number
	resultContent?: Buffer
	osVersionInfo?: Buffer
	systemInfo?: Buffer
	loadAddress?: Long
	exceptionRecord?: Buffer
	portableOsVersionInfo?: Buffer
	portableSystemInfo?: Buffer
	wasConverted?: boolean
	internalResult?: number
	currentCount?: number
	lastCallHandle?: number
	lastCallModuleCrc?: number
	lastCallSysidRouting?: Buffer
	lastEcallresult?: number
	lastCallissueDelta?: number
	lastCallcompleteDelta?: number
}

export type CMsgAMUnlockH264 = {
	appid?: number
	platform?: number
	reason?: number
}

export type CMsgAMUnlockH264Response = {
	eresult?: number
	encryptionKey?: Buffer
}

export type CMsgClientPlayingSessionState = {
	playingBlocked?: boolean
	playingApp?: number
}

export type CMsgClientKickPlayingSession = {
	onlyStopGame?: boolean
}

export type CMsgClientVoiceCallPreAuthorize = {
	callerSteamid?: Long
	receiverSteamid?: Long
	callerId?: number
	hangup?: boolean
}

export type CMsgClientVoiceCallPreAuthorizeResponse = {
	callerSteamid?: Long
	receiverSteamid?: Long
	eresult?: number
	callerId?: number
}

export type CMsgBadgeCraftedNotification = {
	appid?: number
	badgeLevel?: number
}

export type CMsgClientStartPeerContentServer = {
	steamid?: Long
	clientRemoteId?: Long
	appId?: number
	currentBuildId?: number
}

export type CMsgClientStartPeerContentServerResponse = {
	result?: number
	serverPort?: number
	installedDepots?: number[]
	accessToken?: Long
}

export type CMsgClientGetPeerContentInfo = {
	steamid?: Long
	clientRemoteId?: Long
	ownedGamesVisible?: boolean
}

export type CMsgClientGetPeerContentInfoResponse = {
	result?: number
	apps?: number[]
}

export type CMsgClientPendingGameLaunch = {
	appId?: number
}

export type CMsgClientPendingGameLaunchResponse = {
	eresult?: number
	appId?: number
	envkey?: string
}

