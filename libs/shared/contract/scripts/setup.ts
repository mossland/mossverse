// * RUN COMAND: npx hardhat --network localhost run ./scripts/deploy.ts

import "@nomiclabs/hardhat-ethers";
import { network, artifacts, ethers } from "hardhat";
import * as fs from "fs";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { market } from "../abis";
import { AkaMarket } from "../typechain-types";
import { makeSaleInfo, saleInfosToArrays } from "../utils";
import { Utils } from "@shared/util";

const CONTRACT_NAME = "AkaToken";
const ARGS = ["AkaCoin", "AKA"];

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Network: " + network.name);
  console.log("Deploying the contracts with the account:", await deployer.getAddress());
  console.log("Account balance:", (await deployer.getBalance()).toString());
  await Promise.all([
    await deployErc20(deployer),
    await deployErc721(deployer),
    await deployErc1155(deployer),
    await deployMulticall(),
    await deployMarket(),
  ]);

  // const marketAddress = "0xe2AB819885E2d5A6691aBA9145E03724578b9995";
  // const contract = new Contract(marketAddress, market.abi, deployer) as AkaMarket;
  // console.log(await contract.addOperators([deployer.address]));
};
const deployErc20 = async (deployer: SignerWithAddress) => {
  const name = "AkaToken";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy("AkaCoin", "AKA");
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployErc721 = async (deployer: SignerWithAddress) => {
  const name = "ERC721AToken";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(
    "belif Herb Club",
    "BHC",
    1200,
    "https://belifherb.s3.ap-northeast-2.amazonaws.com/meta/",
    // "https://testnet.belif.backend.akamir.com/generative/opensea/634c86c7adc2f22a103057f9/",
    true
  );
  await contract.deployed();
  await contract
    .connect(deployer)
    .setSaleInfoList(...saleInfosToArrays([makeSaleInfo([deployer.address], 200)]), 0, { gasLimit: 200000 });
  await Utils.sleep(1000);
  await contract.setMetadata("https://belifherb.s3.ap-northeast-2.amazonaws.com/meta/", ".json", true);
  await Utils.sleep(1000);
  await contract.connect(deployer).mint(0, 200, [], { gasLimit: 1000000 });
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployErc1155 = async (deployer: SignerWithAddress) => {
  const name = "Collection";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();
  await contract.connect(deployer).addCollection(0, 1000, 1, "asdf");
  await contract.connect(deployer).mintSelf(0, 100, { gasLimit: 200000 });
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployMulticall = async () => {
  const name = "Multicall";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployMarket = async () => {
  const name = "AkaMarket";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployTether = async () => {
  const name = "TetherToken";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
