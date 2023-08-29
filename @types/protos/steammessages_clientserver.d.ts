/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CMsgClientRegisterAuthTicketWithCM = {
	protocolVersion?: number;
	ticket?: Buffer;
	clientInstanceId?: Long;
}

type CMsgClientTicketAuthComplete = {
	steamId?: Long;
	gameId?: Long;
	estate?: number;
	eauthSessionResponse?: number;
	DEPRECATEDTicket?: Buffer;
	ticketCrc?: number;
	ticketSequence?: number;
	ownerSteamId?: Long;
}

type CMsgClientCMList = {
	cmAddresses?: number[];
	cmPorts?: number[];
	cmWebsocketAddresses?: string[];
	percentDefaultToWebsocket?: number;
}

type CMsgClientP2PConnectionInfo = {
	steamIdDest?: Long;
	steamIdSrc?: Long;
	appId?: number;
	candidate?: Buffer;
	legacyConnectionIdSrc?: Long;
	rendezvous?: Buffer;
}

type CMsgClientP2PConnectionFailInfo = {
	steamIdDest?: Long;
	steamIdSrc?: Long;
	appId?: number;
	ep2pSessionError?: number;
	connectionIdDest?: Long;
	closeReason?: number;
	closeMessage?: string;
}

type CMsgClientNetworkingCertRequest = {
	keyData?: Buffer;
	appId?: number;
}

type CMsgClientNetworkingCertReply = {
	cert?: Buffer;
	caKeyId?: Long;
	caSignature?: Buffer;
}

type CMsgClientNetworkingMobileCertRequest = {
	appId?: number;
}

type CMsgClientNetworkingMobileCertReply = {
	encodedCert?: string;
}

type CMsgClientGetAppOwnershipTicket = {
	appId?: number;
}

type CMsgClientGetAppOwnershipTicketResponse = {
	eresult?: number;
	appId?: number;
	ticket?: Buffer;
}

type CMsgClientSessionToken = {
	token?: Long;
}

type CMsgClientGameConnectTokens = {
	maxTokensToKeep?: number;
	tokens?: Buffer[];
}

type CMsgClientGamesPlayed = {
	gamesPlayed?: {
		steamIdGs?: Long;
		gameId?: Long;
		deprecatedGameIpAddress?: number;
		gamePort?: number;
		isSecure?: boolean;
		token?: Buffer;
		gameExtraInfo?: string;
		gameDataBlob?: Buffer;
		processId?: number;
		streamingProviderId?: number;
		gameFlags?: number;
		ownerId?: number;
		vrHmdVendor?: string;
		vrHmdModel?: string;
		launchOptionType?: number;
		primaryControllerType?: number;
		primarySteamControllerSerial?: string;
		totalSteamControllerCount?: number;
		totalNonSteamControllerCount?: number;
		controllerWorkshopFileId?: Long;
		launchSource?: number;
		vrHmdRuntime?: number;
		gameIpAddress?: {
			v4?: number;
			v6?: Buffer;
		};
		controllerConnectionType?: number;
		gameOsPlatform?: number;
		gameBuildId?: number;
		compatToolId?: number;
		compatToolCmd?: string;
		compatToolBuildId?: number;
		betaName?: string;
		dlcContext?: number;
		processIdList?: {
			processId?: number;
			processIdParent?: number;
			parentIsSteam?: boolean;
		}[];
	}[];
	clientOsType?: number;
	cloudGamingPlatform?: number;
	recentReauthentication?: boolean;
}

type CMsgGSApprove = {
	steamId?: Long;
	ownerSteamId?: Long;
}

type CMsgGSDeny = {
	steamId?: Long;
	edenyReason?: number;
	denyString?: string;
}

type CMsgGSKick = {
	steamId?: Long;
	edenyReason?: number;
}

type CMsgClientAuthList = {
	tokensLeft?: number;
	lastRequestSeq?: number;
	lastRequestSeqFromServer?: number;
	tickets?: {
		estate?: number;
		eresult?: number;
		steamid?: Long;
		gameid?: Long;
		hSteamPipe?: number;
		ticketCrc?: number;
		ticket?: Buffer;
		serverSecret?: Buffer;
		ticketType?: number;
	}[];
	appIds?: number[];
	messageSequence?: number;
	filtered?: boolean;
}

type CMsgClientAuthListAck = {
	ticketCrc?: number[];
	appIds?: number[];
	messageSequence?: number;
}

type CMsgClientLicenseList = {
	eresult?: number;
	licenses?: {
		packageId?: number;
		timeCreated?: number;
		timeNextProcess?: number;
		minuteLimit?: number;
		minutesUsed?: number;
		paymentMethod?: number;
		flags?: number;
		purchaseCountryCode?: string;
		licenseType?: number;
		territoryCode?: number;
		changeNumber?: number;
		ownerId?: number;
		initialPeriod?: number;
		initialTimeUnit?: number;
		renewalPeriod?: number;
		renewalTimeUnit?: number;
		accessToken?: Long;
		masterPackageId?: number;
	}[];
}

type CMsgClientIsLimitedAccount = {
	bisLimitedAccount?: boolean;
	bisCommunityBanned?: boolean;
	bisLockedAccount?: boolean;
	bisLimitedAccountAllowedToInviteFriends?: boolean;
}

type CMsgClientRequestedClientStats = {
	statsToSend?: {
		clientStat?: number;
		statAggregateMethod?: number;
	}[];
}

type CMsgClientStat2 = {
	statDetail?: {
		clientStat?: number;
		llValue?: Long;
		timeOfDay?: number;
		cellId?: number;
		depotId?: number;
		appId?: number;
	}[];
}

type CMsgClientInviteToGame = {
	steamIdDest?: Long;
	steamIdSrc?: Long;
	connectString?: string;
	remotePlay?: string;
}

type CMsgClientChatInvite = {
	steamIdInvited?: Long;
	steamIdChat?: Long;
	steamIdPatron?: Long;
	chatroomType?: number;
	steamIdFriendChat?: Long;
	chatName?: string;
	gameId?: Long;
}

type CMsgClientConnectionStats = {
	statsLogon?: {
		connectAttempts?: number;
		connectSuccesses?: number;
		connectFailures?: number;
		connectionsDropped?: number;
		secondsRunning?: number;
		msecTologonthistime?: number;
		countBadCms?: number;
		noUdpConnectivity?: boolean;
		noTcpConnectivity?: boolean;
		noWebsocket_443Connectivity?: boolean;
		noWebsocketNon_443Connectivity?: boolean;
	};
	statsVconn?: {
		connectionsUdp?: number;
		connectionsTcp?: number;
		statsUdp?: {
			pktsSent?: Long;
			bytesSent?: Long;
			pktsRecv?: Long;
			pktsProcessed?: Long;
			bytesRecv?: Long;
		};
		pktsAbandoned?: Long;
		connReqReceived?: Long;
		pktsResent?: Long;
		msgsSent?: Long;
		msgsSentFailed?: Long;
		msgsRecv?: Long;
		datagramsSent?: Long;
		datagramsRecv?: Long;
		badPktsRecv?: Long;
		unknownConnPktsRecv?: Long;
		missedPktsRecv?: Long;
		dupPktsRecv?: Long;
		failedConnectChallenges?: Long;
		microSecAvgLatency?: number;
		microSecMinLatency?: number;
		microSecMaxLatency?: number;
	};
}

type CMsgClientServersAvailable = {
	serverTypesAvailable?: {
		server?: number;
		changed?: boolean;
	}[];
	serverTypeForAuthServices?: number;
}

type CMsgClientReportOverlayDetourFailure = {
	failureStrings?: string[];
}

type CMsgClientRequestEncryptedAppTicket = {
	appId?: number;
	userdata?: Buffer;
}

type CMsgClientRequestEncryptedAppTicketResponse = {
	appId?: number;
	eresult?: number;
	encryptedAppTicket?: {
		ticketVersionNo?: number;
		crcEncryptedticket?: number;
		cbEncrypteduserdata?: number;
		cbEncryptedAppownershipticket?: number;
		encryptedTicket?: Buffer;
	};
}

type CMsgClientWalletInfoUpdate = {
	hasWallet?: boolean;
	balance?: number;
	currency?: number;
	balanceDelayed?: number;
	balance64?: Long;
	balance64Delayed?: Long;
	realm?: number;
}

type CMsgClientAMGetClanOfficers = {
	steamidClan?: Long;
}

type CMsgClientAMGetClanOfficersResponse = {
	eresult?: number;
	steamidClan?: Long;
	officerCount?: number;
}

type CMsgClientAMGetPersonaNameHistory = {
	idCount?: number;
	Ids?: {
		steamid?: Long;
	}[];
}

type CMsgClientAMGetPersonaNameHistoryResponse = {
	responses?: {
		eresult?: number;
		steamid?: Long;
		names?: {
			nameSince?: number;
			name?: string;
		}[];
	}[];
}

type CMsgClientDeregisterWithServer = {
	eservertype?: number;
	appId?: number;
}

type CMsgClientClanState = {
	steamidClan?: Long;
	clanAccountFlags?: number;
	nameInfo?: {
		clanName?: string;
		shaAvatar?: Buffer;
	};
	userCounts?: {
		members?: number;
		online?: number;
		chatting?: number;
		inGame?: number;
		chatRoomMembers?: number;
	};
	events?: {
		gid?: Long;
		eventTime?: number;
		headline?: string;
		gameId?: Long;
		justPosted?: boolean;
	}[];
	announcements?: {
		gid?: Long;
		eventTime?: number;
		headline?: string;
		gameId?: Long;
		justPosted?: boolean;
	}[];
	chatRoomPrivate?: boolean;
}

