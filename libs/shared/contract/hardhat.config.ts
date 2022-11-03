import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import "tsconfig-paths/register";

// dotenv.config({ path: __dirname + "/.env" });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { env } = require("./env");
if (process.env["REPORT_GAS"]) require("hardhat-gas-reporter");
console.log(env.klaytn);
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
    //         url: `https://baobab02.fandom.finance/`,
    //         accounts: [env.klaytn.privateKey],
    //         chainId: 1001,
    //         gas: 8500000,
    //       }
    //     : undefined,
    cypress:
      env.klaytn.networkName === "cypress"
        ? {
            url: `https://klaytn04.fandom.finance`,
            accounts: [env.klaytn.privateKey],
            chainId: 8217,
            gas: 8500000,
          }
        : undefined,
    // "aka-ethereum":
    //   env.ethereum.networkName === "aka-ethereum"
    //     ? {
    //         url: "https://debugnet.ethereum.akamir.com", // Localhost (default: none)
    //         accounts: [env.ethereum.privateKey],
    //       }
    //     : undefined,
    // "aka-klaytn":
    //   env.klaytn.networkName === "aka-klaytn"
    //     ? {
    //         url: "https://debugnet.klaytn.akamir.com", // Localhost (default: none)
    //         accounts: [env.klaytn.privateKey],
    //       }
    //     : undefined,
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
export default config;
console.log(config.networks);
