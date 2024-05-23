/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Wed May 22 2024 23:20:29 GMT-0400 (Eastern Daylight Time)
 */

import Long from 'long';
import { ValueOf } from 'type-fest';
import * as enums from '../../resources/language/steammessages_base';

export type CMsgIPAddress = {
    v4?: number;
    v6?: Buffer;
};

export type CMsgIPAddressBucket = {
    originalIpAddress?: {
        v4?: number;
        v6?: Buffer;
    };
    bucket?: Long;
};

export type CMsgGCRoutingProtoBufHeader = {
    dstGcidQueue?: Long;
    dstGcDirIndex?: number;
};

export type CMsgProtoBufHeader = {
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
    sessionDisposition?: (typeof enums.ESessionDisposition)[keyof typeof enums.ESessionDisposition];
    wgToken?: string;
    webuiAuthKey?: string;
    excludeClientSessionids?: number[];
    ip?: number;
    ipV6?: Buffer;
};

export type CMsgMulti = {
    sizeUnzipped?: number;
    messageBody?: Buffer;
};

export type CMsgProtobufWrapped = {
    messageBody?: Buffer;
};

export type CMsgAuthTicket = {
    estate?: number;
    eresult?: number;
    steamid?: Long;
    gameid?: Long;
    hSteamPipe?: number;
    ticketCrc?: number;
    ticket?: Buffer;
    serverSecret?: Buffer;
    ticketType?: number;
};

export type CCDDBAppDetailCommon = {
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
};

export type CMsgAppRights = {
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
};

export type CCuratorPreferences = {
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
};

export type CLocalizationToken = {
    language?: number;
    localizedString?: string;
};

export type CClanEventUserNewsTuple = {
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
};

export type CClanMatchEventByRange = {
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
};

export type CCommunityClanAnnouncementInfo = {
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
    banCheckResult?: (typeof enums.EBanContentCheckResult)[keyof typeof enums.EBanContentCheckResult];
    banned?: boolean;
};

export type CClanEventData = {
    gid?: Long;
    clanSteamid?: Long;
    eventName?: string;
    eventType?: (typeof enums.EProtoClanEventType)[keyof typeof enums.EProtoClanEventType];
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
        banCheckResult?: (typeof enums.EBanContentCheckResult)[keyof typeof enums.EBanContentCheckResult];
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
};

export type CBillingAddress = {
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
};

export type CPackageReservationStatus = {
    packageid?: number;
    reservationState?: number;
    queuePosition?: number;
    totalQueueSize?: number;
    reservationCountryCode?: string;
    expired?: boolean;
    timeExpires?: number;
    timeReserved?: number;
    rtimeEstimatedNotification?: number;
    notificatonToken?: string;
};

export type CMsgKeyValuePair = {
    name?: string;
    value?: string;
};

export type CMsgKeyValueSet = {
    pairs?: {
        name?: string;
        value?: string;
    }[];
};

export type UserContentDescriptorPreferences = {
    contentDescriptorsToExclude?: {
        contentDescriptorid?: number;
        timestampAdded?: number;
    }[];
};
