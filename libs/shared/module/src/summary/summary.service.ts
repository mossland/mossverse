import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Summary from "./summary.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { cnst, Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import { AdminService } from "../admin/admin.service";
import { ContractService } from "../contract/contract.service";
import { CurrencyService } from "../currency/currency.service";
import { FileService } from "../file/file.service";
import { KeyringService } from "../keyring/keyring.service";
import { NetworkService } from "../network/network.service";
import { ProductService } from "../product/product.service";
import { ThingService } from "../thing/thing.service";
import { TokenService } from "../token/token.service";
import { UserService } from "../user/user.service";
import { WalletService } from "../wallet/wallet.service";
import { OwnershipService } from "../ownership/ownership.service";
import { NotificationService } from "../notification/notification.service";
@Injectable()
export class SummaryService<
  Mdl extends Summary.Mdl = Summary.Mdl,
  Doc extends Summary.Doc = Summary.Doc,
  Input extends Summary.Input = Summary.Input
> extends LoadService<Mdl, Doc, Input> {
  constructor(
    @InjectModel(Summary.name) private Summary: Mdl,
    private readonly ownershipService: OwnershipService,
    private readonly adminService: AdminService,
    private readonly contractService: ContractService,
    private readonly currencyService: CurrencyService,
    private readonly fileService: FileService,
    private readonly keyringService: KeyringService,
    private readonly networkService: NetworkService,
    private readonly productService: ProductService,
    private readonly thingService: ThingService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly notificationService: NotificationService
  ) {
    super(SummaryService.name, Summary);
  }
  async getSharedSummary(): Promise<gql.SummaryInput> {
    return {
      ...(await this.adminService.summarize()),
      ...(await this.notificationService.summarize()),
      ...(await this.contractService.summarize()),
      ...(await this.currencyService.summarize()),
      ...(await this.fileService.summarize()),
      ...(await this.keyringService.summarize()),
      ...(await this.networkService.summarize()),
      ...(await this.productService.summarize()),
      ...(await this.thingService.summarize()),
      ...(await this.tokenService.summarize()),
      ...(await this.userService.summarizeShared()),
      ...(await this.walletService.summarize()),
      ...(await this.ownershipService.summarize()),
    };
  }
  async getActiveSummary() {
    return await this.Summary.pickOne({ status: "active" });
  }
}
