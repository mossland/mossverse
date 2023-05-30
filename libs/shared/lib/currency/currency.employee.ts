import * as Currency from "./currency.document";
import * as cnst from "../cnst";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { emp as external } from "@external/server";

@Injectable()
export class CurrencyEmployee extends LoadService<Currency.Mdl, Currency.Doc, Currency.Input> {
  constructor(
    @InjectModel(Currency.name)
    private readonly Currency: Currency.Mdl,
    private readonly etherEmployee: external.EtherEmployee
  ) {
    super(CurrencyEmployee.name, Currency);
  }
  async getDepositAddress(currencyId: Id) {
    return "0x0000000000000000000000000000000000000000";
  }
  async validateDeposit(currencyId: Id, amount: number, hash: string) {
    const currency = await this.Currency.pickById(currencyId);
    if (currency.symbol === "ETH") return await this.etherEmployee.validateDeposit(amount, hash);
    else if (currency.symbol === "USD") return await this.etherEmployee.validateErc20Deposit(amount, hash);
    return false;
  }
  async makeWithdrawal(currencyId: Id, amount: number) {
    // WIP
  }
  async withdraw(currencyId: Id, amount: number) {
    // WIP
  }
  async summarize(): Promise<cnst.CurrencySummary> {
    return {
      totalCurrency: await this.Currency.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
