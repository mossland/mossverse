import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AddrLoadService, Id } from "@shared/util-server";
import * as Wallet from "./wallet.model";
import * as gql from "../gql";
import * as srv from "../srv";
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

  // async inventory(walletId: string) {
  //   const wallet = await this.Wallet.pickById(walletId);
  //   return this.contractService.inventory(wallet);
  // }

  async transferItem({ item, from, to, num, bn }: TokenTransferSignal) {
    await Promise.all([this.Wallet.incItem(item, from, -num, bn), this.Wallet.incItem(item, to, num, bn)]);
    // ! send signal to Websocket & Pubsub
    return true;
  }
  async resetItems(resetContractId: Id) {
    return await this.Wallet.resetItems(resetContractId);
  }
  async setItems(contractId: Id, ownerships: gql.Ownership[], reset = false) {
    if (reset) await this.resetItems(contractId);
    await this.Wallet.setItems(contractId, ownerships);
  }
}
type TokenTransferSignal = {
  item: {
    contract: Id;
    token: Id;
  };
  from: Id;
  to: Id;
  num: number;
  bn: number;
};
