/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Thu May 23 2024 22:57:11 GMT-0400 (Eastern Daylight Time)
 */

import Long from 'long';
import { ValueOf } from 'type-fest';

export type CMsgClientAppInfoUpdate = {
    lastChangenumber?: number;
    sendChangelist?: boolean;
};

export type CMsgClientAppInfoChanges = {
    currentChangeNumber?: number;
    forceFullUpdate?: boolean;
    appIDs?: number[];
};

export type CMsgClientAppInfoRequest = {
    apps?: {
        appId?: number;
        sectionFlags?: number;
        section_CRC?: number[];
    }[];
    supportsBatches?: boolean;
};

export type CMsgClientPICSChangesSinceRequest = {
    sinceChangeNumber?: number;
    sendAppInfoChanges?: boolean;
    sendPackageInfoChanges?: boolean;
    numAppInfoCached?: number;
    numPackageInfoCached?: number;
};

export type CMsgClientPICSChangesSinceResponse = {
    currentChangeNumber?: number;
    sinceChangeNumber?: number;
    forceFullUpdate?: boolean;
    packageChanges?: {
        packageid?: number;
        changeNumber?: number;
        needsToken?: boolean;
    }[];
    appChanges?: {
        appid?: number;
        changeNumber?: number;
        needsToken?: boolean;
    }[];
    forceFullAppUpdate?: boolean;
    forceFullPackageUpdate?: boolean;
};

export type CMsgClientPICSProductInfoRequest = {
    packages?: {
        packageid?: number;
        accessToken?: Long;
    }[];
    apps?: {
        appid?: number;
        accessToken?: Long;
        onlyPublicObsolete?: boolean;
    }[];
    metaDataOnly?: boolean;
    numPrevFailed?: number;
    OBSOLETESupportsPackageTokens?: number;
    sequenceNumber?: number;
    singleResponse?: boolean;
};

export type CMsgClientPICSProductInfoResponse = {
    apps?: {
        appid?: number;
        changeNumber?: number;
        missingToken?: boolean;
        sha?: Buffer;
        buffer?: Buffer;
        onlyPublic?: boolean;
        size?: number;
    }[];
    unknownAppids?: number[];
    packages?: {
        packageid?: number;
        changeNumber?: number;
        missingToken?: boolean;
        sha?: Buffer;
        buffer?: Buffer;
        size?: number;
    }[];
    unknownPackageids?: number[];
    metaDataOnly?: boolean;
    responsePending?: boolean;
    httpMinSize?: number;
    httpHost?: string;
};

export type CMsgClientPICSAccessTokenRequest = {
    packageids?: number[];
    appids?: number[];
};

export type CMsgClientPICSAccessTokenResponse = {
    packageAccessTokens?: {
        packageid?: number;
        accessToken?: Long;
    }[];
    packageDeniedTokens?: number[];
    appAccessTokens?: {
        appid?: number;
        accessToken?: Long;
    }[];
    appDeniedTokens?: number[];
};
