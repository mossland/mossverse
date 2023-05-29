import * as Wallet from "./wallet.document";
import * as cnst from "../cnst";
import { AddrLoadService, Id } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
@Injectable()
export class WalletEmployee extends AddrLoadService<Wallet.Mdl, Wallet.Doc, Wallet.Input> {
  constructor(
    @InjectModel(Wallet.name) private readonly Wallet: Wallet.Mdl // private readonly contractEmployee: emp.ContractEmployee // private readonly tokenEmployee: TokenEmployee
  ) {
    super(WalletEmployee.name, Wallet);
  }
  async myWallet(networkId: Id, address: string) {
    return await this.Wallet.generate(networkId, address);
  }
  async generateWallets(networkId: Id, addresses: string[]) {
    return await this.Wallet.generateMany(networkId, addresses);
  }
  async summarize(): Promise<cnst.WalletSummary> {
    return {
      totalWallet: await this.Wallet.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
