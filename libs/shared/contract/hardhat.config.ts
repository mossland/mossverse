import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
// dotenv.config({ path: __dirname + "/.env" });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { env } = require("./env");
console.log(env);
if (process.env["REPORT_GAS"]) require("hardhat-gas-reporter");

const config: HardhatUserConfig = {
  paths: {
    root: "./",
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  solidity: {
    version: "0.8.4",
    // settings: { optimizer: { enabled: true, runs: 800 } },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // mainnet:
    //   env.ethereum.networkName === "mainnet"
    //     ? {
    //         url: `https://mainnet.infura.io/v3/${env.ethereum.infuraId}`,
    //         accounts: [env.ethereum.privateKey],
    //         chainId: 1,
    //       }
    //     : undefined,
    // ropsten:
    //   env.ethereum.networkName === "ropsten"
    //     ? {
    //         url: `https://ropsten.infura.io/v3/${env.ethereum.infuraId}`,
    //         accounts: [env.ethereum.privateKey],
    //         chainId: 3,
    //       }
    //     : undefined,
    // rinkeby:
    //   env.ethereum.networkName === "rinkeby"
    //     ? {
    //         url: `https://rinkeby.infura.io/v3/${env.ethereum.infuraId}`,
    //         accounts: [env.ethereum.privateKey],
    //         chainId: 4,
    //       }
    //     : undefined,
    // baobab:
    //   env.klaytn.networkName === "baobab"
    //     ? {
    //         url: `https://node-api.klaytnapi.com/v1/klaytn`,
    //         httpHeaders: {
    //           Authorization: `Basic ${Buffer.from(
    //             `${env.klaytn.kasAccessKeyId}:${env.klaytn.kasSecretAccessKey}`
    //           ).toString("base64")}`,
    //           "x-chain-id": "1001",
    //         },
    //         accounts: [env.klaytn.privateKey],
    //         chainId: 1001,
    //         gas: 8500000,
    //       }
    //     : undefined,
    // cypress:
    //   env.klaytn.networkName === "cypress"
    //     ? {
    //         url: `https://node-api.klaytnapi.com/v1/klaytn`,
    //         httpHeaders: {
    //           Authorization: `Basic ${Buffer.from(
    //             `${env.klaytn.kasAccessKeyId}:${env.klaytn.kasSecretAccessKey}`
    //           ).toString("base64")}`,
    //           "x-chain-id": "8217",
    //         },
    //         accounts: [env.klaytn.privateKey],
    //         chainId: 8217,
    //         gas: 8500000,
    //       }
    //     : undefined,
    "aka-ethereum":
      env.ethereum.networkName === "aka-ethereum"
        ? {
            url: "https://debugnet.ethereum.akamir.com", // Localhost (default: none)
            accounts: [env.ethereum.privateKey],
          }
        : undefined,
    "aka-klaytn":
      env.klaytn.networkName === "aka-klaytn"
        ? {
            url: "https://debugnet.klaytn.akamir.com", // Localhost (default: none)
            accounts: [env.klaytn.privateKey],
          }
        : undefined,
  },

  // gasReporter: { currency: "USD", gasPrice: 100, showTimeSpent: true },
  // etherscan: {
  //   apiKey: {
  //     mainnet: secrets.infuraApiKey,
  //     ropsten: secrets.infuraApiKey,
  //     rinkeby: secrets.infuraApiKey,
  //   },
  // },
  // abiExporter: [
  //   { path: "./abi/pretty", pretty: true },
  //   { path: "./abi/ugly", pretty: false },
  // ],
};
console.log(config);
export default config;
