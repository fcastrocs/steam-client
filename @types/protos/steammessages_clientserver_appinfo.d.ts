/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CMsgClientAppInfoUpdate = {
	lastChangenumber?: number;
	sendChangelist?: boolean;
}

type CMsgClientAppInfoChanges = {
	currentChangeNumber?: number;
	forceFullUpdate?: boolean;
	appIDs?: number[];
}

type CMsgClientAppInfoRequest = {
	apps?: {
		appId?: number;
		sectionFlags?: number;
		section_CRC?: number[];
	}[];
	supportsBatches?: boolean;
}

type CMsgClientPICSChangesSinceRequest = {
	sinceChangeNumber?: number;
	sendAppInfoChanges?: boolean;
	sendPackageInfoChanges?: boolean;
	numAppInfoCached?: number;
	numPackageInfoCached?: number;
}

type CMsgClientPICSChangesSinceResponse = {
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
}

type CMsgClientPICSProductInfoRequest = {
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
}

type CMsgClientPICSProductInfoResponse = {
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
}

type CMsgClientPICSAccessTokenRequest = {
	packageids?: number[];
	appids?: number[];
}

type CMsgClientPICSAccessTokenResponse = {
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
}

