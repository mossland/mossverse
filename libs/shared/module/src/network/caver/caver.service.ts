import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import * as dto from "./caver.dto";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Caver = require("caver-js-latest");
// import * as Caver from "caver-js-latest";
import { KeyringContainer, default as CaverJs, AbiItem } from "caver-js-latest";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { KlaytnOptions } from "../../options";
import { LogService, Erc721, Erc1155, Erc20, Multicall } from "@shared/util-server";
import { NetworkFunctionality } from "../network.service";
import { ethers } from "ethers";
import {
  ERC1155,
  erc1155,
  erc20,
  erc721,
  ERC721A,
  ERC20,
  supportInterface,
  multicall,
  Multicall as MulticallContract,
  AkaMarket,
  market,
} from "@shared/contract";
import { async } from "rxjs";

@Injectable()
export class CaverService extends LogService implements NetworkFunctionality, OnModuleDestroy {
  #erc1155InterfaceId = "0xd9b67a26";
  #erc721InterfaceId = "0x80ac58cd";
  #erc20InterfaceId = "0x36372b07";
  provider: ethers.providers.Provider;
  multicall: Multicall;
  wallet: ethers.Wallet;
  operators: ethers.Wallet[];
  market: AkaMarket;
  ws?: ethers.providers.WebSocketProvider;
  constructor(
    @Inject("KLAYTN_OPTIONS") private options: KlaytnOptions // , @InjectQueue("caver") private queue: Queue
  ) {
    super(CaverService.name);
    const headers = {
      Authorization: `Basic ${Buffer.from(`${this.options.accessKeyId}:${this.options.secretAccessKey}`).toString(
        "base64"
      )}`,
      "x-chain-id": this.options.chainId,
    };
    this.provider = new ethers.providers.JsonRpcProvider({ url: this.options.endpoint, headers });
    if (this.options.websocket) this.ws = new ethers.providers.WebSocketProvider(this.options.websocket);
    this.wallet = new ethers.Wallet(this.options.root.privateKey, this.provider);
    this.operators = this.options.operators.map((operator) => new ethers.Wallet(operator.privateKey), this.provider);
    this.multicall = new Multicall(
      (new ethers.Contract(this.options.multicall, multicall.abi, this.wallet) as unknown) as MulticallContract
    );
    this.market = new ethers.Contract(this.options.market, market.abi, this.wallet) as AkaMarket;
  }
  async onModuleDestroy() {
    this.ws?.destroy();
    // await this.queue.close(true);
  }
  async getInterface(address: string) {
    const contract = (new ethers.Contract(address, supportInterface.abi, this.provider) as unknown) as ERC721A & ERC20;
    try {
      if (await contract.supportsInterface(this.#erc721InterfaceId)) return "erc721";
    } catch (err) {
      this.logger.warn(`Failed Support Interface ERC721`);
    }
    try {
      if (await contract.supportsInterface(this.#erc1155InterfaceId)) return "erc1155";
    } catch (err) {
      this.logger.warn(`Failed Support Interface ERC1155`);
    }
    try {
      if (await contract.decimals()) return "erc20";
    } catch (err) {
      this.logger.warn(`Failed Support Interface ERC20`);
    }
    throw new Error("This contract is not Supported.");
  }
  loadErc20Contract(address: string) {
    const contract = (new ethers.Contract(address, erc20.abi, this.wallet) as unknown) as ERC20;
    const instance = new Erc20(address, contract, {
      abi: erc20.abi,
      multicall: this.multicall,
      market: this.market,
      intf: new ethers.utils.Interface(erc20.abi),
    });
    return instance;
  }
  loadErc721Contract(address: string) {
    const contract = (new ethers.Contract(address, erc721.abi, this.wallet) as unknown) as ERC721A;
    const instance = new Erc721(address, contract, {
      abi: erc721.abi,
      multicall: this.multicall,
      market: this.market,
      intf: new ethers.utils.Interface(erc721.abi),
    });
    return instance;
  }
  loadErc1155Contract(address: string) {
    const contract = (new ethers.Contract(address, erc1155.abi, this.wallet) as unknown) as ERC1155;
    const instance = new Erc1155(address, contract, {
      abi: erc1155.abi,
      multicall: this.multicall,
      market: this.market,
      intf: new ethers.utils.Interface(erc1155.abi),
    });
    return instance;
  }
}
