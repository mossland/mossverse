import { AkaMarket, Multicall as MulticallContract } from "@shared/contract";
import { Contract, ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import { pageProcess } from "../utils";

export type SinglecallInput = { address: string; fn: string; args: any[] };
export type MulticallInput = { calls: SinglecallInput[]; settings: ContractSettings };
export interface ContractSettings {
  multicall: Multicall;
  market: AkaMarket;
  abi: any;
  intf: Interface;
  scanNum?: number;
}

type Call = {
  target: string;
  callData: string;
};
const SCAN_NUM = 5500;

export class Multicall {
  constructor(private readonly contract: MulticallContract) {}
  async view(input: MulticallInput) {
    const scanNum = input.settings.scanNum || SCAN_NUM;
    if (!input.calls.length) return [];
    const returnData = await pageProcess({
      name: `Multicall-view`,
      fn: async (from, to) => {
        const calls: Call[] = input.calls.slice(from, to).map((call) => ({
          target: call.address,
          callData: input.settings.intf.encodeFunctionData(call.fn, call.args),
        }));
        const [blockNumber, returnData] = (await this.contract.aggregate(calls)) as any;
        const bn = parseInt(blockNumber.toString());
        const data = input.calls
          .slice(from, from + scanNum)
          .map((call, idx) => [...input.settings.intf.decodeFunctionResult(call.fn, returnData[idx]), bn]);
        return data;
      },
      to: input.calls.length,
      step: scanNum,
    });
    return returnData;
  }
}
