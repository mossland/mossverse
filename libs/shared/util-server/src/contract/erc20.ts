import { BigNumber, Contract, ethers, Event } from "ethers";
import { ContractSettings } from "./multicall";
import { ERC20, ERC20__factory } from "@shared/contract";

export type Erc20TrasferEventHandler = (from: string, to: string, value: BigNumber, event: Event) => void;
export type Erc20ApprovalEventHandler = (owner: string, spender: string, value: BigNumber, event: Event) => void;
export type Erc20EventHandler = {
  onTransfer?: Erc20TrasferEventHandler;
  onApproval?: Erc20ApprovalEventHandler;
};
export type Erc20Info = {
  name: string;
  symbol: string;
  decimals: string;
  totalSupply: number;
  bn: number;
};

export class Erc20 {
  constructor(readonly address: string, readonly contract: ERC20, readonly settings: ContractSettings) {}
  async info(): Promise<Erc20Info> {
    this.contract;
    const [[name, bn], [symbol], [decimals], [totalSupply]] = (
      await this.settings.multicall.view({
        calls: [
          { address: this.address, fn: "name", args: [] },
          { address: this.address, fn: "symbol", args: [] },
          { address: this.address, fn: "decimals", args: [] },
          { address: this.address, fn: "totalSupply", args: [] },
        ],
        settings: this.settings,
      })
    ).map((ret) => [ret[0], ret[1]]);
    return { name, symbol, decimals, totalSupply, bn };
  }
  async inventory(owner: string, contracts: string[]) {
    return (
      await this.settings.multicall.view({
        calls: contracts.map((address) => ({ address, fn: "balanceOf", args: [owner] })),
        settings: this.settings,
      })
    ).map((ret, idx) => ({ address: owner, contract: contracts[idx], num: parseInt(ret[0].toString()), bn: ret[1] }));
  }
  async snapshot(owners: string[]) {
    const balances = await this.balances(owners);
    return owners.map((owner, idx) => ({ address: owner, ...balances[idx] }));
  }
  async balances(owners: string[]) {
    const balances: { num: number; bn: number }[] = (
      await this.settings.multicall.view({
        calls: owners.map((owner) => ({ address: this.address, fn: "balanceOf", args: [owner] })),
        settings: this.settings,
      })
    ).map((ret) => ({ num: parseInt(ret[0].toString()), bn: ret[1] }));
    return balances;
  }
  async checkApproval(owner: string, amount: number) {
    return (
      amount <= parseInt((await this.contract.allowance(owner, this.settings.market.address)).toString()) &&
      (await this.#balanceOf(owner)) >= amount
    );
  }
  async transfer(from: string, to: string, amount: number) {
    await this.settings.market.transferErc20(this.address, from, to, amount, { gasLimit: 200000 });
    return true;
  }
  listen({ onTransfer, onApproval }: Erc20EventHandler) {
    this.contract.removeAllListeners();
    onTransfer && this.contract.on("Transfer", onTransfer);
    onApproval && this.contract.on("Approval", onApproval);
  }
  destroy() {
    this.contract.removeAllListeners();
  }
  async #name() {
    return await this.contract.name();
  }
  async #symbol() {
    return await this.contract.symbol();
  }
  async #decimals() {
    return await this.contract.decimals();
  }
  async #totalSupply() {
    return (await this.contract.totalSupply()).toNumber();
  }
  async #balanceOf(owner: string) {
    return (await this.contract.balanceOf(owner)).toNumber();
  }
}
