import {
  ERC1155,
  ERC721,
  erc1155,
  erc20,
  erc721,
  ERC721ABurnable,
  ERC721A,
  ERC721AToken,
  ERC20,
  supportInterface,
  multicall,
  Multicall as MulticallContract,
  market,
  AkaMarket,
} from "@shared/contract";
import { Utils } from "@shared/util";
import { ethers } from "ethers";
import { getAccount } from "./utils";
const Caver = require("caver-js");

export const mint = async (
  contractAddress: string,
  networkId: number,
  key: number,
  amount: number,
  proofs: string[],
  price: number
) => {
  const caver = new Caver(window.klaytn);
  const from = await getAccount("klaytn", networkId);
  const contract = new caver.klay.Contract(erc721.abi, contractAddress);
  // const gas = await contract.methods.mint(key, amount, proofs).estimateGas({ from });
  // console.log(Utils.etherToWei(amount * price));
  return await contract.methods
    .mint(key, amount, proofs)
    .send({ from, value: Utils.etherToWei(Math.floor(amount * price * 1000) / 1000), gas: "300000" });
};

export const saleInfo = async (contractAddress: string, key: number) => {
  const caver = new Caver(window.klaytn);
  const contract = new caver.klay.Contract(erc721.abi, contractAddress);
  return await contract.methods.saleInfos(key).call();
};

export const totalSupply = async (contractAddress: string) => {
  const caver = new Caver(window.klaytn);
  const contract = new caver.klay.Contract(erc721.abi, contractAddress);
  return await contract.methods.totalSupply().call();
};

export const mintLogs = async (contractAddress: string, address: string, key: number) => {
  const caver = new Caver(window.klaytn);
  const contract = new caver.klay.Contract(erc721.abi, contractAddress);
  return await contract.methods.mintLogs(key, address).call();
};

export const setApprvalForAll = async (contractAddress: string, owner: string, operator: string) => {
  const from = await getAccount("klaytn", 1001);
  const caver = new Caver(window.klaytn);
  const contract = new caver.klay.Contract(erc721.abi, contractAddress);
  const approved = await contract.methods.isApprovedForAll(owner, operator).call();
  if (!approved) {
    const gas = await contract.methods.setApprovalForAll(operator, true).estimateGas({ from });
    await contract.methods.setApprovalForAll(operator, true).send({ from, gas });
  }
};
