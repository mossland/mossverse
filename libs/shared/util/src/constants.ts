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

export const receiptStatuses = ["active", "inProgress", "success", "inactive"] as const;
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

export const exchangeTypes = ["token", "thing", "product", "etc"] as const;
export type ExchangeType = typeof exchangeTypes[number];

export const receiptTypes = ["trade", "purchase", "use", "admin", "unknown"] as const;
export type ReceiptType = typeof receiptTypes[number];

export const surveyFilterTypes = ["all", "active"] as const;
export type SurveyFilterTypes = typeof surveyFilterTypes[number];

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
