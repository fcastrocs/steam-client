/**
 * Auto-generated file
 * Wed May 22 2024 20:34:57 GMT-0400 (Eastern Daylight Time)
 */

import Long from "long";
import { ValueOf } from "type-fest";

export type CMsgClientAppInfoUpdate = {
	lastChangenumber?: number
	sendChangelist?: boolean
}

export type CMsgClientAppInfoChanges = {
	currentChangeNumber?: number
	forceFullUpdate?: boolean
	appIDs?: number[]
}

export type CMsgClientAppInfoRequest = {
	apps?: .CMsgClientAppInfoRequest.App[]
	supportsBatches?: boolean
}

export type CMsgClientPICSChangesSinceRequest = {
	sinceChangeNumber?: number
	sendAppInfoChanges?: boolean
	sendPackageInfoChanges?: boolean
	numAppInfoCached?: number
	numPackageInfoCached?: number
}

export type CMsgClientPICSChangesSinceResponse = {
	currentChangeNumber?: number
	sinceChangeNumber?: number
	forceFullUpdate?: boolean
	packageChanges?: .CMsgClientPICSChangesSinceResponse.PackageChange[]
	appChanges?: .CMsgClientPICSChangesSinceResponse.AppChange[]
	forceFullAppUpdate?: boolean
	forceFullPackageUpdate?: boolean
}

export type CMsgClientPICSProductInfoRequest = {
	packages?: .CMsgClientPICSProductInfoRequest.PackageInfo[]
	apps?: .CMsgClientPICSProductInfoRequest.AppInfo[]
	metaDataOnly?: boolean
	numPrevFailed?: number
	OBSOLETESupportsPackageTokens?: number
	sequenceNumber?: number
	singleResponse?: boolean
}

export type CMsgClientPICSProductInfoResponse = {
	apps?: .CMsgClientPICSProductInfoResponse.AppInfo[]
	unknownAppids?: number[]
	packages?: .CMsgClientPICSProductInfoResponse.PackageInfo[]
	unknownPackageids?: number[]
	metaDataOnly?: boolean
	responsePending?: boolean
	httpMinSize?: number
	httpHost?: string
}

export type CMsgClientPICSAccessTokenRequest = {
	packageids?: number[]
	appids?: number[]
}

export type CMsgClientPICSAccessTokenResponse = {
	packageAccessTokens?: .CMsgClientPICSAccessTokenResponse.PackageToken[]
	packageDeniedTokens?: number[]
	appAccessTokens?: .CMsgClientPICSAccessTokenResponse.AppToken[]
	appDeniedTokens?: number[]
}

