export const locales = ["ko", "en", "zhChs", "zhCht"] as const;
export type Locale = typeof locales[number];

export const adminRoles = ["admin", "superAdmin", "manager"] as const;
export type AdminRole = typeof adminRoles[number];

export const adminStatuses = ["active", "inactive"] as const;
export type AdminStatus = typeof adminStatuses[number];

export const walletStatuses = ["active", "inactive"] as const;
export type WalletStatus = typeof walletStatuses[number];

export const walletTypes = ["user", "operator", "root"] as const;
export type WalletType = typeof walletTypes[number];

export const commentStatuses = ["active", "inactive"] as const;
export type CommentStatus = typeof commentStatuses[number];

export const contractInterfaces = ["erc20", "erc721", "erc1155"] as const;
export type ContractInterface = typeof contractInterfaces[number];

export const contractStatuses = ["active", "inactive"] as const;
export type ContractStatus = typeof contractStatuses[number];

export const fileStatuses = ["active", "inactive"] as const;
export type FileStatus = typeof fileStatuses[number];

export const keyringStatuses = ["active", "inactive"] as const;
export type KeyringStatus = typeof keyringStatuses[number];

export const networkTypes = ["mainnet", "testnet", "offchain", "ganache"] as const;
export type NetworkType = typeof networkTypes[number];

export const networkProviders = ["ethereum", "klaytn"] as const;
export type NetworkProvider = typeof networkProviders[number];

export const networkStatuses = ["active", "inactive"] as const;
export type NetworkStatus = typeof networkStatuses[number];

export const storeOperations = ["sleep", "idle", "loading"] as const;
export type StoreOperation = typeof storeOperations[number];

export const surveyTypes = ["objective", "subjective"] as const;
export type SurveyType = typeof surveyTypes[number];

export const surveyPolicies = ["realtime", "openvote", "openprogress"] as const;
export type SurveyPolicy = typeof surveyPolicies[number];

export const surveyStatuses = ["active", "opened", "closed", "inactive"] as const;
export type SurveyStatus = typeof surveyStatuses[number];

export const thingTypes = ["root", "general"] as const;
export type ThingType = typeof thingTypes[number];

export const thingStatuses = ["active", "inactive"] as const;
export type ThingStatus = typeof thingStatuses[number];

export const tokenTypes = ["root", "general"] as const;
export type TokenType = typeof thingTypes[number];

export const tokenStatuses = ["active", "inactive"] as const;
export type TokenStatus = typeof tokenStatuses[number];

export const userRoles = ["root", "admin", "user", "guest"] as const;
export type UserRole = typeof userRoles[number];

export const userStatuses = ["active", "inactive"] as const;
export type UserStatus = typeof userStatuses[number];

export const storyStatuses = ["active", "approved", "denied", "inactive"] as const;
export type StoryStatus = typeof storyStatuses[number];

export const defaultStatuses = ["active", "inactive"] as const;
export type DefaultStatus = typeof defaultStatuses[number];

export const receiptStatuses = ["active", "inProgress", "success", "failed", "inactive"] as const;
export type ReceiptStatus = typeof receiptStatuses[number];

export const listingStatuses = ["active", "soldout", "closed", "inactive"] as const;
export type ListingStatus = typeof listingStatuses[number];

export const tradePolicies = ["reversible", "once"] as const;
export type TradePolicy = typeof tradePolicies[number];

export const tradeStatuses = ["active", "inactive"] as const;
export type TradeStatus = typeof tradeStatuses[number];

export const productStatuses = ["active", "inactive"] as const;
export type ProductStatus = typeof productStatuses[number];

export const listingTypes = ["token", "thing", "product"] as const;
export type ListingType = typeof listingTypes[number];

export const priceTagTypes = ["token", "thing"] as const;
export type PriceTagType = typeof priceTagTypes[number];

export const exchangeTypes = ["token", "thing", "product", "currency"] as const;
export type ExchangeType = typeof exchangeTypes[number];

export const receiptTypes = ["trade", "purchase", "use", "admin", "unknown"] as const;
export type ReceiptType = typeof receiptTypes[number];

export const surveyFilterTypes = ["all", "active"] as const;
export type SurveyFilterType = typeof surveyFilterTypes[number];

export const mocWalletStatuses = ["active", "inactive", "inProgress", "reserved", "success", "failed"] as const;
export type MocWalletStatus = typeof mocWalletStatuses[number];

export const mocWalletTypes = ["general", "test", "root"] as const;
export type MocWalletType = typeof mocWalletTypes[number];

export const actressStatuses = ["active", "inactive"] as const;
export type ActressStatus = typeof actressStatuses[number];

export const videoStatuses = ["active", "inactive"] as const;
export type VideoStatus = typeof videoStatuses[number];

export const boardStatuses = ["active", "inactive"] as const;
export type BoardStatus = typeof boardStatuses[number];

export const categoryStatuses = ["active", "inactive"] as const;
export type CategoryStatus = typeof categoryStatuses[number];

export const boardViewStyles = ["gallery", "list", "board"] as const;
export type BoardViewStyle = typeof boardViewStyles[number];

export const boardPolicies = ["autoApprove", "private", "one-one"] as const;
export type BoardPolicy = typeof boardPolicies[number];

export const creatorTypes = ["user", "admin", "anonymous"] as const;
export type CreatorType = typeof creatorTypes[number];

export const storyPolicies = ["private", "noComment", "noSubComment"] as const;
export type StoryPolicy = typeof storyPolicies[number];

export const roomTypes = ["none", "video", "call"] as const;
export type RoomType = typeof roomTypes[number];

export const defaultSexyRate = { face: 0, body: 0, voice: 0, sexy: 0, acting: 0 } as const;
export const defaultVideoStat = { viewNum: 0, clickNum: 0, payNum: 0, commentNum: 0 } as const;
export const defaultAccessStat = { request: 0, device: 0, ip: 0, country: 0 } as const;
export const defaultStoryStat = { views: 0, likes: 0, unlikes: 0 } as const;
export const clusterStatuses = ["active", "inactive"] as const;
export type ClusterStatus = typeof clusterStatuses[number];

export const assetStatuses = ["active", "inactive"] as const;
export type AssetStatus = typeof assetStatuses[number];

export const deployStatuses = ["active", "inactive"] as const;
export type DeployStatus = typeof deployStatuses[number];

export const characterStatuses = ["active", "inactive"] as const;
export type CharacterStatus = typeof characterStatuses[number];

export const dialogStatuses = ["active", "inactive"] as const;
export type DialogStatus = typeof dialogStatuses[number];

export const emojiStatuses = ["active", "inactive"] as const;
export type EmojiStatus = typeof emojiStatuses[number];

export const mapStatuses = ["active", "inactive"] as const;
export type MapStatus = typeof mapStatuses[number];

export const roleStatuses = ["active", "inactive"] as const;
export type RoleStatus = typeof roleStatuses[number];

export const partStatuses = ["active", "inactive"] as const;
export type PartStatus = typeof partStatuses[number];

export const collectStatuses = ["active", "inactive"] as const;
export type CollectStatus = typeof collectStatuses[number];

export const generativeStatuses = ["active", "inactive"] as const;
export type GenerativeStatus = typeof generativeStatuses[number];

export const mintEventStatuses = ["active", "inactive"] as const;
export type MintEventStatus = typeof mintEventStatuses[number];

export const mintEventPolicies = ["whitelist", "public"] as const;
export type MintEventPolicy = typeof mintEventPolicies[number];

export const featureStatuses = ["active", "inactive"] as const;
export type FeatureStatus = typeof featureStatuses[number];

export const mintLogStatuses = ["active", "inactive"] as const;
export type MintLogStatus = typeof mintLogStatuses[number];

export const traitDisplayTypes = ["default", "hidden"] as const;
export type TraitDisplayType = typeof traitDisplayTypes[number];

export const traitTypes = ["num", "text", "date"] as const;
export type TraitType = typeof traitTypes[number];

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
export type LinkType = typeof linkTypes[number];

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
];

export const videoTicketStatuses = ["active", "prepaid", "inactive"] as const;
export type VideoTicketStatus = typeof videoTicketStatuses[number];

export const currencyStatuses = ["active", "inactive"] as const;
export type CurrencyStatus = typeof currencyStatuses[number];

export const currencySymbols = ["KRW", "ETH", "USD"] as const;
export type CurrencySymbol = typeof currencySymbols[number];

export const currencyTypes = ["legal", "crypto"] as const;
export type CurrencyType = typeof currencyTypes[number];

export const heartCouponStatuses = ["active", "used", "expired", "inactive"] as const;
export type HeartCouponStatus = typeof heartCouponStatuses[number];
