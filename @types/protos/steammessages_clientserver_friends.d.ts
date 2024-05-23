/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Wed May 22 2024 23:20:29 GMT-0400 (Eastern Daylight Time)
 */

import Long from 'long';
import { ValueOf } from 'type-fest';

export type CMsgClientFriendMsg = {
    steamid?: Long;
    chatEntryType?: number;
    message?: Buffer;
    rtime32ServerTimestamp?: number;
    echoToSender?: boolean;
};

export type CMsgClientFriendMsgIncoming = {
    steamidFrom?: Long;
    chatEntryType?: number;
    fromLimitedAccount?: boolean;
    message?: Buffer;
    rtime32ServerTimestamp?: number;
};

export type CMsgClientAddFriend = {
    steamidToAdd?: Long;
    accountnameOrEmailToAdd?: string;
};

export type CMsgClientAddFriendResponse = {
    eresult?: number;
    steamIdAdded?: Long;
    personaNameAdded?: string;
};

export type CMsgClientRemoveFriend = {
    friendid?: Long;
};

export type CMsgClientHideFriend = {
    friendid?: Long;
    hide?: boolean;
};

export type CMsgClientFriendsList = {
    bincremental?: boolean;
    friends?: {
        ulfriendid?: Long;
        efriendrelationship?: number;
    }[];
    maxFriendCount?: number;
    activeFriendCount?: number;
    friendsLimitHit?: boolean;
};

export type CMsgClientFriendsGroupsList = {
    bremoval?: boolean;
    bincremental?: boolean;
    friendGroups?: {
        nGroupID?: number;
        strGroupName?: string;
    }[];
    memberships?: {
        ulSteamID?: Long;
        nGroupID?: number;
    }[];
};

export type CMsgClientPlayerNicknameList = {
    removal?: boolean;
    incremental?: boolean;
    nicknames?: {
        steamid?: Long;
        nickname?: string;
    }[];
};

export type CMsgClientSetPlayerNickname = {
    steamid?: Long;
    nickname?: string;
};

export type CMsgClientSetPlayerNicknameResponse = {
    eresult?: number;
};

export type CMsgClientRequestFriendData = {
    personaStateRequested?: number;
    friends?: Long[];
};

export type CMsgClientChangeStatus = {
    personaState?: number;
    playerName?: string;
    isAutoGeneratedName?: boolean;
    highPriority?: boolean;
    personaSetByUser?: boolean;
    personaStateFlags?: number;
    needPersonaResponse?: boolean;
    isClientIdle?: boolean;
};

export type CMsgPersonaChangeResponse = {
    result?: number;
    playerName?: string;
};

export type CMsgClientPersonaState = {
    statusFlags?: number;
    friends?: {
        friendid?: Long;
        personaState?: number;
        gamePlayedAppId?: number;
        gameServerIp?: number;
        gameServerPort?: number;
        personaStateFlags?: number;
        onlineSessionInstances?: number;
        personaSetByUser?: boolean;
        playerName?: string;
        queryPort?: number;
        steamidSource?: Long;
        avatarHash?: Buffer;
        lastLogoff?: number;
        lastLogon?: number;
        lastSeenOnline?: number;
        clanRank?: number;
        gameName?: string;
        gameid?: Long;
        gameDataBlob?: Buffer;
        clanData?: {
            oggAppId?: number;
            chatGroupId?: Long;
        };
        clanTag?: string;
        richPresence?: {
            key?: string;
            value?: string;
        }[];
        broadcastId?: Long;
        gameLobbyId?: Long;
        watchingBroadcastAccountid?: number;
        watchingBroadcastAppid?: number;
        watchingBroadcastViewers?: number;
        watchingBroadcastTitle?: string;
        isCommunityBanned?: boolean;
        playerNamePendingReview?: boolean;
        avatarPendingReview?: boolean;
    }[];
};

export type CMsgClientFriendProfileInfo = {
    steamidFriend?: Long;
};

export type CMsgClientFriendProfileInfoResponse = {
    eresult?: number;
    steamidFriend?: Long;
    timeCreated?: number;
    realName?: string;
    cityName?: string;
    stateName?: string;
    countryName?: string;
    headline?: string;
    summary?: string;
};

export type CMsgClientCreateFriendsGroup = {
    steamid?: Long;
    groupname?: string;
    steamidFriends?: Long[];
};

export type CMsgClientCreateFriendsGroupResponse = {
    eresult?: number;
    groupid?: number;
};

export type CMsgClientDeleteFriendsGroup = {
    steamid?: Long;
    groupid?: number;
};

export type CMsgClientDeleteFriendsGroupResponse = {
    eresult?: number;
};

export type CMsgClientManageFriendsGroup = {
    groupid?: number;
    groupname?: string;
    steamidFriendsAdded?: Long[];
    steamidFriendsRemoved?: Long[];
};

export type CMsgClientManageFriendsGroupResponse = {
    eresult?: number;
};

export type CMsgClientAddFriendToGroup = {
    groupid?: number;
    steamiduser?: Long;
};

export type CMsgClientAddFriendToGroupResponse = {
    eresult?: number;
};

export type CMsgClientRemoveFriendFromGroup = {
    groupid?: number;
    steamiduser?: Long;
};

export type CMsgClientRemoveFriendFromGroupResponse = {
    eresult?: number;
};

export type CMsgClientGetEmoticonList = {};

export type CMsgClientEmoticonList = {
    emoticons?: {
        name?: string;
        count?: number;
        timeLastUsed?: number;
        useCount?: number;
        timeReceived?: number;
        appid?: number;
    }[];
    stickers?: {
        name?: string;
        count?: number;
        timeReceived?: number;
        appid?: number;
        timeLastUsed?: number;
        useCount?: number;
    }[];
    effects?: {
        name?: string;
        count?: number;
        timeReceived?: number;
        infiniteUse?: boolean;
        appid?: number;
    }[];
};
