// * RUN COMAND: npx hardhat --network localhost run ./scripts/deploy.ts

import "@nomiclabs/hardhat-ethers";
import { network, artifacts, ethers } from "hardhat";
import * as fs from "fs";
import { Contract, utils } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { market } from "../abis";
import { AkaMarket, ERC721AToken } from "../typechain-types";
import { SaleInfo, saleInfosToArrays } from "../utils";
import { erc721 } from "../abis";
import { Utils } from "@shared/util";

// const makeSaleInfo = (root: SignerWithAddress, wls: string[], roots: any[]): SaleInfo[] => [
//   {
//     // admin Mint
//     amount: 200,
//     price: 0,
//     startTime: new Date(),
//     endTime: Utils.getNextYears(),
//     merkleRoot: roots[0],
//     perTx: 0,
//     perWallet: 0,
//     maxLimit: 0,
//     minted: 0,
//   },
//   {
//     // wl mint
//     amount: 1000,
//     price: 0.01,
//     startTime: new Date("2022-10-27T11:30+09:00"),
//     endTime: Utils.getNextYears(),
//     merkleRoot: roots[1],
//     perTx: 10,
//     perWallet: 0,
//     maxLimit: 0,
//     minted: 0,
//   },
//   {
//     // public mint
//     amount: 1000,
//     price: 0.012,
//     startTime: new Date("2022-10-27T11:30+09:00"),
//     endTime: Utils.getNextYears(),
//     merkleRoot: roots[2],
//     perTx: 10,
//     perWallet: 0,
//     maxLimit: 0,
//     minted: 0,
//   },
// ];

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Network: " + network.name);
  console.log("Deploying the contracts with the account:", await deployer.getAddress());
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const contract = new ethers.Contract(
    "0x4100c20c8e054b7d92c7007f3cbacd0724ac1b05",
    // "0x8c8a480f987E202e1F770c5E5330D5AA2653C975", // chicken
    erc721.abi,
    deployer
  ) as ERC721AToken;
  // await contract.setSaleInfoList(...saleInfosToArrays(makeSaleInfo(deployer, wlAddresses)), 0, {
  //   gasLimit: 1000000,
  // });
  // const saleInfos = [await contract.saleInfos(0), await contract.saleInfos(1), await contract.saleInfos(2)];
  // await contract.setSaleInfoList(
  //   ...saleInfosToArrays(
  //     makeSaleInfo(
  //       deployer,
  //       [],
  //       saleInfos.map((s) => s.merkleRoot)
  //     )
  //   ),
  //   0,
  //   {
  //     gasLimit: 1000000,
  //   }
  // );
  // check validity
  // addresses.map((address, idx) => {
  //   if (addresses.some((a, i) => i !== idx && a.toLowerCase() === address.toLowerCase())) console.log(address);
  // });
  const tokenIds = (await contract.tokensOfOwner(deployer.address)).map((id) => id.toNumber()).reverse();
  for (const tokenId of tokenIds) {
    await Utils.sleep(2000);
    await contract.transferFrom(deployer.address, "0x25b50D6Be447d97AEefcAdB1D07c647270F225a7", tokenId);
  }

  // const dropMap = addresses.map((address, i) => ({ address, tokenId: tokenIds[i] }));
  // console.log(dropMap.length);
  // fs.writeFileSync("dropMap.json", JSON.stringify(dropMap));

  //! Danger zone
  // const dropMap: { address: string; tokenId: number }[] = JSON.parse(fs.readFileSync("dropMap.json", "utf8"));
  // console.log(dropMap.length);
  // for (const drop of dropMap.slice(1)) {
  //   console.log(`Transfer ${drop.address} => ${drop.tokenId}`);
  //   const receipt = await contract.transferFrom(deployer.address, drop.address, drop.tokenId, { gasLimit: 1000000 });
  //   console.log(receipt.hash);
  //   await Utils.sleep(2000);
  // }
  //! Danger zone
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
