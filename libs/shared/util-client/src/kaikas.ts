import {
  ERC1155,
  ERC721,
  erc1155,
  erc20,
  erc721,
  ERC721A,
  ERC20,
  supportInterface,
  multicall,
  Multicall as MulticallContract,
  market,
  AkaMarket,
} from "@shared/contract";
import { ethers } from "ethers";
import { getAccount } from "./utils";
const Caver = require("caver-js");

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
