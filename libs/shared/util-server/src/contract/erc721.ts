import { ERC721A, ERC721AToken, SaleInfo } from "@shared/contract";
import { BigNumber, Contract, ethers, Event } from "ethers";
import { ContractSettings } from "./multicall";
import { Utils } from "@shared/util";

export type Erc721TrasferEventHandler = (from: string, to: string, tokenId: BigNumber, event: Event) => void;
export type Erc721ApprovalEventHandler = (owner: string, approved: string, tokenId: BigNumber, event: Event) => void;
export type Erc721ApprovalForAllEventHandler = (
  owner: string,
  operator: string,
  apporved: boolean,
  event: Event
) => void;
export type Erc721EventHandler = {
  onTransfer?: Erc721TrasferEventHandler;
  onApproval?: Erc721ApprovalEventHandler;
  onApprovalForAll?: Erc721ApprovalForAllEventHandler;
};
export type Erc721Info = {
  name: string;
  symbol: string;
  totalSupply: number;
  bn: number;
};
export class Erc721 {
  constructor(readonly address: string, readonly contract: ERC721AToken, readonly settings: ContractSettings) {}
  async info(): Promise<Erc721Info> {
    const [[name, bn], [symbol], [totalSupply]] = (
      await this.settings.multicall.view({
        calls: [
          { address: this.address, fn: "name", args: [] },
          { address: this.address, fn: "symbol", args: [] },
          { address: this.address, fn: "totalSupply", args: [] },
        ],
        settings: this.settings,
      })
    ).map((ret) => [ret[0], ret[1]]);
    return { name, symbol, totalSupply, bn };
  }
  async snapshot() {
    const tokenIds = await this.#tokenIdsAll();
    const tokenUris = await this.tokenURIs(tokenIds);
    const owners = await this.#ownersOf(tokenIds);
    return tokenUris.map((tokenUri, idx) => ({ ...tokenUri, ...owners[idx] }));
  }
  async inventory(owner: string, contracts: string[]) {
    const balanceMap = (
      await this.settings.multicall.view({
        calls: contracts.map((address) => ({ address, fn: "balanceOf", args: [owner] })),
        settings: this.settings,
      })
    ).map((ret, idx) => ({ address: owner, contract: contracts[idx], value: parseInt(ret[0].toString()), bn: ret[1] }));
    const tokenMap: { address: string; contract: string; tokenId: number; value: number; uri: string; bn: number }[][] =
      await Promise.all(
        balanceMap.map(async (b) => {
          // 1. ERC721AQueryable
          try {
            const [tokenIds, bn] = (
              await this.settings.multicall.view({
                calls: [{ address: b.contract, fn: "tokensOfOwner", args: [owner] }],
                settings: this.settings,
              })
            )[0];
            const tokens = tokenIds.map((tokenId) => ({
              address: owner,
              contract: b.contract,
              tokenId: parseInt(tokenId.toString()),
              value: 1,
              bn,
            }));
            const uris = await this.tokenURIs(
              tokens.map((inv) => inv.tokenId),
              b.contract
            );
            return tokens.map((t, idx) => ({ ...t, uri: uris[idx].uri }));
          } catch (e) {
            console.log(e);
          }
          try {
            const calls = balanceMap.reduce(
              (acc, map) => [
                ...acc,
                ...new Array(map.value)
                  .fill(0)
                  .map((_, idx) => ({ address: map.contract, fn: "tokenOfOwnerByIndex", args: [owner, idx] })),
              ],
              []
            );
            const tokens = (await this.settings.multicall.view({ calls, settings: this.settings })).map((ret, idx) => ({
              address: owner,
              contract: calls[idx].address,
              tokenId: parseInt(ret[0].toString()),
              value: 1,
              bn: ret[1],
            }));
            const uris = await this.tokenURIs(
              tokens.map((inv) => inv.tokenId),
              b.contract
            );
            return tokens.map((t, idx) => ({ ...t, uri: uris[idx].uri }));
            return tokens;
          } catch (e) {
            return [];
          }
        })
      );

    return tokenMap.reduce((acc, t) => [...acc, ...t], []);
  }
  async inventory2TempForMib(owner: string) {
    const supply = await this.#totalSupply();
    const owners = await this.#ownersOf(new Array(supply).fill(0).map((_, idx) => idx));
    const tokenIds = owners
      .map((o, i) => (o.address.toLowerCase() === owner ? i : null))
      .filter((id) => !!id) as number[];
    const inventory = tokenIds.map((tokenId, idx) => ({
      address: owner,
      contract: this.address,
      tokenId,
      value: 1,
      bn: 0,
    }));
    const uris = await this.tokenURIs(tokenIds);
    return inventory.map((inv, idx) => ({ ...inv, uri: uris[idx].uri }));
  }
  async getSaleInfo(key: number) {
    const ret = await this.contract.saleInfos(key);
    return {
      amount: parseInt(ret[0].toString()),
      price: Utils.weiToEther(ret[1].toString()),
      startTime: new Date(parseInt(ret[2].toString()) * 1000),
      endTime: new Date(parseInt(ret[3].toString()) * 1000),
      merkleRoot: ret[4],
      perTx: parseInt(ret[5].toString()),
      perWallet: parseInt(ret[6].toString()),
      maxLimit: parseInt(ret[7].toString()),
      minted: parseInt(ret[8].toString()),
    };
  }
  async balances(owners: string[]) {
    const balances = (
      await this.settings.multicall.view({
        calls: owners.map((owner) => ({ address: this.address, fn: "balanceOf", args: [owner] })),
        settings: this.settings,
      })
    ).map((ret) => parseInt(ret[0].toString()));
    return balances;
  }
  async tokenURIs(tokenIds: number[], address = this.address) {
    const uris: { tokenId: number; uri: string }[] = (
      await this.settings.multicall.view({
        calls: tokenIds.map((tokenId) => ({ address, fn: "tokenURI", args: [tokenId] })),
        settings: this.settings,
      })
    ).map((ret, idx) => ({ tokenId: tokenIds[idx], uri: ret[0] }));
    return uris;
  }
  async tokenIds(owner?: string) {
    return owner ? await this.#tokenIdsOfOwner(owner) : await this.#tokenIdsAll();
  }
  async checkApproval(owner: string, tokenId: number) {
    return (
      (await this.contract.isApprovedForAll(owner, this.settings.market.address)) &&
      (await this.#ownerOf(tokenId)).toLowerCase() === owner
    );
  }
  async transfer(from: string, to: string, tokenId: number) {
    await this.settings.market.transferErc721(this.address, from, to, tokenId, { gasLimit: 300000 });
    return true;
  }
  listen({ onTransfer, onApproval, onApprovalForAll }: Erc721EventHandler) {
    this.contract.removeAllListeners();
    onTransfer && this.contract.on("Transfer", onTransfer);
    onApproval && this.contract.on("Approval", onApproval);
    onApprovalForAll && this.contract.on("ApprovalForAll", onApprovalForAll);
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
  async #totalSupply() {
    return (await this.contract.totalSupply()).toNumber();
  }
  async #balanceOf(owner: string) {
    return (await this.contract.balanceOf(owner)).toNumber();
  }
  async #ownerOf(tokenId: number) {
    return await this.contract.ownerOf(tokenId);
  }
  async #ownersOf(tokenIds: number[]) {
    const owners: { address: string; value: number; bn: number }[] = (
      await this.settings.multicall.view({
        calls: tokenIds.map((tokenId) => ({ address: this.address, fn: "ownerOf", args: [tokenId] })),
        settings: this.settings,
      })
    ).map((ret) => ({ address: ret[0].toLowerCase(), bn: ret[1], value: 1 }));
    return owners;
  }
  async #tokenIdsOfOwner(owner: string): Promise<number[]> {
    try {
      const tokenIds = (await this.contract.tokensOfOwner(owner)).map((id) => parseInt(id.toString()));
      return tokenIds;
    } catch (e) {
      //
    }
    try {
      const balance = await this.#balanceOf(owner);
      const tokenIds = (
        await this.settings.multicall.view({
          calls: new Array(balance)
            .fill(0)
            .map((_, idx) => ({ address: this.address, fn: "tokenOfOwnerByIndex", args: [owner, idx] })),
          settings: this.settings,
        })
      ).map((ret) => parseInt(ret[0].toString()));
      return tokenIds;
    } catch (e) {
      return [];
    }
    // use contract api
  }
  async #tokenIdsAll(): Promise<number[]> {
    try {
      const supply = await this.#totalSupply();
      const tokenIds = (
        await this.settings.multicall.view({
          calls: new Array(supply)
            .fill(0)
            .map((_, idx) => ({ address: this.address, fn: "tokenByIndex", args: [idx] })),
          settings: this.settings,
        })
      ).map((ret) => parseInt(ret[0].toString()));
      return tokenIds;
    } catch (e) {
      const supply = await this.#totalSupply();
      return new Array(supply).fill(0).map((_, idx) => idx);
    }
    // use contract api
  }
}
