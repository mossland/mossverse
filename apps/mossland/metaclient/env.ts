type EnvType = "local" | "debug" | "develop" | "main";
export interface Env {
  environment: EnvType;
  networkType: "mainnet" | "testnet" | "ganache";
  endpoint: string;
  ws: string;
  //   klaytn: {
  //     chainId: "1001" | "8217" | "5777";
  //   };
  //   ethereum: {
  //     chainId: "1001" | "8217" | "5777";
  //   };
}
const local: Env = {
  environment: "local",
  networkType: "testnet",
  endpoint: "http://localhost:8080/graphql",
  ws: "http://localhost:8080",
} as const;
const debug: Env = {
  environment: "debug",
  networkType: "testnet",
  endpoint: "https://debugnet.mossland.backend.akamir.com/graphql",
  ws: "https://debugnet.mossland.backend.akamir.com",
} as const;
const develop: Env = {
  environment: "develop",
  networkType: "testnet",
  endpoint: "https://testnet.mossland.backend.akamir.com/graphql",
  ws: "https://testnet.mossland.backend.akamir.com",
} as const;
const main: Env = {
  environment: "main",
  networkType: "mainnet",
  endpoint: "https://mossland.backend.akamir.com/graphql",
  ws: "https://mossland.backend.akamir.com",
} as const;
const envMap = { local, debug, develop, main } as const;
export const env = envMap[(process.env.CLIENT_ENV as EnvType) ?? "debug"];
