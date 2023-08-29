/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CMsgIPAddress = {
	v4?: number;
	v6?: Buffer;
}

type CMsgIPAddressBucket = {
	originalIpAddress?: {
		v4?: number;
		v6?: Buffer;
	};
	bucket?: Long;
}

type CMsgGCRoutingProtoBufHeader = {
	dstGcidQueue?: Long;
	dstGcDirIndex?: number;
}

type CMsgProtoBufHeader = {
	steamid?: Long;
	clientSessionid?: number;
	routingAppid?: number;
	jobidSource?: Long;
	jobidTarget?: Long;
	targetJobName?: string;
	seqNum?: number;
	eresult?: number;
	errorMessage?: string;
	authAccountFlags?: number;
	tokenSource?: number;
	adminSpoofingUser?: boolean;
	transportError?: number;
	messageid?: Long;
	publisherGroupId?: number;
	sysid?: number;
	traceTag?: Long;
	webapiKeyId?: number;
	isFromExternalSource?: boolean;
	forwardToSysid?: number[];
	cmSysid?: number;
	launcherType?: number;
	realm?: number;
	timeoutMs?: number;
	debugSource?: string;
	debugSourceStringIndex?: number;
	tokenId?: Long;
	routingGc?: {
		dstGcidQueue?: Long;
		dstGcDirIndex?: number;
	};
	sessionDisposition?: ValueOf<typeof ESessionDisposition>;
	wgToken?: string;
	webuiAuthKey?: string;
	ip?: number;
	ipV6?: Buffer;
}

type CMsgMulti = {
	sizeUnzipped?: number;
	messageBody?: Buffer;
}

type CMsgProtobufWrapped = {
	messageBody?: Buffer;
}

type CMsgAuthTicket = {
	estate?: number;
	eresult?: number;
	steamid?: Long;
	gameid?: Long;
	hSteamPipe?: number;
	ticketCrc?: number;
	ticket?: Buffer;
	serverSecret?: Buffer;
	ticketType?: number;
}

type CCDDBAppDetailCommon = {
	appid?: number;
	name?: string;
	icon?: string;
	tool?: boolean;
	demo?: boolean;
	media?: boolean;
	communityVisibleStats?: boolean;
	friendlyName?: string;
	propagation?: string;
	hasAdultContent?: boolean;
	isVisibleInSteamChina?: boolean;
	appType?: number;
	hasAdultContentSex?: boolean;
	hasAdultContentViolence?: boolean;
	contentDescriptorids?: number[];
}

type CMsgAppRights = {
	editInfo?: boolean;
	publish?: boolean;
	viewErrorData?: boolean;
	download?: boolean;
	uploadCdkeys?: boolean;
	generateCdkeys?: boolean;
	viewFinancials?: boolean;
	manageCeg?: boolean;
	manageSigning?: boolean;
	manageCdkeys?: boolean;
	editMarketing?: boolean;
	economySupport?: boolean;
	economySupportSupervisor?: boolean;
	managePricing?: boolean;
	broadcastLive?: boolean;
	viewMarketingTraffic?: boolean;
	editStoreDisplayContent?: boolean;
}

type CCuratorPreferences = {
	supportedLanguages?: number;
	platformWindows?: boolean;
	platformMac?: boolean;
	platformLinux?: boolean;
	vrContent?: boolean;
	adultContentViolence?: boolean;
	adultContentSex?: boolean;
	timestampUpdated?: number;
	tagidsCurated?: number[];
	tagidsFiltered?: number[];
	websiteTitle?: string;
	websiteUrl?: string;
	discussionUrl?: string;
	showBroadcast?: boolean;
}

type CLocalizationToken = {
	language?: number;
	localizedString?: string;
}

type CClanEventUserNewsTuple = {
	clanid?: number;
	eventGid?: Long;
	announcementGid?: Long;
	rtimeStart?: number;
	rtimeEnd?: number;
	priorityScore?: number;
	type?: number;
	clampRangeSlot?: number;
	appid?: number;
	rtime32LastModified?: number;
}

type CClanMatchEventByRange = {
	rtimeBefore?: number;
	rtimeAfter?: number;
	qualified?: number;
	events?: {
		clanid?: number;
		eventGid?: Long;
		announcementGid?: Long;
		rtimeStart?: number;
		rtimeEnd?: number;
		priorityScore?: number;
		type?: number;
		clampRangeSlot?: number;
		appid?: number;
		rtime32LastModified?: number;
	}[];
}

type CCommunity_ClanAnnouncementInfo = {
	gid?: Long;
	clanid?: Long;
	posterid?: Long;
	headline?: string;
	posttime?: number;
	updatetime?: number;
	body?: string;
	commentcount?: number;
	tags?: string[];
	language?: number;
	hidden?: boolean;
	forumTopicId?: Long;
	eventGid?: Long;
	voteupcount?: number;
	votedowncount?: number;
	banCheckResult?: ValueOf<typeof EBanContentCheckResult>;
	banned?: boolean;
}

type CClanEventData = {
	gid?: Long;
	clanSteamid?: Long;
	eventName?: string;
	eventType?: ValueOf<typeof EProtoClanEventType>;
	appid?: number;
	serverAddress?: string;
	serverPassword?: string;
	rtime32StartTime?: number;
	rtime32EndTime?: number;
	commentCount?: number;
	creatorSteamid?: Long;
	lastUpdateSteamid?: Long;
	eventNotes?: string;
	jsondata?: string;
	announcementBody?: {
		gid?: Long;
		clanid?: Long;
		posterid?: Long;
		headline?: string;
		posttime?: number;
		updatetime?: number;
		body?: string;
		commentcount?: number;
		tags?: string[];
		language?: number;
		hidden?: boolean;
		forumTopicId?: Long;
		eventGid?: Long;
		voteupcount?: number;
		votedowncount?: number;
		banCheckResult?: ValueOf<typeof EBanContentCheckResult>;
		banned?: boolean;
	};
	published?: boolean;
	hidden?: boolean;
	rtime32VisibilityStart?: number;
	rtime32VisibilityEnd?: number;
	broadcasterAccountid?: number;
	followerCount?: number;
	ignoreCount?: number;
	forumTopicId?: Long;
	rtime32LastModified?: number;
	newsPostGid?: Long;
	rtimeModReviewed?: number;
	featuredAppTagid?: number;
	referencedAppids?: number[];
	buildId?: number;
	buildBranch?: string;
}

type CBilling_Address = {
	firstName?: string;
	lastName?: string;
	address1?: string;
	address2?: string;
	city?: string;
	usState?: string;
	countryCode?: string;
	postcode?: string;
	zipPlus4?: number;
	phone?: string;
}

type CPackageReservationStatus = {
	packageid?: number;
	reservationState?: number;
	queuePosition?: number;
	totalQueueSize?: number;
	reservationCountryCode?: string;
	expired?: boolean;
	timeExpires?: number;
	timeReserved?: number;
}

type CMsgKeyValuePair = {
	name?: string;
	value?: string;
}

type CMsgKeyValueSet = {
	pairs?: {
		name?: string;
		value?: string;
	}[];
}

type UserContentDescriptorPreferences = {
	contentDescriptorsToExclude?: {
		contentDescriptorid?: number;
		timestampAdded?: number;
	}[];
}

