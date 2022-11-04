import { Utils } from "@shared/util";
import { BigNumber, utils } from "ethers";

export type SaleInfo = {
  amount: number;
  price: number;
  startTime: Date;
  endTime: Date;
  merkleRoot: string;
  perTx: number;
  perWallet: number;
  maxLimit: number;
  minted: number;
};

export const saleInfosToArrays = (saleInfos: SaleInfo[]) =>
  [
    saleInfos.map((saleInfo) => saleInfo.amount),
    saleInfos.map((saleInfo) => utils.parseEther(saleInfo.price.toString())),
    saleInfos.map((saleInfo) => Math.floor(saleInfo.startTime.getTime() / 1000)),
    saleInfos.map((saleInfo) => Math.floor(saleInfo.endTime.getTime() / 1000)),
    saleInfos.map((saleInfo) => saleInfo.merkleRoot),
    saleInfos.map((saleInfo) => saleInfo.perTx),
    saleInfos.map((saleInfo) => saleInfo.perWallet),
    saleInfos.map((saleInfo) => saleInfo.maxLimit),
  ] as [number[], BigNumber[], number[], number[], string[], number[], number[], number[]];
export const makeSaleInfo = (addresses: string[], amount: number): SaleInfo => ({
  amount,
  price: 0, // 1 eth
  startTime: new Date(),
  endTime: Utils.getNextYears(),
  merkleRoot: Utils.getMerkleTree(addresses).root,
  perTx: 0,
  perWallet: 0,
  maxLimit: 0,
  minted: 0,
});
