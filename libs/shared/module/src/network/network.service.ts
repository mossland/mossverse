import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService } from "@shared/util-server";
import * as Network from "./network.model";
import * as gql from "../gql";
import * as db from "../db";
import { srv as external } from "@external/module";
import { Erc20, Erc721, Erc1155 } from "@shared/util-server";

type Provider = "ethereum" | "klaytn";
type ContractType = "erc20" | "erc721" | "erc1155" | "unknown";
type ChainProviders = {
  [key in Provider]: {
    getInterface: (address: string) => Promise<ContractType>;
    erc20: (address: string) => Erc20;
    erc721: (address: string) => Erc721;
    erc1155: (address: string) => Erc1155;
  };
};

@Injectable()
export class NetworkService extends LoadService<Network.Mdl, Network.Doc, Network.Input> {
  #chainProviders: ChainProviders;
  constructor(
    @InjectModel(Network.name) private readonly Network: Network.Mdl,
    private readonly etherService: external.EtherService,
    private readonly caverService: external.CaverService
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
    const network = await this.load(contract.network);
    if (!network) throw new Error(`Network not found: ${contract.network}`);
    const provider = this.#chainProviders[network.provider];
    const instance = provider[contract.interface](contract.address);
    return instance;
  }
  async summarize(): Promise<gql.NetworkSummary> {
    return {
      totalNetwork: await this.Network.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
