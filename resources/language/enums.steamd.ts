/* eslint-disable import/prefer-default-export */
/**
 * Auto-generated file
 * Wed May 22 2024 21:59:03 GMT-0400 (Eastern Daylight Time)
 */

export enum EUniverse {
    Invalid = 0,
    Public = 1,
    Beta = 2,
    Internal = 3,
    Dev = 4
}

export enum EChatEntryType {
    Invalid = 0,
    ChatMsg = 1,
    Typing = 2,
    InviteGame = 3,
    LeftConversation = 6,
    Entered = 7,
    WasKicked = 8,
    WasBanned = 9,
    Disconnected = 10,
    HistoricalChat = 11,
    Reserved1 = 12,
    Reserved2 = 13,
    LinkBlocked = 14
}

export enum EPersonaState {
    Offline = 0,
    Online = 1,
    Busy = 2,
    Away = 3,
    Snooze = 4,
    LookingToTrade = 5,
    LookingToPlay = 6,
    Invisible = 7
}

export enum EAccountType {
    Invalid = 0,
    Individual = 1,
    Multiseat = 2,
    GameServer = 3,
    AnonGameServer = 4,
    Pending = 5,
    ContentServer = 6,
    Clan = 7,
    Chat = 8,
    ConsoleUser = 9,
    AnonUser = 10
}

export enum EFriendRelationship {
    None = 0,
    Blocked = 1,
    RequestRecipient = 2,
    Friend = 3,
    RequestInitiator = 4,
    Ignored = 5,
    IgnoredFriend = 6
}

export enum EAccountFlags {
    NormalUser = 0,
    PersonaNameSet = 1,
    Unbannable = 2,
    PasswordSet = 4,
    Support = 8,
    Admin = 16,
    Supervisor = 32,
    AppEditor = 64,
    HWIDSet = 128,
    PersonalQASet = 256,
    VacBeta = 512,
    Debug = 1024,
    Disabled = 2048,
    LimitedUser = 4096,
    LimitedUserForce = 8192,
    EmailValidated = 16384,
    MarketingTreatment = 32768,
    OGGInviteOptOut = 65536,
    ForcePasswordChange = 131072,
    ForceEmailVerification = 262144,
    LogonExtraSecurity = 524288,
    LogonExtraSecurityDisabled = 1048576,
    Steam2MigrationComplete = 2097152,
    NeedLogs = 4194304,
    Lockdown = 8388608,
    MasterAppEditor = 16777216,
    BannedFromWebAPI = 33554432,
    PartnerMember = 67108864,
    GlobalModerator = 134217728,
    ParentalSettings = 268435456,
    ThirdPartySupport = 536870912,
    NeedsSSANextSteamLogon = 1073741824
}

export enum EClanPermission {
    Nobody = 0,
    Owner = 1,
    Officer = 2,
    OwnerAndOfficer = 3,
    Member = 4,
    Moderator = 8,
    OGGGameOwner = 16,
    NonMember = 128
}

export enum EChatPermission {
    Close = 1,
    Invite = 2,
    Talk = 8,
    Kick = 16,
    Mute = 32,
    SetMetadata = 64,
    ChangePermissions = 128,
    Ban = 256,
    ChangeAccess = 512,
    Mask = 1019
}

export enum EFriendFlags {
    None = 0,
    Blocked = 1,
    FriendshipRequested = 2,
    Immediate = 4,
    ClanMember = 8,
    OnGameServer = 16,
    RequestingFriendship = 128,
    RequestingInfo = 256,
    Ignored = 512,
    IgnoredFriend = 1024,
    Suggested = 2048,
    ChatMember = 4096,
    FlagAll = 65535
}

export enum EAppUsageEvent {
    GameLaunch = 1,
    GameLaunchTrial = 2,
    Media = 3,
    PreloadStart = 4,
    PreloadFinish = 5,
    MarketingMessageView = 6,
    InGameAdViewed = 7,
    GameLaunchFreeWeekend = 8
}

export enum ELicenseFlags {
    None = 0
}

export enum ELicenseType {
    NoLicense = 0,
    SinglePurchase = 1,
    SinglePurchaseLimitedUse = 2,
    RecurringCharge = 3,
    RecurringChargeLimitedUse = 4,
    RecurringChargeLimitedUseWithOverages = 5,
    RecurringOption = 6,
    LimitedUseDelayedActivation = 7
}

export enum EPaymentMethod {
    None = 0,
    ActivationCode = 1,
    CreditCard = 2,
    Giropay = 3,
    PayPal = 4,
    Ideal = 5,
    PaySafeCard = 6,
    Sofort = 7,
    GuestPass = 8,
    WebMoney = 9,
    MoneyBookers = 10,
    AliPay = 11,
    Yandex = 12,
    Kiosk = 13,
    Qiwi = 14,
    GameStop = 15,
    HardwarePromo = 16,
    MoPay = 17,
    BoletoBancario = 18,
    BoaCompraGold = 19,
    BancoDoBrasilOnline = 20,
    ItauOnline = 21,
    BradescoOnline = 22,
    Pagseguro = 23,
    VisaBrazil = 24,
    AmexBrazil = 25,
    Aura = 26,
    Hipercard = 27,
    MastercardBrazil = 28,
    DinersCardBrazil = 29,
    AuthorizedDevice = 30,
    MOLPoints = 31,
    ClickAndBuy = 32,
    Beeline = 33,
    Konbini = 34,
    EClubPoints = 35,
    CreditCardJapan = 36,
    BankTransferJapan = 37,
    PayEasy = 38,
    Zong = 39,
    CultureVoucher = 40,
    BookVoucher = 41,
    HappymoneyVoucher = 42,
    ConvenientStoreVoucher = 43,
    GameVoucher = 44,
    Multibanco = 45,
    Payshop = 46,
    MaestroBoaCompra = 47,
    OXXO = 48,
    ToditoCash = 49,
    Carnet = 50,
    SPEI = 51,
    ThreePay = 52,
    IsBank = 53,
    Garanti = 54,
    Akbank = 55,
    YapiKredi = 56,
    Halkbank = 57,
    BankAsya = 58,
    Finansbank = 59,
    DenizBank = 60,
    PTT = 61,
    CashU = 62,
    SantanderRio = 63,
    AutoGrant = 64,
    WebMoneyJapan = 65,
    OneCard = 66,
    PSE = 67,
    Exito = 68,
    Efecty = 69,
    Paloto = 70,
    PinValidda = 71,
    MangirKart = 72,
    BancoCreditoDePeru = 73,
    BBVAContinental = 74,
    SafetyPay = 75,
    PagoEfectivo = 76,
    Trustly = 77,
    UnionPay = 78,
    BitCoin = 79,
    LicensedSite = 80,
    BitCash = 81,
    NetCash = 82,
    Nanaco = 83,
    Tenpay = 84,
    WeChat = 85,
    CashonDelivery = 86,
    CreditCardNodwin = 87,
    DebitCardNodwin = 88,
    NetBankingNodwin = 89,
    CashCardNodwin = 90,
    WalletNodwin = 91,
    MobileDegica = 92,
    Naranja = 93,
    Cencosud = 94,
    Cabal = 95,
    PagoFacil = 96,
    Rapipago = 97,
    BancoNacionaldeCostaRica = 98,
    BancoPoplar = 99,
    RedPagos = 100,
    SPE = 101,
    Multicaja = 102,
    RedCompra = 103,
    ZiraatBank = 104,
    VakiflarBank = 105,
    KuveytTurkBank = 106,
    EkonomiBank = 107,
    Pichincha = 108,
    PichinchaCash = 109,
    Przelewy24 = 110,
    Trustpay = 111,
    POLi = 112,
    MercadoPago = 113,
    PayU = 114,
    VTCPayWallet = 115,
    MrCash = 116,
    EPS = 117,
    Interac = 118,
    VTCPayCards = 119,
    VTCPayOnlineBanking = 120,
    VisaElectronBoaCompra = 121,
    CafeFunded = 122,
    OCA = 123,
    Lider = 124,
    WebMoneySteamCardJapan = 125,
    WebMoneySteamCardTopUpJapan = 126,
    Toss = 127,
    Wallet = 128,
    Valve = 129,
    MasterComp = 130,
    Promotional = 131,
    MasterSubscription = 134,
    Payco = 135,
    MobileWalletJapan = 136,
    BoletoFlash = 137,
    PIX = 138,
    GCash = 139,
    KakaoPay = 140,
    Dana = 141,
    TrueMoney = 142,
    TouchnGo = 143,
    LinePay = 144,
    MerPay = 145,
    PayPay = 146,
    AlfaClick = 147,
    Sberbank = 148,
    YooMoney = 149,
    Tinkoff = 150,
    CashInCIS = 151,
    AuPAY = 152,
    AliPayHK = 153,
    NaverPay = 154,
    Linkaja = 155,
    ShopeePay = 156,
    GrabPay = 157,
    PayNow = 158,
    OnlineBankingThailand = 159,
    CashOptionsThailand = 160,
    OEMTicket = 256,
    Split = 512,
    Complimentary = 1024,
    FamilyGroup = 1025
}

export enum EPurchaseResultDetail {
    NoDetail = 0,
    AVSFailure = 1,
    InsufficientFunds = 2,
    ContactSupport = 3,
    Timeout = 4,
    InvalidPackage = 5,
    InvalidPaymentMethod = 6,
    InvalidData = 7,
    OthersInProgress = 8,
    AlreadyPurchased = 9,
    WrongPrice = 10,
    FraudCheckFailed = 11,
    CancelledByUser = 12,
    RestrictedCountry = 13,
    BadActivationCode = 14,
    DuplicateActivationCode = 15,
    UseOtherPaymentMethod = 16,
    UseOtherFunctionSource = 17,
    InvalidShippingAddress = 18,
    RegionNotSupported = 19,
    AcctIsBlocked = 20,
    AcctNotVerified = 21,
    InvalidAccount = 22,
    StoreBillingCountryMismatch = 23,
    DoesNotOwnRequiredApp = 24,
    CanceledByNewTransaction = 25,
    ForceCanceledPending = 26,
    FailCurrencyTransProvider = 27,
    FailedCyberCafe = 28,
    NeedsPreApproval = 29,
    PreApprovalDenied = 30,
    WalletCurrencyMismatch = 31,
    EmailNotValidated = 32,
    ExpiredCard = 33,
    TransactionExpired = 34,
    WouldExceedMaxWallet = 35,
    MustLoginPS3AppForPurchase = 36,
    CannotShipToPOBox = 37,
    InsufficientInventory = 38,
    CannotGiftShippedGoods = 39,
    CannotShipInternationally = 40,
    BillingAgreementCancelled = 41,
    InvalidCoupon = 42,
    ExpiredCoupon = 43,
    AccountLocked = 44,
    OtherAbortableInProgress = 45,
    ExceededSteamLimit = 46,
    OverlappingPackagesInCart = 47,
    NoWallet = 48,
    NoCachedPaymentMethod = 49,
    CannotRedeemCodeFromClient = 50,
    PurchaseAmountNoSupportedByProvider = 51,
    OverlappingPackagesInPendingTransaction = 52,
    RateLimited = 53,
    OwnsExcludedApp = 54,
    CreditCardBinMismatchesType = 55,
    CartValueTooHigh = 56,
    BillingAgreementAlreadyExists = 57,
    POSACodeNotActivated = 58,
    CannotShipToCountry = 59,
    HungTransactionCancelled = 60,
    PaypalInternalError = 61,
    UnknownGlobalCollectError = 62,
    InvalidTaxAddress = 63,
    PhysicalProductLimitExceeded = 64,
    PurchaseCannotBeReplayed = 65,
    DelayedCompletion = 66,
    BundleTypeCannotBeGifted = 67,
    BlockedByUSGov = 68,
    ItemsReservedForCommercialUse = 69,
    GiftAlreadyOwned = 70,
    GiftInvalidForRecipientRegion = 71,
    GiftPricingImbalance = 72,
    GiftRecipientNotSpecified = 73,
    ItemsNotAllowedForCommercialUse = 74,
    BusinessStoreCountryCodeMismatch = 75,
    UserAssociatedWithManyCafes = 76,
    UserNotAssociatedWithCafe = 77,
    AddressInvalid = 78,
    CreditCardNumberInvalid = 79,
    CannotShipToMilitaryPostOffice = 80,
    BillingNameInvalidResemblesCreditCard = 81,
    PaymentMethodTemporarilyUnavailable = 82,
    PaymentMethodNotSupportedForProduct = 83
}

export enum EIntroducerRouting {
    P2PVoiceChat = 1,
    P2PNetworking = 2
}

export enum EServerFlags {
    None = 0,
    Active = 1,
    Secure = 2,
    Dedicated = 4,
    Linux = 8,
    Passworded = 16,
    Private = 32
}

export enum EDenyReason {
    InvalidVersion = 1,
    Generic = 2,
    NotLoggedOn = 3,
    NoLicense = 4,
    Cheater = 5,
    LoggedInElseWhere = 6,
    UnknownText = 7,
    IncompatibleAnticheat = 8,
    MemoryCorruption = 9,
    IncompatibleSoftware = 10,
    SteamConnectionLost = 11,
    SteamConnectionError = 12,
    SteamResponseTimedOut = 13,
    SteamValidationStalled = 14,
    SteamOwnerLeftGuestUser = 15
}

export enum EClanRank {
    None = 0,
    Owner = 1,
    Officer = 2,
    Member = 3,
    Moderator = 4
}

export enum EClanRelationship {
    None = 0,
    Blocked = 1,
    Invited = 2,
    Member = 3,
    Kicked = 4,
    KickAcknowledged = 5,
    PendingApproval = 6,
    RequestDenied = 7
}

export enum EAuthSessionResponse {
    OK = 0,
    UserNotConnectedToSteam = 1,
    NoLicenseOrExpired = 2,
    VACBanned = 3,
    LoggedInElseWhere = 4,
    VACCheckTimedOut = 5,
    AuthTicketCanceled = 6,
    AuthTicketInvalidAlreadyUsed = 7,
    AuthTicketInvalid = 8,
    PublisherIssuedBan = 9
}

export enum EChatRoomEnterResponse {
    Success = 1,
    DoesntExist = 2,
    NotAllowed = 3,
    Full = 4,
    Error = 5,
    Banned = 6,
    Limited = 7,
    ClanDisabled = 8,
    CommunityBan = 9,
    MemberBlockedYou = 10,
    YouBlockedMember = 11
}

export enum EChatRoomType {
    Friend = 1,
    MUC = 2,
    Lobby = 3
}

export enum EChatInfoType {
    StateChange = 1,
    InfoUpdate = 2,
    MemberLimitChange = 3
}

export enum EChatAction {
    InviteChat = 1,
    Kick = 2,
    Ban = 3,
    UnBan = 4,
    StartVoiceSpeak = 5,
    EndVoiceSpeak = 6,
    LockChat = 7,
    UnlockChat = 8,
    CloseChat = 9,
    SetJoinable = 10,
    SetUnjoinable = 11,
    SetOwner = 12,
    SetInvisibleToFriends = 13,
    SetVisibleToFriends = 14,
    SetModerated = 15,
    SetUnmoderated = 16
}

export enum EChatActionResult {
    Success = 1,
    Error = 2,
    NotPermitted = 3,
    NotAllowedOnClanMember = 4,
    NotAllowedOnBannedUser = 5,
    NotAllowedOnChatOwner = 6,
    NotAllowedOnSelf = 7,
    ChatDoesntExist = 8,
    ChatFull = 9,
    VoiceSlotsFull = 10
}

export enum EAppInfoSection {
    Unknown = 0,
    All = 1,
    First = 2,
    Common = 2,
    Extended = 3,
    Config = 4,
    Stats = 5,
    Install = 6,
    Depots = 7,
    UFS = 10,
    OGG = 11,
    Policies = 13,
    SysReqs = 14,
    Community = 15,
    Store = 16,
    Localization = 17,
    Broadcastgamedata = 18,
    Computed = 19,
    Albummetadata = 20
}

export enum EContentDownloadSourceType {
    Invalid = 0,
    CS = 1,
    CDN = 2,
    LCS = 3,
    ProxyCache = 4,
    LANPeer = 5,
    SLS = 6,
    SteamCache = 7,
    OpenCache = 8,
    LANCache = 9
}

export enum EPlatformType {
    Unknown = 0,
    Win32 = 1,
    Win64 = 2,
    Linux64 = 3,
    OSX = 4,
    PS3 = 5,
    Linux32 = 6
}

export enum EOSType {
    WinUnknown = 0,
    Win311 = 1,
    Win95 = 2,
    Win98 = 3,
    WinME = 4,
    WinNT = 5,
    Win2000 = 6,
    WinXP = 7,
    Win2003 = 8,
    WinVista = 9,
    Windows7 = 10,
    Win2008 = 11,
    Win2012 = 12,
    Windows8 = 13,
    Windows81 = 14,
    Win2012R2 = 15,
    Windows10 = 16,
    Win2016 = 17,
    Win2019 = 18,
    Win2022 = 19,
    Win11 = 20,
    WinMAX = 21
}

export enum EServerType {
    First = 0,
    Shell = 0,
    GM = 1,
    AM = 3,
    BS = 4,
    VS = 5,
    ATS = 6,
    CM = 7,
    FBS = 8,
    BoxMonitor = 9,
    SS = 10,
    DRMS = 11,
    Console = 13,
    PICS = 14,
    ContentStats = 16,
    DP = 17,
    WG = 18,
    SM = 19,
    SLC = 20,
    UFS = 21,
    Community = 24,
    AppInformation = 26,
    Spare = 27,
    FTS = 28,
    SiteLicense = 29,
    PS = 30,
    IS = 31,
    CCS = 32,
    DFS = 33,
    LBS = 34,
    MDS = 35,
    CS = 36,
    GC = 37,
    NS = 38,
    OGS = 39,
    WebAPI = 40,
    UDS = 41,
    MMS = 42,
    GMS = 43,
    KGS = 44,
    UCM = 45,
    RM = 46,
    FS = 47,
    Econ = 48,
    Backpack = 49,
    UGS = 50,
    StoreFeature = 51,
    MoneyStats = 52,
    CRE = 53,
    UMQ = 54,
    Workshop = 55,
    BRP = 56,
    GCH = 57,
    MPAS = 58,
    Trade = 59,
    Secrets = 60,
    Logsink = 61,
    Market = 62,
    Quest = 63,
    WDS = 64,
    ACS = 65,
    PNP = 66,
    TaxForm = 67,
    ExternalMonitor = 68,
    Parental = 69,
    PartnerUpload = 70,
    Partner = 71,
    ES = 72,
    DepotWebContent = 73,
    ExternalConfig = 74,
    GameNotifications = 75,
    MarketRepl = 76,
    MarketSearch = 77,
    Localization = 78,
    Steam2Emulator = 79,
    PublicTest = 80,
    SolrMgr = 81,
    BroadcastIngestor = 82,
    BroadcastDirectory = 83,
    VideoManager = 84,
    TradeOffer = 85,
    BroadcastChat = 86,
    Phone = 87,
    AccountScore = 88,
    Support = 89,
    LogRequest = 90,
    LogWorker = 91,
    EmailDelivery = 92,
    InventoryManagement = 93,
    Auth = 94,
    StoreCatalog = 95,
    HLTVRelay = 96,
    IDLS = 97,
    Perf = 98,
    ItemInventory = 99,
    Watchdog = 100,
    AccountHistory = 101,
    Chat = 102,
    Shader = 103,
    AccountHardware = 104,
    WebRTC = 105,
    Giveaway = 106,
    ChatRoom = 107,
    VoiceChat = 108,
    QMS = 109,
    Trust = 110,
    TimeMachine = 111,
    VACDBMaster = 112,
    ContentServerConfig = 113,
    Minigame = 114,
    MLTrain = 115,
    VACTest = 116,
    TaxService = 117,
    MLInference = 118,
    UGSAggregate = 119,
    TURN = 120,
    RemoteClient = 121,
    BroadcastOrigin = 122,
    BroadcastChannel = 123,
    SteamAR = 124,
    China = 125,
    CrashDump = 126
}

export enum EBillingType {
    NoCost = 0,
    BillOnceOnly = 1,
    BillMonthly = 2,
    ProofOfPrepurchaseOnly = 3,
    GuestPass = 4,
    HardwarePromo = 5,
    Gift = 6,
    AutoGrant = 7,
    OEMTicket = 8,
    RecurringOption = 9,
    BillOnceOrCDKey = 10,
    Repurchaseable = 11,
    FreeOnDemand = 12,
    Rental = 13,
    CommercialLicense = 14,
    FreeCommercialLicense = 15,
    NumBillingTypes = 16
}

export enum EPackageStatus {
    Available = 0,
    Preorder = 1,
    Unavailable = 2,
    Invalid = 3
}

export enum EActivationCodeClass {
    WonCDKey = 0,
    ValveCDKey = 1,
    Doom3CDKey = 2,
    DBLookup = 3,
    Steam2010Key = 4,
    Max = 5,
    Test = 2147483647,
    Invalid = 4294967295
}

export enum EChatMemberStateChange {}

export enum ERegionCode {}

export enum ECurrencyCode {
    Invalid = 0,
    USD = 1,
    GBP = 2,
    EUR = 3,
    CHF = 4,
    RUB = 5,
    PLN = 6,
    BRL = 7,
    JPY = 8,
    NOK = 9,
    IDR = 10,
    MYR = 11,
    PHP = 12,
    SGD = 13,
    THB = 14,
    VND = 15,
    KRW = 16,
    TRY = 17,
    UAH = 18,
    MXN = 19,
    CAD = 20,
    AUD = 21,
    NZD = 22,
    CNY = 23,
    INR = 24,
    CLP = 25,
    PEN = 26,
    COP = 27,
    ZAR = 28,
    HKD = 29,
    TWD = 30,
    SAR = 31,
    AED = 32,
    ARS = 34,
    ILS = 35,
    BYN = 36,
    KZT = 37,
    KWD = 38,
    QAR = 39,
    CRC = 40,
    UYU = 41,
    BGN = 42,
    HRK = 43,
    CZK = 44,
    DKK = 45,
    HUF = 46,
    RON = 47
}

export enum EDepotFileFlag {
    UserConfig = 1,
    VersionedUserConfig = 2,
    Encrypted = 4,
    ReadOnly = 8,
    Hidden = 16,
    Executable = 32,
    Directory = 64,
    CustomExecutable = 128,
    InstallScript = 256,
    Symlink = 512
}

export enum EWorkshopEnumerationType {
    RankedByVote = 0,
    Recent = 1,
    Trending = 2,
    FavoriteOfFriends = 3,
    VotedByFriends = 4,
    ContentByFriends = 5,
    RecentFromFollowedUsers = 6
}

export enum EPublishedFileVisibility {
    Public = 0,
    FriendsOnly = 1,
    Private = 2,
    Unlisted = 3
}

export enum EWorkshopFileType {
    First = 0,
    Community = 0,
    Microtransaction = 1,
    Collection = 2,
    Art = 3,
    Video = 4,
    Screenshot = 5,
    Game = 6,
    Software = 7,
    Concept = 8,
    WebGuide = 9,
    IntegratedGuide = 10,
    Merch = 11,
    ControllerBinding = 12,
    SteamworksAccessInvite = 13,
    SteamVideo = 14,
    GameManagedItem = 15,
    Clip = 16
}

export enum EWorkshopFileAction {
    Played = 0,
    Completed = 1
}

export enum EEconTradeResponse {
    Accepted = 0,
    Declined = 1,
    TradeBannedInitiator = 2,
    TradeBannedTarget = 3,
    TargetAlreadyTrading = 4,
    Disabled = 5,
    NotLoggedIn = 6,
    Cancel = 7,
    TooSoon = 8,
    TooSoonPenalty = 9,
    ConnectionFailed = 10,
    AlreadyTrading = 11,
    AlreadyHasTradeRequest = 12,
    NoResponse = 13,
    CyberCafeInitiator = 14,
    CyberCafeTarget = 15,
    SchoolLabInitiator = 16,
    SchoolLabTarget = 16,
    InitiatorBlockedTarget = 18,
    InitiatorNeedsVerifiedEmail = 20,
    InitiatorNeedsSteamGuard = 21,
    TargetAccountCannotTrade = 22,
    InitiatorSteamGuardDuration = 23,
    InitiatorPasswordResetProbation = 24,
    InitiatorNewDeviceCooldown = 25,
    InitiatorSentInvalidCookie = 26,
    NeedsEmailConfirmation = 27,
    InitiatorRecentEmailChange = 28,
    NeedsMobileConfirmation = 29,
    TradingHoldForClearedTradeOffersInitiator = 30,
    WouldExceedMaxAssetCount = 31,
    DisabledInRegion = 32,
    DisabledInPartnerRegion = 33,
    OKToDeliver = 50
}

export enum EMarketingMessageFlags {
    None = 0,
    HighPriority = 1,
    PlatformWindows = 2,
    PlatformMac = 4,
    PlatformLinux = 8
}

export enum ENewsUpdateType {
    AppNews = 0,
    SteamAds = 1,
    SteamNews = 2,
    CDDBUpdate = 3,
    ClientUpdate = 4
}

export enum ESystemIMType {
    RawText = 0,
    InvalidCard = 1,
    RecurringPurchaseFailed = 2,
    CardWillExpire = 3,
    SubscriptionExpired = 4,
    GuestPassReceived = 5,
    GuestPassGranted = 6,
    GiftRevoked = 7,
    SupportMessage = 8,
    SupportMessageClearAlert = 9
}

export enum EChatFlags {
    Locked = 1,
    InvisibleToFriends = 2,
    Moderated = 4,
    Unjoinable = 8
}

export enum ERemoteStoragePlatform {
    None = 0,
    Windows = 1,
    OSX = 2,
    PS3 = 4,
    Linux = 8,
    Switch = 16,
    Android = 32,
    IPhoneOS = 64
}

export enum EDRMBlobDownloadType {
    Error = 0,
    File = 1,
    Parts = 2,
    Compressed = 4,
    AllMask = 7,
    IsJob = 8,
    HighPriority = 16,
    AddTimestamp = 32,
    LowPriority = 64
}

export enum EDRMBlobDownloadErrorDetail {
    None = 0,
    DownloadFailed = 1,
    TargetLocked = 2,
    OpenZip = 3,
    ReadZipDirectory = 4,
    UnexpectedZipEntry = 5,
    UnzipFullFile = 6,
    UnknownBlobType = 7,
    UnzipStrips = 8,
    UnzipMergeGuid = 9,
    UnzipSignature = 10,
    ApplyStrips = 11,
    ApplyMergeGuid = 12,
    ApplySignature = 13,
    AppIdMismatch = 14,
    AppIdUnexpected = 15,
    AppliedSignatureCorrupt = 16,
    ApplyValveSignatureHeader = 17,
    UnzipValveSignatureHeader = 18,
    PathManipulationError = 19,
    TargetLocked_Base = 65536,
    TargetLocked_Max = 131071,
    NextBase = 131072
}

export enum EClientStat {
    P2PConnectionsUDP = 0,
    P2PConnectionsRelay = 1,
    P2PGameConnections = 2,
    P2PVoiceConnections = 3,
    BytesDownloaded = 4
}

export enum EClientStatAggregateMethod {
    LatestOnly = 0,
    Sum = 1,
    Event = 2,
    Scalar = 3
}

export enum ELeaderboardDataRequest {
    Global = 0,
    GlobalAroundUser = 1,
    Friends = 2,
    Users = 3
}

export enum ELeaderboardSortMethod {
    None = 0,
    Ascending = 1,
    Descending = 2
}

export enum ELeaderboardDisplayType {
    None = 0,
    Numeric = 1,
    TimeSeconds = 2,
    TimeMilliSeconds = 3
}

export enum ELeaderboardUploadScoreMethod {
    None = 0,
    KeepBest = 1,
    ForceUpdate = 2
}

export enum EUCMFilePrivacyState {
    Private = 2,
    FriendsOnly = 4,
    Public = 8,
    Unlisted = 16
}

export enum EDisplayStatus {
    Invalid = 0,
    Launching = 1,
    Uninstalling = 2,
    Installing = 3,
    Running = 4,
    Validating = 5,
    Updating = 6,
    Downloading = 7,
    Synchronizing = 8,
    ReadyToInstall = 9,
    ReadyToPreload = 10,
    ReadyToLaunch = 11,
    RegionRestricted = 12,
    PresaleOnly = 13,
    InvalidPlatform = 14,
    ParentalBlocked = 15,
    PreloadOnly = 16,
    BorrowerLocked = 17,
    UpdatePaused = 18,
    UpdateQueued = 19,
    UpdateRequired = 20,
    UpdateDisabled = 21,
    DownloadPaused = 22,
    DownloadQueued = 23,
    DownloadRequired = 24,
    DownloadDisabled = 25,
    LicensePending = 26,
    LicenseExpired = 27,
    AvailForFree = 28,
    AvailToBorrow = 29,
    AvailGuestPass = 30,
    Purchase = 31,
    Unavailable = 32,
    NotLaunchable = 33,
    CloudError = 34,
    CloudOutOfDate = 35,
    Terminating = 36
}

export enum EAppType {
    Invalid = 0,
    Game = 1,
    Application = 2,
    Tool = 4,
    Demo = 8,
    Deprected = 16,
    DLC = 32,
    Guide = 64,
    Driver = 128,
    Config = 256,
    Hardware = 512,
    Franchise = 1024,
    Video = 2048,
    Plugin = 4096,
    Music = 8192,
    Series = 16384,
    Comic = 32768,
    Beta = 65536,
    Shortcut = 1073741824
}

export enum EChatRoomGroupType {
    Default = 0,
    Unmoderated = 1
}

export enum EChatroomNotificationLevel {
    Invalid = 0,
    None = 1,
    MentionMe = 2,
    MentionAll = 3,
    AllMessages = 4
}

export enum EChatRoomMemberStateChange {
    Invalid = 0,
    Joined = 1,
    Parted = 2,
    Kicked = 3,
    Invited = 4,
    RankChanged = 7,
    InviteDismissed = 8,
    Muted = 9,
    Banned = 10,
    RolesChanged = 12
}

export enum EChatRoomServerMsg {
    Invalid = 0,
    RenameChatRoom = 1,
    Joined = 2,
    Parted = 3,
    Kicked = 4,
    Invited = 5,
    InviteDismissed = 8,
    ChatRoomTaglineChanged = 9,
    ChatRoomAvatarChanged = 10,
    AppCustom = 11
}

export enum EChatRoomGroupRank {
    Default = 0,
    Viewer = 10,
    Guest = 15,
    Member = 20,
    Moderator = 30,
    Officer = 40,
    Owner = 50,
    TestInvalid = 99
}

export enum EChatRoomGroupPermissions {
    Default = 0,
    Valid = 1,
    CanInvite = 2,
    CanKick = 4,
    CanBan = 8,
    CanAdminChannel = 16
}

export enum EChatRoomGroupAction {
    Default = 0,
    CreateRenameDeleteChannel = 1,
    Kick = 2,
    Ban = 3,
    Invite = 4,
    ChangeTaglineAvatarName = 5,
    Chat = 6,
    ViewHistory = 7,
    ChangeGroupRoles = 8,
    ChangeUserRoles = 9,
    MentionAll = 10,
    SetWatchingBroadcast = 11
}

export enum EChatRoomJoinState {
    Default = 0,
    None = 1,
    Joined = 2,
    TestInvalid = 99
}

export enum EVoiceCallState {
    None = 0,
    ScheduledInitiate = 1,
    RequestedMicAccess = 2,
    LocalMicOnly = 3,
    CreatePeerConnection = 4,
    InitatedWebRTCSession = 5,
    WebRTCConnectedWaitingOnIceConnected = 6,
    RequestedPermission = 7,
    NotifyingVoiceChatOfWebRTCSession = 8,
    Connected = 9
}

export enum ETradeOfferState {
    Invalid = 1,
    Active = 2,
    Accepted = 3,
    Countered = 4,
    Expired = 5,
    Canceled = 6,
    Declined = 7,
    InvalidItems = 8,
    CreatedNeedsConfirmation = 9,
    CanceledBySecondFactor = 10,
    InEscrow = 11
}

export enum ETradeOfferConfirmationMethod {
    Invalid = 0,
    Email = 1,
    MobileApp = 2
}

export enum ELobbyType {
    Private = 0,
    FriendsOnly = 1,
    Public = 2,
    Invisible = 3,
    PrivateUnique = 4
}

export enum ELobbyFilterType {
    String = 0,
    Numerical = 1,
    SlotsAvailable = 2,
    NearValue = 3,
    Distance = 4
}

export enum ELobbyComparison {
    Equal = 0,
    GreaterThan = 1,
    EqualToOrGreaterThan = 2,
    NotEqual = 3
}

export enum ELobbyDistanceFilter {
    Close = 0,
    Default = 1,
    Far = 2,
    Worldwide = 3
}

export enum ESteamIPv6ConnectivityProtocol {
    Invalid = 0,
    Http = 1,
    Udp = 2
}

export enum ESteamIPv6ConnectivityState {
    Unknown = 0,
    Good = 1,
    Bad = 2
}

export enum ESteamRealm {
    Unknown = 0,
    SteamGlobal = 1,
    SteamChina = 2
}

export enum ELauncherType {
    Default = 0,
    PerfectWorld = 1,
    Nexon = 2,
    CmdLine = 3,
    CSGO = 4,
    ClientUI = 5,
    Headless = 6,
    SteamChina = 7,
    SingleApp = 8,
    GameServer = 9
}
