import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Currency from "./currency.model";
import * as fs from "fs";
import { Id, LoadService } from "@shared/util-server";
import { cnst, Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import { srv as external } from "@external/module";

@Injectable()
export class CurrencyService extends LoadService<Currency.Mdl, Currency.Doc, Currency.Input> {
  constructor(
    @InjectModel(Currency.name)
    private readonly Currency: Currency.Mdl,
    private readonly etherService: external.EtherService
  ) {
    super(CurrencyService.name, Currency);
  }
  async getDepositAddress(currencyId: Id) {
    return "0x0000000000000000000000000000000000000000";
  }
  async validateDeposit(currencyId: Id, amount: number, hash: string) {
    const currency = await this.Currency.pickById(currencyId);
    if (currency.symbol === "ETH") return await this.etherService.validateDeposit(amount, hash);
    else if (currency.symbol === "USD") return await this.etherService.validateErc20Deposit(amount, hash);
    return false;
  }
  async makeWithdrawal(currencyId: Id, amount: number) {
    // WIP
  }
  async withdraw(currencyId: Id, amount: number) {
    // WIP
  }
  async summarize(): Promise<gql.CurrencySummary> {
    return {
      totalCurrency: await this.Currency.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
