import { BigNumber, Contract, ethers, Event } from "ethers";
import { ContractSettings } from "./multicall";
import { ERC1155 } from "@shared/contract";

export type Erc1155TrasferSingleEventHandler = (
  operator: string,
  from: string,
  to: string,
  id: BigNumber,
  value: BigNumber,
  event: Event
) => void;
export type Erc1155TrasferBatchEventHandler = (
  operator: string,
  from: string,
  to: string,
  ids: BigNumber[],
  values: BigNumber[],
  event: Event
) => void;
export type Erc1155ApprovalForAllEventHandler = (
  account: string,
  operator: string,
  apporved: boolean,
  event: Event
) => void;
export type Erc1155URIEventHandler = (value: string, id: BigNumber, event: Event) => void;
export type Erc1155EventHandler = {
  onTransferSingle?: Erc1155TrasferSingleEventHandler;
  onTransferBatch?: Erc1155TrasferBatchEventHandler;
  onApprovalForAll?: Erc1155ApprovalForAllEventHandler;
  onURI?: Erc1155URIEventHandler;
};
export type Erc1155Info = {
  bn: number;
};
export class Erc1155 {
  constructor(readonly address: string, readonly contract: ERC1155, readonly settings: ContractSettings) {}
  async info(): Promise<Erc1155Info> {
    const bn = await this.contract.provider.getBlockNumber();
    return { bn };
  }
  async snapshot(owners: string[], ids: number[]) {
    return await this.balances(owners, ids);
  }
  async inventory(owner: string, contracts: { address: string; id: number }[]) {
    const ret = (
      await this.settings.multicall.view({
        calls: contracts.map((contract) => ({
          address: contract.address,
          fn: "balanceOf",
          args: [owner, contract.id],
        })),
        settings: this.settings,
      })
    ).map((ret, idx) => ({
      address: owner,
      value: parseInt(ret[0].toString()),
      tokenId: contracts[idx].id,
      bn: ret[1],
      contract: contracts[idx].address,
    }));
    return ret;
  }
  async tokenUris(ids: number[]) {
    const uris: string[] = (
      await this.settings.multicall.view({
        calls: ids.map((id) => ({ address: this.address, fn: "uri", args: [id] })),
        settings: this.settings,
      })
    ).map((ret) => ret[0]);
    return uris;
  }
  async balances(owners: string[], ids: number[]) {
    const balances: { address: string; value: number; tokenId: number; bn: number }[] = (
      await this.settings.multicall.view({
        calls: owners.map((address) => ({
          address: this.address,
          fn: "balanceOfBatch",
          args: [new Array(ids.length).fill(address), ids],
        })),
        settings: this.settings,
      })
    ).reduce(
      (acc, ret: [BigNumber[], number], index) => [
        ...acc,
        ...ret[0].map((value, idx) => ({
          address: owners[index],
          value: parseInt(value.toString()),
          tokenId: ids[idx],
          bn: ret[1],
        })),
      ],
      []
    );
    return balances;
  }
  async checkApproval(owner: string, id: number, amount: number) {
    return (
      (await this.contract.isApprovedForAll(owner, this.settings.market.address)) &&
      (await this.#balanceOf(owner, id)) >= amount
    );
  }
  async transfer(from: string, to: string, id: number, amount: number) {
    await this.settings.market.transferErc1155(this.address, from, to, id, amount, "0x00");
    return true;
  }
  listen({ onTransferSingle, onTransferBatch, onApprovalForAll, onURI }: Erc1155EventHandler) {
    this.contract.removeAllListeners();
    onTransferSingle && this.contract.on("TransferSingle", onTransferSingle);
    onTransferBatch && this.contract.on("TransferBatch", onTransferBatch);
    onApprovalForAll && this.contract.on("ApprovalForAll", onApprovalForAll);
    onURI && this.contract.on("URI", onURI);
  }
  destroy() {
    this.contract.removeAllListeners();
  }
  async #balanceOf(owner: string, id: number) {
    return parseInt((await this.contract.balanceOf(owner, id)).toString());
  }
}
