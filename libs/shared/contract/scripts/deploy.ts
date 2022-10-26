// * RUN COMAND: npx hardhat --network localhost run ./scripts/deploy.ts

import "@nomiclabs/hardhat-ethers";
import { network, artifacts, ethers } from "hardhat";
import * as fs from "fs";
import { Contract } from "ethers";

const CONTRACT_NAME = "AkaToken";
const ARGS = ["AkaCoin", "AKA"];

const main = async () => {
  if (network.name === "hardhat")
    console.warn(
      `You are trying to deploy a contract to the Hardhat Network, which 
      gets automatically created and destroyed every time. Use the Hardhat
      option '--network localhost'`
    );
  const [deployer] = await ethers.getSigners();
  console.log("Network: " + network.name);
  console.log("Deploying the contracts with the account:", await deployer.getAddress());
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const contractFactory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await contractFactory.deploy("AkaCoin", "AKA"); //50gwei
  await contract.deployed();
  console.log("Deployed Contract Address:", contract.address);
  saveJSONFile(CONTRACT_NAME, contract);
};

const saveJSONFile = (name: string, contract: Contract) => {
  const dir = `${__dirname}/../contractInfo`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const addresses: { [key: string]: unknown } = fs.existsSync(`${dir}/${name}.json`)
    ? JSON.parse(fs.readFileSync(`${dir}/${name}.json`).toString("utf-8")).addresses
    : {};
  addresses[network.name] = contract.address;
  const artifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(`${dir}/${name}.json`, JSON.stringify({ addresses, ...artifact }, null, 2));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
