type EnvType = "local" | "debug" | "develop" | "main";
export interface Env {
  environment: EnvType;
  networkType: "mainnet" | "testnet" | "debugnet";
  endpoint: string;
  ws: string;
  klaytn: {
    chainId: "1001" | "8217" | "5777";
    marketAddr: string;
  };
  //   ethereum: {
  //     chainId: "1001" | "8217" | "5777";
  //   };
}
const local: Env = {
  environment: "local",
  networkType: "testnet",
  endpoint: "http://localhost:8080/graphql",
  ws: "http://localhost:8080",
  klaytn: {
    chainId: "5777",
    marketAddr: "",
  },
} as const;
const debug: Env = {
  environment: "debug",
  networkType: "testnet",
  endpoint: "https://debugnet.mossland.backend.akamir.com/graphql",
  ws: "https://debugnet.mossland.backend.akamir.com",
  klaytn: {
    chainId: "5777",
    marketAddr: "",
  },
} as const;
const develop: Env = {
  environment: "develop",
  networkType: "testnet",
  endpoint: "https://testnet.mossland.backend.akamir.com/graphql",
  ws: "https://testnet.mossland.backend.akamir.com",
  klaytn: {
    chainId: "1001",
    marketAddr: "0xe2AB819885E2d5A6691aBA9145E03724578b9995",
  },
} as const;
const main: Env = {
  environment: "main",
  networkType: "mainnet",
  endpoint: "https://mossland.backend.akamir.com/graphql",
  ws: "https://mossland.backend.akamir.com",
  klaytn: {
    chainId: "8217",
    marketAddr: "",
  },
} as const;
const envMap = { local, debug, develop, main } as const;
export const env = envMap[(process.env.CLIENT_ENV as EnvType) ?? "debug"];
