/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CMsgClientUpdateUserGameInfo = {
	steamidIdgs?: Long;
	gameid?: Long;
	gameIp?: number;
	gamePort?: number;
	token?: Buffer;
}

type CMsgClientRichPresenceUpload = {
	richPresenceKv?: Buffer;
	steamidBroadcast?: Long[];
}

type CMsgClientRichPresenceRequest = {
	steamidRequest?: Long[];
}

type CMsgClientRichPresenceInfo = {
	richPresence?: {
		steamidUser?: Long;
		richPresenceKv?: Buffer;
	}[];
}

type CMsgClientCheckFileSignature = {
	appId?: number;
}

type CMsgClientCheckFileSignatureResponse = {
	appId?: number;
	pid?: number;
	eresult?: number;
	filename?: string;
	esignatureresult?: number;
	shaFile?: Buffer;
	signatureheader?: Buffer;
	filesize?: number;
	getlasterror?: number;
	evalvesignaturecheckdetail?: number;
}

type CMsgClientReadMachineAuth = {
	filename?: string;
	offset?: number;
	cubtoread?: number;
}

type CMsgClientReadMachineAuthResponse = {
	filename?: string;
	eresult?: number;
	filesize?: number;
	shaFile?: Buffer;
	getlasterror?: number;
	offset?: number;
	cubread?: number;
	bytesRead?: Buffer;
	filenameSentry?: string;
}

type CMsgClientUpdateMachineAuth = {
	filename?: string;
	offset?: number;
	cubtowrite?: number;
	bytes?: Buffer;
	otpType?: number;
	otpIdentifier?: string;
	otpSharedsecret?: Buffer;
	otpTimedrift?: number;
}

type CMsgClientUpdateMachineAuthResponse = {
	filename?: string;
	eresult?: number;
	filesize?: number;
	shaFile?: Buffer;
	getlasterror?: number;
	offset?: number;
	cubwrote?: number;
	otpType?: number;
	otpValue?: number;
	otpIdentifier?: string;
}

type CMsgClientRequestMachineAuth = {
	filename?: string;
	eresultSentryfile?: number;
	filesize?: number;
	shaSentryfile?: Buffer;
	lockAccountAction?: number;
	otpType?: number;
	otpIdentifier?: string;
	otpSharedsecret?: Buffer;
	otpValue?: number;
	machineName?: string;
	machineNameUserchosen?: string;
}

type CMsgClientRequestMachineAuthResponse = {
	eresult?: number;
}

type CMsgClientRegisterKey = {
	key?: string;
}

type CMsgClientPurchaseResponse = {
	eresult?: number;
	purchaseResultDetails?: number;
	purchaseReceiptInfo?: Buffer;
}

type CMsgClientActivateOEMLicense = {
	biosManufacturer?: string;
	biosSerialnumber?: string;
	licenseFile?: Buffer;
	mainboardManufacturer?: string;
	mainboardProduct?: string;
	mainboardSerialnumber?: string;
}

type CMsgClientRegisterOEMMachine = {
	oemRegisterFile?: Buffer;
}

type CMsgClientRegisterOEMMachineResponse = {
	eresult?: number;
}

type CMsgClientPurchaseWithMachineID = {
	packageId?: number;
	machineInfo?: Buffer;
}

type CMsgTrading_InitiateTradeRequest = {
	tradeRequestId?: number;
	otherSteamid?: Long;
	otherName?: string;
}

type CMsgTrading_InitiateTradeResponse = {
	response?: number;
	tradeRequestId?: number;
	otherSteamid?: Long;
	steamguardRequiredDays?: number;
	newDeviceCooldownDays?: number;
	defaultPasswordResetProbationDays?: number;
	passwordResetProbationDays?: number;
	defaultEmailChangeProbationDays?: number;
	emailChangeProbationDays?: number;
}

type CMsgTrading_CancelTradeRequest = {
	otherSteamid?: Long;
}

type CMsgTrading_StartSession = {
	otherSteamid?: Long;
}

type CMsgClientGetCDNAuthToken = {
	depotId?: number;
	hostName?: string;
	appId?: number;
}

type CMsgClientGetDepotDecryptionKey = {
	depotId?: number;
	appId?: number;
}

type CMsgClientGetDepotDecryptionKeyResponse = {
	eresult?: number;
	depotId?: number;
	depotEncryptionKey?: Buffer;
}

type CMsgClientCheckAppBetaPassword = {
	appId?: number;
	betapassword?: string;
	language?: number;
}

type CMsgClientCheckAppBetaPasswordResponse = {
	eresult?: number;
	betapasswords?: {
		betaname?: string;
		betapassword?: string;
		betadescription?: string;
	}[];
}

type CMsgClientGetCDNAuthTokenResponse = {
	eresult?: number;
	token?: string;
	expirationTime?: number;
}

type CMsgDownloadRateStatistics = {
	cellId?: number;
	stats?: {
		sourceType?: number;
		sourceId?: number;
		seconds?: number;
		bytes?: Long;
		hostName?: string;
		microseconds?: Long;
		usedIpv6?: boolean;
		proxied?: boolean;
	}[];
	throttlingKbps?: number;
	steamRealm?: number;
}

type CMsgClientRequestAccountData = {
	accountOrEmail?: string;
	action?: number;
}

type CMsgClientRequestAccountDataResponse = {
	action?: number;
	eresult?: number;
	accountName?: string;
	ctMatches?: number;
	accountNameSuggestion1?: string;
	accountNameSuggestion2?: string;
	accountNameSuggestion3?: string;
}

type CMsgClientUGSGetGlobalStats = {
	gameid?: Long;
	historyDaysRequested?: number;
	timeLastRequested?: number;
	firstDayCached?: number;
	daysCached?: number;
}

type CMsgClientUGSGetGlobalStatsResponse = {
	eresult?: number;
	timestamp?: number;
	dayCurrent?: number;
	days?: {
		dayId?: number;
		stats?: {
			statId?: number;
			data?: Long;
		}[];
	}[];
}

type CMsgClientRedeemGuestPass = {
	guestPassId?: Long;
}

type CMsgClientRedeemGuestPassResponse = {
	eresult?: number;
	packageId?: number;
	mustOwnAppid?: number;
}

type CMsgClientGetClanActivityCounts = {
	steamidClans?: Long[];
}

type CMsgClientGetClanActivityCountsResponse = {
	eresult?: number;
}

type CMsgClientOGSReportString = {
	accumulated?: boolean;
	sessionid?: Long;
	severity?: number;
	formatter?: string;
	varargs?: Buffer;
}

type CMsgClientOGSReportBug = {
	sessionid?: Long;
	bugtext?: string;
	screenshot?: Buffer;
}

type CMsgClientSentLogs = {
}

type CMsgGCClient = {
	appid?: number;
	msgtype?: number;
	payload?: Buffer;
	steamid?: Long;
	gcname?: string;
	ip?: number;
}

type CMsgClientRequestFreeLicense = {
	appids?: number[];
}

type CMsgClientRequestFreeLicenseResponse = {
	eresult?: number;
	grantedPackageids?: number[];
	grantedAppids?: number[];
}

type CMsgDRMDownloadRequestWithCrashData = {
	downloadFlags?: number;
	downloadTypesKnown?: number;
	guidDrm?: Buffer;
	guidSplit?: Buffer;
	guidMerge?: Buffer;
	moduleName?: string;
	modulePath?: string;
	crashData?: Buffer;
}

type CMsgDRMDownloadResponse = {
	eresult?: number;
	appId?: number;
	blobDownloadType?: number;
	mergeGuid?: Buffer;
	downloadFileDfsIp?: number;
	downloadFileDfsPort?: number;
	downloadFileUrl?: string;
	modulePath?: string;
}

type CMsgDRMFinalResult = {
	eResult?: number;
	appId?: number;
	blobDownloadType?: number;
	errorDetail?: number;
	mergeGuid?: Buffer;
	downloadFileDfsIp?: number;
	downloadFileDfsPort?: number;
	downloadFileUrl?: string;
}

type CMsgClientDPCheckSpecialSurvey = {
	surveyId?: number;
}

type CMsgClientDPCheckSpecialSurveyResponse = {
	eResult?: number;
	state?: number;
	name?: string;
	customUrl?: string;
	includeSoftware?: boolean;
	token?: Buffer;
}

type CMsgClientDPSendSpecialSurveyResponse = {
	surveyId?: number;
	data?: Buffer;
}

type CMsgClientDPSendSpecialSurveyResponseReply = {
	eResult?: number;
	token?: Buffer;
}

type CMsgClientRequestForgottenPasswordEmail = {
	accountName?: string;
	passwordTried?: string;
}

type CMsgClientRequestForgottenPasswordEmailResponse = {
	eResult?: number;
	useSecretQuestion?: boolean;
}

type CMsgClientItemAnnouncements = {
	countNewItems?: number;
	unseenItems?: {
		appid?: number;
		contextId?: Long;
		assetId?: Long;
		amount?: Long;
		rtime32Gained?: number;
		sourceAppid?: number;
	}[];
}

type CMsgClientRequestItemAnnouncements = {
}

type CMsgClientUserNotifications = {
	notifications?: {
		userNotificationType?: number;
		count?: number;
	}[];
}

type CMsgClientCommentNotifications = {
	countNewComments?: number;
	countNewCommentsOwner?: number;
	countNewCommentsSubscriptions?: number;
}

type CMsgClientRequestCommentNotifications = {
}

type CMsgClientOfflineMessageNotification = {
	offlineMessages?: number;
	friendsWithOfflineMessages?: number[];
}

type CMsgClientRequestOfflineMessageCount = {
}

type CMsgClientChatGetFriendMessageHistory = {
	steamid?: Long;
}

type CMsgClientChatGetFriendMessageHistoryResponse = {
	steamid?: Long;
	success?: number;
	messages?: {
		accountid?: number;
		timestamp?: number;
		message?: string;
		unread?: boolean;
	}[];
}

type CMsgClientChatGetFriendMessageHistoryForOfflineMessages = {
}

type CMsgClientFSGetFriendsSteamLevels = {
	accountids?: number[];
}

type CMsgClientFSGetFriendsSteamLevelsResponse = {
	friends?: {
		accountid?: number;
		level?: number;
	}[];
}

type CMsgClientEmailAddrInfo = {
	emailAddress?: string;
	emailIsValidated?: boolean;
	emailValidationChanged?: boolean;
	credentialChangeRequiresCode?: boolean;
	passwordOrSecretqaChangeRequiresCode?: boolean;
}

type CMsgCREItemVoteSummary = {
	publishedFileIds?: {
		publishedFileId?: Long;
	}[];
}

type CMsgCREItemVoteSummaryResponse = {
	eresult?: number;
	itemVoteSummaries?: {
		publishedFileId?: Long;
		votesFor?: number;
		votesAgainst?: number;
		reports?: number;
		score?: number;
	}[];
}

type CMsgCREUpdateUserPublishedItemVote = {
	publishedFileId?: Long;
	voteUp?: boolean;
}

type CMsgCREUpdateUserPublishedItemVoteResponse = {
	eresult?: number;
}

type CMsgCREGetUserPublishedItemVoteDetails = {
	publishedFileIds?: {
		publishedFileId?: Long;
	}[];
}

type CMsgCREGetUserPublishedItemVoteDetailsResponse = {
	eresult?: number;
	userItemVoteDetails?: {
		publishedFileId?: Long;
		vote?: number;
	}[];
}

type CMsgFSGetFollowerCount = {
	steamId?: Long;
}

type CMsgFSGetFollowerCountResponse = {
	eresult?: number;
	count?: number;
}

type CMsgFSGetIsFollowing = {
	steamId?: Long;
}

type CMsgFSGetIsFollowingResponse = {
	eresult?: number;
	isFollowing?: boolean;
}

type CMsgFSEnumerateFollowingList = {
	startIndex?: number;
}

type CMsgFSEnumerateFollowingListResponse = {
	eresult?: number;
	totalResults?: number;
	steamIds?: Long[];
}

type CMsgDPGetNumberOfCurrentPlayers = {
	appid?: number;
}

type CMsgDPGetNumberOfCurrentPlayersResponse = {
	eresult?: number;
	playerCount?: number;
}

type CMsgClientFriendUserStatusPublished = {
	friendSteamid?: Long;
	appid?: number;
	statusText?: string;
}

type CMsgClientServiceMethodLegacy = {
	methodName?: string;
	serializedMethod?: Buffer;
	isNotification?: boolean;
}

type CMsgClientServiceMethodLegacyResponse = {
	methodName?: string;
	serializedMethodResponse?: Buffer;
}

type CMsgClientUIMode = {
	uimode?: number;
	chatMode?: number;
}

type CMsgClientVanityURLChangedNotification = {
	vanityUrl?: string;
}

type CMsgClientAuthorizeLocalDeviceRequest = {
	deviceDescription?: string;
	ownerAccountId?: number;
	localDeviceToken?: Long;
}

type CMsgClientAuthorizeLocalDevice = {
	eresult?: number;
	ownerAccountId?: number;
	authedDeviceToken?: Long;
}

type CMsgClientAuthorizeLocalDeviceNotification = {
	eresult?: number;
	ownerAccountId?: number;
	localDeviceToken?: Long;
}

type CMsgClientDeauthorizeDeviceRequest = {
	deauthorizationAccountId?: number;
	deauthorizationDeviceToken?: Long;
}

type CMsgClientDeauthorizeDevice = {
	eresult?: number;
	deauthorizationAccountId?: number;
}

type CMsgClientUseLocalDeviceAuthorizations = {
	authorizationAccountId?: number[];
	deviceTokens?: {
		ownerAccountId?: number;
		tokenId?: Long;
	}[];
}

type CMsgClientGetAuthorizedDevices = {
}

type CMsgClientGetAuthorizedDevicesResponse = {
	eresult?: number;
	authorizedDevice?: {
		authDeviceToken?: Long;
		deviceName?: string;
		lastAccessTime?: number;
		borrowerId?: number;
		isPending?: boolean;
		appPlayed?: number;
	}[];
}

type CMsgClientSharedLibraryLockStatus = {
	lockedLibrary?: {
		ownerId?: number;
		lockedBy?: number;
	}[];
	ownLibraryLockedBy?: number;
}

type CMsgClientSharedLibraryStopPlaying = {
	secondsLeft?: number;
	stopApps?: {
		appId?: number;
		ownerId?: number;
	}[];
}

type CMsgClientServiceCall = {
	sysidRouting?: Buffer;
	callHandle?: number;
	moduleCrc?: number;
	moduleHash?: Buffer;
	functionId?: number;
	cubOutputMax?: number;
	flags?: number;
	callparameter?: Buffer;
	pingOnly?: boolean;
	maxOutstandingCalls?: number;
	appId?: number;
}

type CMsgClientServiceModule = {
	moduleCrc?: number;
	moduleHash?: Buffer;
	moduleContent?: Buffer;
}

type CMsgClientServiceCallResponse = {
	sysidRouting?: Buffer;
	callHandle?: number;
	moduleCrc?: number;
	moduleHash?: Buffer;
	ecallresult?: number;
	resultContent?: Buffer;
	osVersionInfo?: Buffer;
	systemInfo?: Buffer;
	loadAddress?: Long;
	exceptionRecord?: Buffer;
	portableOsVersionInfo?: Buffer;
	portableSystemInfo?: Buffer;
	wasConverted?: boolean;
	internalResult?: number;
	currentCount?: number;
	lastCallHandle?: number;
	lastCallModuleCrc?: number;
	lastCallSysidRouting?: Buffer;
	lastEcallresult?: number;
	lastCallissueDelta?: number;
	lastCallcompleteDelta?: number;
}

type CMsgAMUnlockH264 = {
	appid?: number;
	platform?: number;
	reason?: number;
}

type CMsgAMUnlockH264Response = {
	eresult?: number;
	encryptionKey?: Buffer;
}

type CMsgClientPlayingSessionState = {
	playingBlocked?: boolean;
	playingApp?: number;
}

type CMsgClientKickPlayingSession = {
	onlyStopGame?: boolean;
}

type CMsgClientVoiceCallPreAuthorize = {
	callerSteamid?: Long;
	receiverSteamid?: Long;
	callerId?: number;
	hangup?: boolean;
}

type CMsgClientVoiceCallPreAuthorizeResponse = {
	callerSteamid?: Long;
	receiverSteamid?: Long;
	eresult?: number;
	callerId?: number;
}

type CMsgBadgeCraftedNotification = {
	appid?: number;
	badgeLevel?: number;
}

type CMsgClientStartPeerContentServer = {
	steamid?: Long;
	clientRemoteId?: Long;
	appId?: number;
	currentBuildId?: number;
}

type CMsgClientStartPeerContentServerResponse = {
	result?: number;
	serverPort?: number;
	installedDepots?: number[];
}

type CMsgClientGetPeerContentInfo = {
	steamid?: Long;
	clientRemoteId?: Long;
	ownedGamesVisible?: boolean;
}

type CMsgClientGetPeerContentInfoResponse = {
	result?: number;
	apps?: number[];
}

type CMsgClientFeatureGroupInfo = {
	groupid?: Long;
	members?: number[];
}

