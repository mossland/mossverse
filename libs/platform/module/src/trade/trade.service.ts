import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService } from "@shared/util-server";
import * as Trade from "./trade.model";
import * as gql from "../gql";
import * as db from "../db";
import * as srv from "../srv";
import { ReceiptService } from "../receipt/receipt.service";
import { UserService } from "../user/user.service";

@Injectable()
export class TradeService extends LoadService<Trade.Mdl, Trade.Doc, Trade.Input> {
  constructor(
    @InjectModel(Trade.name)
    private readonly Trade: Trade.Mdl,
    private readonly contractService: srv.shared.ContractService,
    private readonly keyringService: srv.shared.KeyringService,
    private readonly receiptService: ReceiptService,
    private readonly currencyService: srv.shared.CurrencyService,
    private readonly userService: UserService
  ) {
    super(TradeService.name, Trade);
  }
  async makeTrade(
    tradeId: Id,
    executedinputs: gql.ExchangeInput[],
    desiredOutputs: gql.ExchangeInput[],
    reverse: boolean,
    keyringId: Id
  ): Promise<db.Receipt.Doc> {
    const trade = await this.Trade.pickById(tradeId);
    if (trade.policy.includes("once") && (await this.receiptService.exists({ trade: trade._id })))
      throw new Error("This trade Can be executed in once");
    const [inputs, outputs] = trade.makeExchange(executedinputs, desiredOutputs, reverse);
    const user = await this.userService.pick({ keyring: keyringId });
    const root = this.userService.root;
    const receipt = await this.receiptService.create({
      name: `${trade.name}`,
      type: "trade",
      trade: trade._id,
      inputs,
      outputs,
      from: user._id,
      to: root?._id,
    });
    return await this.#processTradeReceipt(receipt);
  }
  // async processTradeReceiptsAll() {
  //   const receipts = await this.receiptService.list({ type: "trade", status: "active" });
  //   return await Promise.all(receipts.map(async (receipt) => await this.#processTradeReceipt(receipt)));
  // }
  async #processTradeReceipt(receipt: db.Receipt.Doc) {
    const user = await this.userService.get(receipt.from);
    const keyring = await this.keyringService.get(user.keyring);
    const isValid =
      (await this.#validateInputs(user, keyring, receipt.inputs)) &&
      (await this.#validateOutputs(user, keyring, receipt.outputs));
    if (!isValid) throw new Error("The Input and Output is not Valid");
    await receipt.merge({ status: "inProgress" }).save();
    try {
      await this.#transferInputs(user, receipt.inputs);
      await this.#transferOutputs(user, receipt.outputs);
      return await receipt.merge({ status: "success" }).save();
    } catch (err) {
      return await receipt.merge({ status: "failed", err }).save();
    }
  }
  async #validateInputs(user: db.User.Doc, keyring: db.shared.Keyring.Doc, exchanges: gql.ExchangeInput[]) {
    let isValid = true;
    await Promise.all(
      exchanges.map(async (exchange) => {
        if (exchange.thing && !user.hasItem(exchange.thing, -exchange.num)) isValid = false;
        else if (
          exchange.token &&
          (!exchange.wallet ||
            !exchange.hash ||
            !(await this.contractService.validateTx(exchange.token, exchange.wallet, exchange.hash, exchange.num)))
        )
          isValid = false;
        else if (
          exchange.currency &&
          (!exchange.hash || !(await this.currencyService.checkDeposit(exchange.currency, exchange.num, exchange.hash)))
        )
          isValid = false;
      })
    );
    return isValid;
  }
  async #validateOutputs(user: db.User.Doc, keyring: db.shared.Keyring.Doc, exchanges: gql.ExchangeInput[]) {
    let isValid = true;
    await Promise.all(
      exchanges.map(async (exchange) => {
        if (exchange.token) {
          if (!exchange.wallet) isValid = false;
          else if (keyring.wallets.some((wallet) => wallet.equals(exchange.wallet as Id))) isValid = false;
          else await this.contractService.checkApproval(exchange.token, "root", exchange.num);
        }
      })
    );
    return isValid;
  }
  async #transferInputs(user: db.User.Doc, exchanges: gql.ExchangeInput[]) {
    const [thingInputs, tokenInputs, currencyInputs] = [
      exchanges.filter((exchange) => exchange.thing),
      exchanges.filter((exchange) => exchange.token),
      exchanges.filter((exchange) => exchange.currency),
    ];
    thingInputs.length && (await this.userService.changeItems(user._id, thingInputs));
  }
  async #transferOutputs(user: db.User.Doc, exchanges: gql.ExchangeInput[]) {
    const [thingOutputs, tokenOutputs, currencyOutputs] = [
      exchanges.filter((exchange) => exchange.thing),
      exchanges.filter((exchange) => exchange.token),
      exchanges.filter((exchange) => exchange.currency),
    ];
    // process thing outputs
    thingOutputs.length && (await this.userService.changeItems(user._id, thingOutputs));
    // process token outputs
    for (const output of tokenOutputs)
      await this.contractService.transfer(output.token as Id, "root", output.wallet as Id, output.num);
  }
}
