import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService } from "@shared/util-server";
import * as Trade from "./trade.model";
import * as gql from "../gql";
import * as db from "../db";
import { ReceiptService } from "../receipt/receipt.service";
import { UserService } from "../user/user.service";
import { srv as shared } from "@shared/module";
import { srv as external } from "@external/module";
@Injectable()
export class TradeService extends LoadService<Trade.Mdl, Trade.Doc, Trade.Input> {
  constructor(
    @InjectModel(Trade.name)
    private readonly Trade: Trade.Mdl,
    private readonly contractService: shared.ContractService,
    private readonly keyringService: shared.KeyringService,
    private readonly ownershipService: shared.OwnershipService,
    private readonly receiptService: ReceiptService,
    private readonly currencyService: shared.CurrencyService,
    private readonly thingService: shared.ThingService,
    private readonly discordService: external.DiscordService,
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
    //user가 있으면(trade 주최자가 유저면)
    const to = trade.user ?? this.userService.root;
    const receipt = await this.receiptService.create({
      name: `${trade.name}`,
      type: "trade",
      trade: trade._id,
      inputs,
      outputs,
      from: user._id,
      to: to?._id,
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
      await this.discordService.log(`${user.nickname}'s ${receipt.name} trade is completed`);
      return await receipt.merge({ status: "success" }).save();
    } catch (err) {
      await this.discordService.log(String(err));
      return await receipt.merge({ status: "failed", err }).save();
    }
  }
  async #validateInputs(user: db.User.Doc, keyring: db.shared.Keyring.Doc, exchanges: gql.ExchangeInput[]) {
    let isValid = true;
    await Promise.all(
      exchanges.map(async (exchange) => {
        if (exchange.thing && !(await this.ownershipService.hasThing(user._id, exchange.thing, -exchange.value)))
          isValid = false;
        else if (
          exchange.token &&
          (!exchange.wallet ||
            !exchange.hash ||
            !(await this.contractService.validateTx(exchange.token, exchange.wallet, exchange.hash, exchange.value)))
        )
          isValid = false;
        else if (
          exchange.currency &&
          (!exchange.hash ||
            !(await this.currencyService.validateDeposit(exchange.currency, exchange.value, exchange.hash)))
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
          else await this.contractService.checkApproval(exchange.token, "root", exchange.value);
        }
      })
    );
    return isValid;
  }
  async #transferInputs(user: db.User.Doc, exchanges: gql.ExchangeInput[]) {
    const [thingInputs, tokenInputs, currencyInputs] = [
      exchanges
        .filter((exchange) => exchange.thing)
        .map((exc) => ({ value: exc.value, type: "thing" as const, user: user._id, thing: exc.thing as Id })),
      exchanges.filter((exchange) => exchange.token),
      exchanges.filter((exchange) => exchange.currency),
    ];
    thingInputs.length &&
      (await this.ownershipService.deltaThings(
        await Promise.all(
          thingInputs.map(async (o) => ({
            thing: (await this.thingService.load(o.thing)) as db.shared.Thing.Doc,
            user: o.user,
            value: o.value,
          }))
        )
      ));
  }
  async #transferOutputs(user: db.User.Doc, exchanges: gql.ExchangeInput[]) {
    const [thingOutputs, tokenOutputs, currencyOutputs] = [
      exchanges
        .filter((exchange) => exchange.thing)
        .map((exc) => ({ value: exc.value, type: "thing" as const, user: user._id, thing: exc.thing as Id })),
      exchanges.filter((exchange) => exchange.token),
      exchanges.filter((exchange) => exchange.currency),
    ];
    // process thing outputs
    thingOutputs.length &&
      (await this.ownershipService.deltaThings(
        await Promise.all(
          thingOutputs.map(async (o) => ({
            thing: (await this.thingService.load(o.thing)) as db.shared.Thing.Doc,
            user: o.user,
            value: o.value,
          }))
        )
      ));
    // process token outputs
    for (const output of tokenOutputs)
      await this.contractService.transfer(output.token as Id, "root", output.wallet as Id, output.value);
  }
  async summarize(): Promise<gql.TradeSummary> {
    return {
      totalTrade: await this.Trade.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
