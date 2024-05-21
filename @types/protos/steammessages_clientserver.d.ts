/**
 * Auto-generated file
 * Mon May 20 2024 23:27:32 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CMsgClientRegisterAuthTicketWithCM = {
	protocolVersion?: number
	ticket?: Buffer
	clientInstanceId?: Long
}

export type CMsgClientTicketAuthComplete = {
	steamId?: Long
	gameId?: Long
	estate?: number
	eauthSessionResponse?: number
	DEPRECATEDTicket?: Buffer
	ticketCrc?: number
	ticketSequence?: number
	ownerSteamId?: Long
}

export type CMsgClientCMList = {
	cmAddresses?: number[]
	cmPorts?: number[]
	cmWebsocketAddresses?: string[]
	percentDefaultToWebsocket?: number
}

export type CMsgClientP2PConnectionInfo = {
	steamIdDest?: Long
	steamIdSrc?: Long
	appId?: number
	candidate?: Buffer
	legacyConnectionIdSrc?: Long
	rendezvous?: Buffer
}

export type CMsgClientP2PConnectionFailInfo = {
	steamIdDest?: Long
	steamIdSrc?: Long
	appId?: number
	ep2pSessionError?: number
	connectionIdDest?: Long
	closeReason?: number
	closeMessage?: string
}

export type CMsgClientNetworkingCertRequest = {
	keyData?: Buffer
	appId?: number
}

export type CMsgClientNetworkingCertReply = {
	cert?: Buffer
	caKeyId?: Long
	caSignature?: Buffer
}

export type CMsgClientNetworkingMobileCertRequest = {
	appId?: number
}

export type CMsgClientNetworkingMobileCertReply = {
	encodedCert?: string
}

export type CMsgClientGetAppOwnershipTicket = {
	appId?: number
}

export type CMsgClientGetAppOwnershipTicketResponse = {
	eresult?: number
	appId?: number
	ticket?: Buffer
}

export type CMsgClientSessionToken = {
	token?: Long
}

export type CMsgClientGameConnectTokens = {
	maxTokensToKeep?: number
	tokens?: Buffer[]
}

export type CMsgClientGamesPlayed = {
	gamesPlayed?: {
		steamIdGs?: Long
		gameId?: Long
		deprecatedGameIpAddress?: number
		gamePort?: number
		isSecure?: boolean
		token?: Buffer
		gameExtraInfo?: string
		gameDataBlob?: Buffer
		processId?: number
		streamingProviderId?: number
		gameFlags?: number
		ownerId?: number
		vrHmdVendor?: string
		vrHmdModel?: string
		launchOptionType?: number
		primaryControllerType?: number
		primarySteamControllerSerial?: string
		totalSteamControllerCount?: number
		totalNonSteamControllerCount?: number
		controllerWorkshopFileId?: Long
		launchSource?: number
		vrHmdRuntime?: number
		gameIpAddress?: {
			v4?: number
			v6?: Buffer
		}
		controllerConnectionType?: number
		gameOsPlatform?: number
		gameBuildId?: number
		compatToolId?: number
		compatToolCmd?: string
		compatToolBuildId?: number
		betaName?: string
		dlcContext?: number
		processIdList?: {
			processId?: number
			processIdParent?: number
			parentIsSteam?: boolean
		}[]
	}[]
	clientOsType?: number
	cloudGamingPlatform?: number
	recentReauthentication?: boolean
}

export type CMsgGSApprove = {
	steamId?: Long
	ownerSteamId?: Long
}

export type CMsgGSDeny = {
	steamId?: Long
	edenyReason?: number
	denyString?: string
}

export type CMsgGSKick = {
	steamId?: Long
	edenyReason?: number
}

export type CMsgClientAuthList = {
	tokensLeft?: number
	lastRequestSeq?: number
	lastRequestSeqFromServer?: number
	tickets?: {
		estate?: number
		eresult?: number
		steamid?: Long
		gameid?: Long
		hSteamPipe?: number
		ticketCrc?: number
		ticket?: Buffer
		serverSecret?: Buffer
		ticketType?: number
	}[]
	appIds?: number[]
	messageSequence?: number
	filtered?: boolean
}

export type CMsgClientAuthListAck = {
	ticketCrc?: number[]
	appIds?: number[]
	messageSequence?: number
}

export type CMsgClientLicenseList = {
	eresult?: number
	licenses?: {
		packageId?: number
		timeCreated?: number
		timeNextProcess?: number
		minuteLimit?: number
		minutesUsed?: number
		paymentMethod?: number
		flags?: number
		purchaseCountryCode?: string
		licenseType?: number
		territoryCode?: number
		changeNumber?: number
		ownerId?: number
		initialPeriod?: number
		initialTimeUnit?: number
		renewalPeriod?: number
		renewalTimeUnit?: number
		accessToken?: Long
		masterPackageId?: number
	}[]
}

export type CMsgClientIsLimitedAccount = {
	bisLimitedAccount?: boolean
	bisCommunityBanned?: boolean
	bisLockedAccount?: boolean
	bisLimitedAccountAllowedToInviteFriends?: boolean
}

export type CMsgClientRequestedClientStats = {
	statsToSend?: {
		clientStat?: number
		statAggregateMethod?: number
	}[]
}

export type CMsgClientStat2 = {
	statDetail?: {
		clientStat?: number
		llValue?: Long
		timeOfDay?: number
		cellId?: number
		depotId?: number
		appId?: number
	}[]
}

export type CMsgClientInviteToGame = {
	steamIdDest?: Long
	steamIdSrc?: Long
	connectString?: string
	remotePlay?: string
}

export type CMsgClientChatInvite = {
	steamIdInvited?: Long
	steamIdChat?: Long
	steamIdPatron?: Long
	chatroomType?: number
	steamIdFriendChat?: Long
	chatName?: string
	gameId?: Long
}

export type CMsgClientConnectionStats = {
	statsLogon?: {
		connectAttempts?: number
		connectSuccesses?: number
		connectFailures?: number
		connectionsDropped?: number
		secondsRunning?: number
		msecTologonthistime?: number
		countBadCms?: number
		noUdpConnectivity?: boolean
		noTcpConnectivity?: boolean
		noWebsocket_443Connectivity?: boolean
		noWebsocketNon_443Connectivity?: boolean
	}
	statsVconn?: {
		connectionsUdp?: number
		connectionsTcp?: number
		statsUdp?: {
			pktsSent?: Long
			bytesSent?: Long
			pktsRecv?: Long
			pktsProcessed?: Long
			bytesRecv?: Long
		}
		pktsAbandoned?: Long
		connReqReceived?: Long
		pktsResent?: Long
		msgsSent?: Long
		msgsSentFailed?: Long
		msgsRecv?: Long
		datagramsSent?: Long
		datagramsRecv?: Long
		badPktsRecv?: Long
		unknownConnPktsRecv?: Long
		missedPktsRecv?: Long
		dupPktsRecv?: Long
		failedConnectChallenges?: Long
		microSecAvgLatency?: number
		microSecMinLatency?: number
		microSecMaxLatency?: number
	}
}

export type CMsgClientServersAvailable = {
	serverTypesAvailable?: {
		server?: number
		changed?: boolean
	}[]
	serverTypeForAuthServices?: number
}

export type CMsgClientReportOverlayDetourFailure = {
	failureStrings?: string[]
}

export type CMsgClientRequestEncryptedAppTicket = {
	appId?: number
	userdata?: Buffer
}

export type CMsgClientRequestEncryptedAppTicketResponse = {
	appId?: number
	eresult?: number
	encryptedAppTicket?: {
		ticketVersionNo?: number
		crcEncryptedticket?: number
		cbEncrypteduserdata?: number
		cbEncryptedAppownershipticket?: number
		encryptedTicket?: Buffer
	}
}

export type CMsgClientWalletInfoUpdate = {
	hasWallet?: boolean
	balance?: number
	currency?: number
	balanceDelayed?: number
	balance64?: Long
	balance64Delayed?: Long
	realm?: number
}

export type CMsgClientAMGetClanOfficers = {
	steamidClan?: Long
}

export type CMsgClientAMGetClanOfficersResponse = {
	eresult?: number
	steamidClan?: Long
	officerCount?: number
}

export type CMsgClientAMGetPersonaNameHistory = {
	idCount?: number
	Ids?: {
		steamid?: Long
	}[]
}

export type CMsgClientAMGetPersonaNameHistoryResponse = {
	responses?: {
		eresult?: number
		steamid?: Long
		names?: {
			nameSince?: number
			name?: string
		}[]
	}[]
}

export type CMsgClientDeregisterWithServer = {
	eservertype?: number
	appId?: number
}

export type CMsgClientClanState = {
	steamidClan?: Long
	clanAccountFlags?: number
	nameInfo?: {
		clanName?: string
		shaAvatar?: Buffer
	}
	userCounts?: {
		members?: number
		online?: number
		chatting?: number
		inGame?: number
		chatRoomMembers?: number
	}
	events?: {
		gid?: Long
		eventTime?: number
		headline?: string
		gameId?: Long
		justPosted?: boolean
	}[]
	announcements?: {
		gid?: Long
		eventTime?: number
		headline?: string
		gameId?: Long
		justPosted?: boolean
	}[]
	chatRoomPrivate?: boolean
}

