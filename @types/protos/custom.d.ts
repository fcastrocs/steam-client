/**
 * Auto-generated file
 * Tue Aug 29 2023 17:49:38 GMT-0400 (Eastern Daylight Time)
 */

declare type Long = import("long");
type ValueOf<T> = T[keyof T];

type CMsgClientGamesPlayedWithDataBlob = {
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

