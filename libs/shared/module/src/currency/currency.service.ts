import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Currency from "./currency.model";
import * as fs from "fs";
import { Id, LoadService } from "@shared/util-server";
import { cnst, Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { EthService } from "./eth/eth.service";
import { UsdService } from "./usd/usd.service";
@Injectable()
export class CurrencyService extends LoadService<Currency.Mdl, Currency.Doc, Currency.Input> {
  serviceMap: { [key in cnst.CurrencySymbol]: EthService | UsdService };
  constructor(
    @InjectModel(Currency.name)
    private readonly Currency: Currency.Mdl,
    private readonly ethService: EthService,
    private readonly usdService: UsdService
  ) {
    super(CurrencyService.name, Currency);
    this.serviceMap = {
      ETH: this.ethService,
      USD: this.usdService,
      KRW: this.usdService, // WIP
    };
  }
  async getDepositAddress(currencyId: Id) {
    return "0x0000000000000000000000000000000000000000";
  }
  async checkDeposit(currencyId: Id, amount: number, hash: string) {
    const currency = await this.Currency.pickById(currencyId);
    return await this.serviceMap[currency.symbol].checkDeposit(amount, hash);
  }
  async makeWithdrawal(currencyId: Id, amount: number) {
    // WIP
  }
  async withdraw(currencyId: Id, amount: number) {
    // WIP
  }
}
