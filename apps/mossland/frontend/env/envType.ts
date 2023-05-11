type EnvType = "testing" | "debug" | "develop" | "main";
export interface Env {
  environment: EnvType;
  networkType: "mainnet" | "testnet" | "debugnet";
  origin: string;
  endpoint: string;
  ws: string;
  klaytn: {
    chainId: "1001" | "8217" | "5777";
    marketAddr: string;
  };
  ethereum: {
    chainId: "1" | "5" | "5777";
    marketAddr: string;
  };
}
