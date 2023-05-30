import * as Network from "./network.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import { Erc1155, Erc20, Erc721 } from "@contract";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { emp as external } from "@external/server";

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
export class NetworkEmployee extends LoadService<Network.Mdl, Network.Doc, Network.Input> {
  #chainProviders: ChainProviders;
  constructor(
    @InjectModel(Network.name) private readonly Network: Network.Mdl,
    private readonly etherEmployee: external.EtherEmployee,
    private readonly caverEmployee: external.CaverEmployee
  ) {
    super(NetworkEmployee.name, Network);
    this.#chainProviders = {
      ethereum: {
        getInterface: (address: string) => this.etherEmployee.getInterface(address),
        erc20: (address: string) => this.etherEmployee.loadErc20Contract(address),
        erc721: (address: string) => this.etherEmployee.loadErc721Contract(address),
        erc1155: (address: string) => this.etherEmployee.loadErc1155Contract(address),
      },
      klaytn: {
        getInterface: (address: string) => this.caverEmployee.getInterface(address),
        erc20: (address: string) => this.caverEmployee.loadErc20Contract(address),
        erc721: (address: string) => this.caverEmployee.loadErc721Contract(address),
        erc1155: (address: string) => this.caverEmployee.loadErc1155Contract(address),
      },
    };
  }
  async getInterface(networkId: Id, address: string) {
    const network = await this.Network.pickById(networkId);
    const provider = this.#chainProviders[network.provider];
    const a = await provider.getInterface(address);
    return await provider.getInterface(address);
  }
  async loadContract(contract: doc.Contract.Doc) {
    const network = await this.load(contract.network);
    if (!network) throw new Error(`Network not found: ${contract.network}`);
    const provider = this.#chainProviders[network.provider];
    const instance = provider[contract.interface](contract.address);
    return instance;
  }
  async summarize(): Promise<cnst.NetworkSummary> {
    return {
      totalNetwork: await this.Network.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
