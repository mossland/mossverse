export const MAX_INT = 2147483647;
export const locales = ["ko", "en", "zhChs", "zhCht"] as const;
export type Locale = (typeof locales)[number];

export const adminRoles = ["manager", "admin", "superAdmin"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const adminStatuses = ["active", "inactive"] as const;
export type AdminStatus = (typeof adminStatuses)[number];

export const walletStatuses = ["active", "inactive"] as const;
export type WalletStatus = (typeof walletStatuses)[number];

export const webviewPurposes = ["default", "youtube", "image", "twitter"] as const;
export type WebviewPurpose = (typeof webviewPurposes)[number];

export const walletTypes = ["user", "operator", "root"] as const;
export type WalletType = (typeof walletTypes)[number];

export const commentStatuses = ["active", "approved", "denied", "removed", "inactive"] as const;
export type CommentStatus = (typeof commentStatuses)[number];

export const contractInterfaces = ["erc20", "erc721", "erc1155"] as const;
export type ContractInterface = (typeof contractInterfaces)[number];

export const contractStatuses = ["active", "inactive"] as const;
export type ContractStatus = (typeof contractStatuses)[number];

export const ssoTypes = ["naver", "kakao", "github", "google", "apple", "facebook"] as const;
export type SsoType = (typeof ssoTypes)[number];

export const fileStatuses = ["active", "inactive"] as const;
export type FileStatus = (typeof fileStatuses)[number];

export const keyringStatuses = ["prepare", "active", "inactive"] as const;
export type KeyringStatus = (typeof keyringStatuses)[number];

export const networkTypes = ["mainnet", "testnet", "offchain", "ganache"] as const;
export type NetworkType = (typeof networkTypes)[number];

export const networkProviders = ["ethereum", "klaytn"] as const;
export type NetworkProvider = (typeof networkProviders)[number];

export const networkStatuses = ["active", "inactive"] as const;
export type NetworkStatus = (typeof networkStatuses)[number];

export const storeOperations = ["sleep", "idle", "loading"] as const;
export type StoreOperation = (typeof storeOperations)[number];

export const surveyTypes = ["objective", "subjective"] as const;
export type SurveyType = (typeof surveyTypes)[number];

export const surveyPolicies = ["realtime", "openvote", "openprogress"] as const;
export type SurveyPolicy = (typeof surveyPolicies)[number];

export const surveyStatuses = ["active", "opened", "closed", "inactive"] as const;
export type SurveyStatus = (typeof surveyStatuses)[number];

export const thingPurposes = ["money", "item", "skin"] as const;
export type ThingPurpose = (typeof thingPurposes)[number];

export const thingStatuses = ["active", "inactive"] as const;
export type ThingStatus = (typeof thingStatuses)[number];

export const tokenPurposes = ["money", "item"] as const;
export type TokenPurpose = (typeof tokenPurposes)[number];

export const tokenStatuses = ["active", "inactive"] as const;
export type TokenStatus = (typeof tokenStatuses)[number];

export const userRoles = ["root", "admin", "user", "business", "guest"] as const;
export type UserRole = (typeof userRoles)[number];

export const profileStatuses = ["prepare", "applied", "approved", "verified", "reserved", "inactive"] as const;
export type ProfileStatus = (typeof profileStatuses)[number];

export const verifies = [...ssoTypes, "wallet", "password", "phone", "email"] as const;
export type Verify = (typeof verifies)[number];

export const userStatuses = ["active", "restricted", "inactive"] as const;
export type UserStatus = (typeof userStatuses)[number];

export const storyStatuses = ["active", "approved", "denied", "inactive"] as const;
export type StoryStatus = (typeof storyStatuses)[number];

export const defaultStatuses = ["active", "inactive"] as const;
export type DefaultStatus = (typeof defaultStatuses)[number];

export const receiptStatuses = ["active", "inProgress", "success", "failed", "inactive"] as const;
export type ReceiptStatus = (typeof receiptStatuses)[number];

export const listingStatuses = ["active", "soldout", "closed", "inactive"] as const;
export type ListingStatus = (typeof listingStatuses)[number];

export const tradePolicies = ["reversible", "once"] as const;
export type TradePolicy = (typeof tradePolicies)[number];

export const tradeStatuses = ["active", "inactive"] as const;
export type TradeStatus = (typeof tradeStatuses)[number];

export const productStatuses = ["active", "inactive"] as const;
export type ProductStatus = (typeof productStatuses)[number];

export const sellingTypes = ["limited", "unlimited"] as const;
export type SellingType = (typeof sellingTypes)[number];

export const listingTypes = ["token", "thing", "product", "currency", "gifticon", "skin"] as const;
export type ListingType = (typeof listingTypes)[number];

export const priceTagTypes = ["token", "thing"] as const;
export type PriceTagType = (typeof priceTagTypes)[number];

export const exchangeTypes = ["token", "thing", "product", "currency"] as const;
export type ExchangeType = (typeof exchangeTypes)[number];

export const receiptTypes = ["trade", "purchase", "use", "raffle", "credit", "admin", "unknown"] as const;
export type ReceiptType = (typeof receiptTypes)[number];

export const surveyFilterTypes = ["all", "active"] as const;
export type SurveyFilterType = (typeof surveyFilterTypes)[number];

export const mocWalletStatuses = ["active", "inactive", "inProgress", "reserved", "success", "failed"] as const;
export type MocWalletStatus = (typeof mocWalletStatuses)[number];

export const mocWalletTypes = ["general", "test", "root"] as const;
export type MocWalletType = (typeof mocWalletTypes)[number];

export const stockExchangeStatuses = ["active", "inactive", "inProgress", "reserved", "success", "failed"] as const;
export type StockExchangeStatus = (typeof stockExchangeStatuses)[number];

export const stockExchangeTypes = ["general", "test", "root"] as const;
export type StockExchangeType = (typeof stockExchangeTypes)[number];

export const actressStatuses = ["active", "inactive"] as const;
export type ActressStatus = (typeof actressStatuses)[number];

export const videoStatuses = ["active", "inactive"] as const;
export type VideoStatus = (typeof videoStatuses)[number];

export const boardStatuses = ["active", "inactive"] as const;
export type BoardStatus = (typeof boardStatuses)[number];

export const categoryStatuses = ["active", "inactive"] as const;
export type CategoryStatus = (typeof categoryStatuses)[number];

export const boardViewStyles = ["gallery", "list", "board", "youtube"] as const;
export type BoardViewStyle = (typeof boardViewStyles)[number];

export const boardPolicies = [
  "autoApprove",
  "private",
  "one-one",
  "noti.admin.discord",
  "noti.user.email",
  "noti.user.phone",
] as const;
export type BoardPolicy = (typeof boardPolicies)[number];

export const creatorTypes = ["user", "admin", "anonymous"] as const;
export type CreatorType = (typeof creatorTypes)[number];

export const storyPolicies = ["private", "noComment", "noSubComment"] as const;
export type StoryPolicy = (typeof storyPolicies)[number];

export const roomTypes = ["none", "video", "call"] as const;
export type RoomType = (typeof roomTypes)[number];

export const defaultSexyRate = { face: 0, body: 0, voice: 0, sexy: 0, acting: 0 } as const;
export const defaultVideoStat = { viewNum: 0, clickNum: 0, payNum: 0, commentNum: 0 } as const;
export const defaultAccessStat = { request: 0, device: 0, ip: 0, country: 0 } as const;
export const defaultStoryStat = { views: 0, likes: 0, unlikes: 0 } as const;
export const clusterStatuses = ["active", "inactive"] as const;
export type ClusterStatus = (typeof clusterStatuses)[number];

export const assetStatuses = ["active", "inactive"] as const;
export type AssetStatus = (typeof assetStatuses)[number];

export const deployStatuses = ["active", "inactive"] as const;
export type DeployStatus = (typeof deployStatuses)[number];

export const characterStatuses = ["applied", "active", "rejected", "approved", "inactive"] as const;
export type CharacterStatus = (typeof characterStatuses)[number];

export const dialogStatuses = ["active", "inactive"] as const;
export type DialogStatus = (typeof dialogStatuses)[number];

export const emojiStatuses = ["active", "inactive"] as const;
export type EmojiStatus = (typeof emojiStatuses)[number];

export const mapStatuses = ["active", "inactive"] as const;
export type MapStatus = (typeof mapStatuses)[number];

export const roleStatuses = ["active", "inactive"] as const;
export type RoleStatus = (typeof roleStatuses)[number];

export const partStatuses = ["active", "inactive"] as const;
export type PartStatus = (typeof partStatuses)[number];

export const collectStatuses = ["active", "inactive"] as const;
export type CollectStatus = (typeof collectStatuses)[number];

export const generativeStatuses = ["active", "inactive"] as const;
export type GenerativeStatus = (typeof generativeStatuses)[number];

export const mintEventStatuses = ["active", "inactive"] as const;
export type MintEventStatus = (typeof mintEventStatuses)[number];

export const mintEventPolicies = ["whitelist", "public"] as const;
export type MintEventPolicy = (typeof mintEventPolicies)[number];

export const featureStatuses = ["active", "inactive"] as const;
export type FeatureStatus = (typeof featureStatuses)[number];

export const mintLogStatuses = ["active", "inactive"] as const;
export type MintLogStatus = (typeof mintLogStatuses)[number];

export const traitDisplayTypes = ["default", "hidden"] as const;
export type TraitDisplayType = (typeof traitDisplayTypes)[number];

export const traitTypes = ["num", "text", "date"] as const;
export type TraitType = (typeof traitTypes)[number];

export const publicMerkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const linkTypes = [
  "website",
  "twitter",
  "discord",
  "telegram",
  "instagram",
  "facebook",
  "youtube",
  "github",
  "medium",
  "linkedin",
  "reddit",
  "twitch",
  "vimeo",
  "weibo",
  "wikipedia",
  "app",
  "email",
  "other",
];
export type LinkType = (typeof linkTypes)[number];

export const quillEditorFormats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "align",
  // "color",
];

export const videoTicketStatuses = ["active", "prepaid", "inactive"] as const;
export type VideoTicketStatus = (typeof videoTicketStatuses)[number];

export const videoTicketTypes = ["kollus", "cloudflare", "vdoCipher"] as const;
export type VideoTicketType = (typeof videoTicketTypes)[number];

export const currencyStatuses = ["active", "inactive"] as const;
export type CurrencyStatus = (typeof currencyStatuses)[number];

export const currencySymbols = ["KRW", "ETH", "USD"] as const;
export type CurrencySymbol = (typeof currencySymbols)[number];

export const currencyTypes = ["legal", "crypto"] as const;
export type CurrencyType = (typeof currencyTypes)[number];

export const heartCouponStatuses = ["active", "used", "expired", "inactive"] as const;
export type HeartCouponStatus = (typeof heartCouponStatuses)[number];

export const dailyRecordStatuses = ["active", "inactive"] as const;
export type DailyRecordStatus = (typeof dailyRecordStatuses)[number];

export const holdemPlaceStatuses = ["inactive", "applied", "approved", "rejected", "hidden"] as const;
export type HoldemPlaceStatus = (typeof holdemPlaceStatuses)[number];

export const holdemPlaceCategory = ["freeBuyin", "hot", "other"] as const;
export type HoldemPlaceCategory = (typeof holdemPlaceCategory)[number];

export const summaryStatuses = ["active", "archived", "inactive"] as const;
export type SummaryStatus = (typeof summaryStatuses)[number];

export const periodTypes = ["non-periodic", "active", "hourly", "daily", "weekly", "monthly"] as const;
export type PeriodType = (typeof periodTypes)[number];

export const actionLogStatuses = ["active", "inactive"] as const;
export type ActionLogStatus = (typeof actionLogStatuses)[number];

export const holdemPlaceRoles = ["admin", "player", "manager"] as const;
export type HoldemPlaceRoles = (typeof holdemPlaceRoles)[number];

export const holdemEventPromotions = ["home"] as const;
export type HoldemEventPromotion = (typeof holdemEventPromotions)[number];

export const holdemEventStatuses = ["active", "inactive", "opened", "hidden"] as const;
export type HoldemEventStatus = (typeof holdemEventStatuses)[number];

export const ownershipStatuses = ["active", "inactive"] as const;
export type OwnershipStatus = (typeof ownershipStatuses)[number];

export const ownershipTypes = ["thing", "token", "currency", "product"] as const;
export type OwnershipType = (typeof ownershipTypes)[number];

export const ownershipPurposes = ["money", "item"] as const;
export type OwnershipPurpose = (typeof ownershipPurposes)[number];

export const snapshotStatuses = ["active", "archived", "inactive"] as const;
export type SnapshotStatus = (typeof snapshotStatuses)[number];

export const rewardRequestStatuses = ["active", "inactive"] as const;
export type RewardRequestStatus = (typeof rewardRequestStatuses)[number];

export type TokenAttributeQuery = {
  ["meta.attributes.trait_type"]: string;
  ["meta.attributes.value"]: { $in: string[] };
};

export const advertiseStatuses = ["active", "biding", "inProgress", "closed", "inactive"] as const;
export type AdvertiseStatus = (typeof advertiseStatuses)[number];

export const bidStatuses = ["token", "thing", "currency"] as const;
export type BidStatus = (typeof bidStatuses)[number];

export const raffleStatuses = ["active", "raffling", "raffled", "inProgress", "closed", "inactive"] as const;
export type RaffleStatus = (typeof raffleStatuses)[number];

export const raffleTypes = ["token", "thing", "product", "currency"] as const;
export type RaffleType = (typeof raffleTypes)[number];

export const stakePoolStatuses = ["active", "inactive"] as const;
export type StakePoolStatus = (typeof stakePoolStatuses)[number];

export const stakePoolTypes = ["staking", "exchange"] as const;
export type StakePoolType = (typeof stakePoolTypes)[number];

export const holdemPlaceTypes = ["daily", "tournament"] as const;
export type HoldemPlaceType = (typeof holdemPlaceTypes)[number];

export const reportStatuses = ["active", "inProgress", "resolved", "inactive"] as const;
export type ReportStatus = (typeof reportStatuses)[number];

// kaion
export const toonStatuses = ["inactive", "applied", "approved", "rejected", "hidden"] as const;
export type ToonStatus = (typeof toonStatuses)[number];

export const examStatuses = ["inactive", "applied", "approved", "rejected", "hidden"] as const;
export type ExamStatus = (typeof examStatuses)[number];

export const studyStatuses = ["inactive", "applied", "approved", "rejected", "hidden"] as const;
export type StudyStatus = (typeof studyStatuses)[number];

export const bgImageModes = ["cover", "contain"] as const;
export type BgImageMode = (typeof bgImageModes)[number];

export const examResultStatuses = ["active", "pending", "inactive"] as const;
export type ExamResultStatus = (typeof examResultStatuses)[number];

export const problemTypes = ["oxQuiz", "multipleChoice", "trueOrFalse", "fillInTheBlank"] as const;
export type ProblemType = (typeof problemTypes)[number];

export const learnListStatuses = ["active", "tailed", "inactive"] as const;
export type LearnListStatus = (typeof learnListStatuses)[number];

export const billingStatuses = ["active", "refunded", "inactive"] as const;
export type BillingStatus = (typeof billingStatuses)[number];

export const couponStatuses = ["active", "used", "inactive"] as const;
export type CouponStatus = (typeof couponStatuses)[number];

export const roleTypes = ["student", "parent", "manager", "teacher"] as const;
export type RoleType = (typeof roleTypes)[number];

export const genderTypes = ["male", "female", "unknown"] as const;
export type GenderType = (typeof genderTypes)[number];

export const schoolTypes = ["children", "elementarySchool", "middleSchool", "highSchool"] as const;
export type SchoolType = (typeof schoolTypes)[number];

export const levelTypes = [0, 1, 2, 3, 4, 5] as const;
export type LevelType = (typeof levelTypes)[number];

export const learnTypes = ["study", "exam", "toon"] as const;
export type LearnType = (typeof learnTypes)[number];

export const consentStatuses = ["agree", "disagree"] as const;
export type ConsentStatus = (typeof reportStatuses)[number];

export const notiSettingStatuses = [
  "message",
  "sound",
  "vibrate",
  "keyword",
  "problem",
  "study",
  "friend",
  "notice",
] as const;
export type NotiSettingStatus = (typeof notiSettingStatuses)[number];

export const defaultStudyStat = { view: 0, like: 0, comment: 0 } as const;

export const courseStatuses = ["active", "inactive"] as const;
export type CourseStatus = (typeof courseStatuses)[number];

export const crawlingBoardStatuses = ["active", "inactive"] as const;
export type CrawlingBoardStatus = (typeof crawlingBoardStatuses)[number];

export const callRoomStatuses = ["active", "inactive"] as const;
export type CallRoomStatus = (typeof callRoomStatuses)[number];

export const webviewStatuses = ["active", "inactive"] as const;
export type WebviewStatus = (typeof webviewStatuses)[number];

export const placementStatuses = ["active", "inactive"] as const;
export type PlacementStatus = (typeof placementStatuses)[number];

export const collisionStatuses = ["active", "inactive"] as const;
export type CollisionStatus = (typeof collisionStatuses)[number];

export const liveStatuses = ["active", "inactive"] as const;
export type LiveStatus = (typeof liveStatuses)[number];

export const tileStatuses = ["active", "inactive"] as const;
export type TileStatus = (typeof tileStatuses)[number];

export const chatRoomStatuses = ["active", "tailed", "closed", "inactive"] as const;
export type ChatRoomStatus = (typeof chatRoomStatuses)[number];

export const notificationStatuses = ["active", "inactive"] as const;
export type NotificationStatus = (typeof notificationStatuses)[number];

export const serviceDeskStatuses = ["active", "resolved", "inactive"] as const;
export type ServiceDeskStatus = (typeof serviceDeskStatuses)[number];

export const gameTimerStatuses = ["active", "paused", "running", "inactive"] as const;
export type GameTimerStatus = (typeof gameTimerStatuses)[number];

export const competitionEventStatuses = ["active", "inactive"] as const;
export type CompetitionEventStatus = (typeof competitionEventStatuses)[number];
export const chatTypes = ["text", "image", "notice"] as const;
export type ChatType = (typeof chatTypes)[number];

export const groupCallStatuses = ["active", "closed", "inactive"] as const;
export type GroupCallStatus = (typeof groupCallStatuses)[number];

export const groupCallTypes = ["call", "video"] as const;
export type GroupCallType = (typeof groupCallTypes)[number];

export const timerStructureTypes = ["preset", "fullStructure"] as const;
export type TimerStructureType = (typeof timerStructureTypes)[number];

export const timerStructureStates = ["playing", "paused", "ended"] as const;
export type TimerStructureState = (typeof timerStructureStates)[number];

export const shipInfoStatuses = ["active", "inactive"] as const;
export type ShipInfoStatus = (typeof shipInfoStatuses)[number];

export const groupStatuses = ["active", "inactive"] as const;
export type GroupStatus = (typeof groupStatuses)[number];

export const submissionStatuses = ["active", "inactive"] as const;
export type SubmissionStatus = (typeof submissionStatuses)[number];

export const contestStatuses = ["active", "inactive"] as const;
export type ContestStatus = (typeof contestStatuses)[number];

export const contestPolicies = ["private", "noComment", "noSubComment"] as const;
export type ContestPolicy = (typeof contestPolicies)[number];

export const defaultContestStat = { view: 0, like: 0, unlike: 0, group: 0, entry: 0, comment: 0 } as const;

export const articleStatuses = ["active", "inactive"] as const;
export type ArticleStatus = (typeof articleStatuses)[number];

export const mapEditModes = ["select", "add", "modify", "option"] as const;
export type MapEditMode = (typeof mapEditModes)[number];

export const datasetStatuses = ["active", "inactive"] as const;
export type DatasetStatus = (typeof datasetStatuses)[number];

export const datasetDataTypes = ["CSV", "JSON", "SQLite", "BigQuery", "other"] as const;
export type DatasetDataType = (typeof datasetDataTypes)[number];

export const datasetLicenses = ["Creative Commons", "GPS", "Open Database", "Other"] as const;
export type DatasetLicense = (typeof datasetLicenses)[number];

export const playerStates = ["idle", "walk"] as const;
export type PlayerState = (typeof playerStates)[number];

export const playerDirections = ["left", "right", "up", "down"] as const;
export type PlayerDirection = (typeof playerDirections)[number];

export const teleportStatuses = ["active", "inactive"] as const;
export type TeleportStatus = (typeof teleportStatuses)[number];

export const epochxyUserTiers = [0, 1, 2, 3, 4]; // 초심자, 중수, 고수, 마스터, 그랜드마스터
export type EpochxyUserTier = (typeof epochxyUserTiers)[number];
