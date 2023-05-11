import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AddrLoadService, Id } from "@shared/util-server";
import * as Wallet from "./wallet.model";
import * as gql from "../gql";
import * as db from "../db";
import { KeyringService } from "../keyring/keyring.service";
import { TokenService } from "../token/token.service";
@Injectable()
export class WalletService extends AddrLoadService<Wallet.Mdl, Wallet.Doc, Wallet.Input> {
  constructor(
    @InjectModel(Wallet.name) private readonly Wallet: Wallet.Mdl // private readonly contractService: srv.ContractService // private readonly tokenService: TokenService
  ) {
    super(WalletService.name, Wallet);
  }
  async myWallet(networkId: Id, address: string) {
    return await this.Wallet.generate(networkId, address);
  }
  async generateWallets(networkId: Id, addresses: string[]) {
    return await this.Wallet.generateMany(networkId, addresses);
  }
  async summarize(): Promise<gql.WalletSummary> {
    return {
      totalWallet: await this.Wallet.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
