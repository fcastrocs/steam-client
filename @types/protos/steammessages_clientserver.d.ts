/**
 * Auto-generated file
 * Wed May 22 2024 20:34:57 GMT-0400 (Eastern Daylight Time)
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
	gamesPlayed?: .CMsgClientGamesPlayed.GamePlayed[]
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
	tickets?: .CMsgAuthTicket[]
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
	licenses?: .CMsgClientLicenseList.License[]
}

export type CMsgClientIsLimitedAccount = {
	bisLimitedAccount?: boolean
	bisCommunityBanned?: boolean
	bisLockedAccount?: boolean
	bisLimitedAccountAllowedToInviteFriends?: boolean
}

export type CMsgClientRequestedClientStats = {
	statsToSend?: .CMsgClientRequestedClientStats.StatsToSend[]
}

export type CMsgClientStat2 = {
	statDetail?: .CMsgClientStat2.StatDetail[]
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
	statsLogon?: .CMsgClientConnectionStats.Stats_Logon
	statsVconn?: .CMsgClientConnectionStats.Stats_VConn
}

export type CMsgClientServersAvailable = {
	serverTypesAvailable?: .CMsgClientServersAvailable.Server_Types_Available[]
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
	encryptedAppTicket?: .EncryptedAppTicket
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
	Ids?: .CMsgClientAMGetPersonaNameHistory.IdInstance[]
}

export type CMsgClientAMGetPersonaNameHistoryResponse = {
	responses?: .CMsgClientAMGetPersonaNameHistoryResponse.NameTableInstance[]
}

export type CMsgClientDeregisterWithServer = {
	eservertype?: number
	appId?: number
}

export type CMsgClientClanState = {
	steamidClan?: Long
	clanAccountFlags?: number
	nameInfo?: .CMsgClientClanState.NameInfo
	userCounts?: .CMsgClientClanState.UserCounts
	events?: .CMsgClientClanState.Event[]
	announcements?: .CMsgClientClanState.Event[]
	chatRoomPrivate?: boolean
}

