export interface RedisOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
}
export interface Wallet {
  address: string;
  privateKey: string;
}
export interface KlaytnOptions {
  root: Wallet;
  operators: Wallet[];
  testWallets: Wallet[];
  chainId: string;
  network: "cypress" | "baobab" | "ganache";
  endpoint: string;
  websocket: string | null;
  erc20: string;
  erc721: string;
  erc1155: string;
  multicall: string;
  market: string;
  scanNum: number;
}

export type EtherOptions = {
  root: Wallet;
  operators: Wallet[];
  testWallets: Wallet[];
  apiKey: string;
  network: "mainnet" | "goerli" | "ganache";
  infuraId: string;
  chainId: string;
  endpoint: string;
  websocket: string | null;
  erc20: string;
  erc721: string;
  erc1155: string;
  multicall: string;
  market: string;
  tether: string;
  scanNum: number;
};
export interface ModulesOptions {
  port: number;
  globalPrefix?: string;
  redis: RedisOptions;
  klaytn: KlaytnOptions;
  ethereum: EtherOptions;
}
