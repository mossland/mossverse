import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService } from "@shared/util-server";
import { CaverService } from "./caver/caver.service";
import { EtherService } from "./ether/ether.service";
import * as Network from "./network.model";
import * as gql from "../gql";
import * as srv from "../srv";
import * as db from "../db";
import { Erc20, Erc721, Erc1155 } from "@shared/util-server";

type Provider = "ethereum" | "klaytn";
type ContractType = "erc20" | "erc721" | "erc1155" | "unknown";
type LoadErc20Contract = (address: string) => Erc20;
type LoadErc721Contract = (address: string) => Erc721;
type LoadErc1155Contract = (address: string) => Erc1155;

export type NetworkFunctionality = {
  getInterface: (address: string) => Promise<ContractType>;
  loadErc20Contract: LoadErc20Contract;
  loadErc721Contract: LoadErc721Contract;
  loadErc1155Contract: LoadErc1155Contract;
};
type ChainProviders = {
  [key in Provider]: {
    getInterface: (address: string) => Promise<ContractType>;
    erc20: LoadErc20Contract;
    erc721: LoadErc721Contract;
    erc1155: LoadErc1155Contract;
  };
};

@Injectable()
export class NetworkService extends LoadService<Network.Mdl, Network.Doc, Network.Input> {
  #chainProviders: ChainProviders;
  constructor(
    @InjectModel(Network.name) private readonly Network: Network.Mdl,
    private readonly etherService: EtherService,
    private readonly caverService: CaverService
  ) {
    super(NetworkService.name, Network);
    this.#chainProviders = {
      ethereum: {
        getInterface: (address: string) => this.etherService.getInterface(address),
        erc20: (address: string) => this.etherService.loadErc20Contract(address),
        erc721: (address: string) => this.etherService.loadErc721Contract(address),
        erc1155: (address: string) => this.etherService.loadErc1155Contract(address),
      },
      klaytn: {
        getInterface: (address: string) => this.caverService.getInterface(address),
        erc20: (address: string) => this.caverService.loadErc20Contract(address),
        erc721: (address: string) => this.caverService.loadErc721Contract(address),
        erc1155: (address: string) => this.caverService.loadErc1155Contract(address),
      },
    };
  }
  async getInterface(networkId: Id, address: string) {
    const network = await this.Network.pickById(networkId);
    const provider = this.#chainProviders[network.provider];
    const a = await provider.getInterface(address);
    return await provider.getInterface(address);
  }
  async loadContract(contract: db.Contract.Doc) {
    const network = await this.Network.pickById(contract.network);
    const provider = this.#chainProviders[network.provider];
    const instance = provider[contract.interface](contract.address);
    return instance;
  }
}
