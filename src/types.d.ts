interface LooseObject {
  [key: string]: any;
}

interface LoginOptions {
  accountName: string;
  password?: string;
  machineName?: string;
  clientOsType?: number;
  shouldRememberPassword?: true;
  twoFactorCode?: string;
  loginKey?: string;
  shaSentryfile?: Buffer;
  authCode?: string;
  protocolVersion?: 65580;
  supportsRateLimitResponse?: true;
  machineId?: Buffer;
}

interface PackageInfo {
  packageid: number;
  billingtype: number;
  licensetype: number;
  appids: number[];
}

interface AppInfo {
  appid: string;
  common: {
    clienticon: string;
    icon: string;
    logo: string;
    logo_small: string;
    name: string;
    type: string;
  };
}

interface Game {
  name: string;
  appid: string;
  logo: string;
}

interface AccountAuth {
  accountName: string;
  sentry: Buffer;
  loginKey: string;
  machineName: string;
  webNonce: string;
  password: string;
}

interface AccountData {
  steamId: string;
  limited: boolean;
  vac: boolean;
  avatar: string;
  nickname: string;
  communityBanned: boolean;
  locked: boolean;
  games: Game[];
}

interface ChangeStatusOption {
  personaState?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  playerName?: string;
}

interface GamesPlayedOption extends LooseObject {
  gamesPlayed: { gameId: number }[];
}

interface RequestFreeLicenseOption extends LooseObject {
  appids: number[];
}

type sentry = Buffer;

interface CMsgProtoBufHeader {
  steamid: Long;
  clientSessionid: number;
  jobidSource: Long;
}
