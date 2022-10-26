import { ApplicationOptions, DiscordToken } from "@shared/util-server";
export interface EnvironmentOptions {
  // dir: string;
  srv: "script" | "serve";
  env: "local" | "debug" | "develop" | "main";
}
export interface Wallet {
  address: string;
  privateKey: string;
}
export interface ObjectStorageOptions {
  service: "s3" | "minio" | "r2";
  region: string;
  accessKey: string;
  secretAccessKey: string;
  distributionId: string;
  bucket: string;
  root: string;
  host?: string;
}
export interface IpfsOptions {
  endpoint: string;
}
export interface KlaytnOptions {
  root: Wallet;
  operators: Wallet[];
  testWallets: Wallet[];
  chainId: string;
  network: "cypress" | "baobab" | "ganache";
  endpoint: string;
  websocket: string | null;
  accessKeyId: string;
  secretAccessKey: string;
  erc20: string;
  erc721: string;
  erc1155: string;
  multicall: string;
  market: string;
}

export type EtherOptions = {
  root: Wallet;
  operators: Wallet[];
  testWallets: Wallet[];
  apiKey: string;
  network: "mainnet" | "ropsten" | "rinkeby" | "ganache";
  infuraId: string;
  chainId: string;
  endpoint: string;
  websocket: string | null;
  erc20: string;
  erc721: string;
  erc1155: string;
  multicall: string;
  market: string;
};
export interface MongoOptions {
  uri: string;
  dbName: string;
  replSet?: string;
}
export interface DiscordOptions {
  tokens: DiscordToken[];
}
export interface SecurityOptions {
  aeskey: string;
  saltRounds: string;
  jwtSecret: string;
}
export interface NetworkOptions {
  klaytn?: KlaytnOptions;
  ethereum?: EtherOptions;
}
export interface StorageOptions {
  objectStorage?: ObjectStorageOptions;
  ipfs?: IpfsOptions;
}
export interface ModulesOptions extends ApplicationOptions {
  environment: EnvironmentOptions;
  security: SecurityOptions;
  mongo?: MongoOptions;
  storage?: StorageOptions;
  network?: NetworkOptions;
  discord?: DiscordOptions;
}
