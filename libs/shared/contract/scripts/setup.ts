// * RUN COMAND: npx hardhat --network localhost run ./scripts/deploy.ts

import "@nomiclabs/hardhat-ethers";
import { network, artifacts, ethers } from "hardhat";
import * as fs from "fs";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { market } from "../abis";
import { AkaMarket } from "../typechain-types";

const CONTRACT_NAME = "AkaToken";
const ARGS = ["AkaCoin", "AKA"];

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Network: " + network.name);
  console.log("Deploying the contracts with the account:", await deployer.getAddress());
  console.log("Account balance:", (await deployer.getBalance()).toString());
  await Promise.all([
    // await deployErc20(deployer),
    // await deployErc721(deployer),
    // await deployErc1155(deployer),
    // await deployMulticall(),
    // await deployMarket(),
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
  const name = "Akamir";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(100, 1000, 800, 500);
  await contract.deployed();
  await contract.connect(deployer).devMint(100, Math.floor(Date.now() / 1000), { gasLimit: 200000 });
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
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
