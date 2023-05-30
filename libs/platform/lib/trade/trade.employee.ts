import * as Trade from "./trade.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { ReceiptEmployee } from "../receipt/receipt.employee";
import { UserEmployee } from "../user/user.employee";
import { emp as external } from "@external/server";
import { emp as shared } from "@shared/server";
@Injectable()
export class TradeEmployee extends LoadService<Trade.Mdl, Trade.Doc, Trade.Input> {
  constructor(
    @InjectModel(Trade.name)
    private readonly Trade: Trade.Mdl,
    private readonly contractEmployee: shared.ContractEmployee,
    private readonly keyringEmployee: shared.KeyringEmployee,
    private readonly ownershipEmployee: shared.OwnershipEmployee,
    private readonly receiptEmployee: ReceiptEmployee,
    private readonly currencyEmployee: shared.CurrencyEmployee,
    private readonly thingEmployee: shared.ThingEmployee,
    private readonly discordEmployee: external.DiscordEmployee,
    private readonly userEmployee: UserEmployee
  ) {
    super(TradeEmployee.name, Trade);
  }
  async makeTrade(
    tradeId: Id,
    executedinputs: cnst.ExchangeInput[],
    desiredOutputs: cnst.ExchangeInput[],
    reverse: boolean,
    keyringId: Id
  ): Promise<doc.Receipt.Doc> {
    const trade = await this.Trade.pickById(tradeId);
    if (trade.policy.includes("once") && (await this.receiptEmployee.exists({ trade: trade._id })))
      throw new Error("This trade Can be executed in once");
    const [inputs, outputs] = trade.makeExchange(executedinputs, desiredOutputs, reverse);
    const user = await this.userEmployee.pick({ keyring: keyringId });
    //user가 있으면(trade 주최자가 유저면)
    const to = trade.user ?? this.userEmployee.root;
    const receipt = await this.receiptEmployee.create({
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
  //   const receipts = await this.receiptEmployee.list({ type: "trade", status: "active" });
  //   return await Promise.all(receipts.map(async (receipt) => await this.#processTradeReceipt(receipt)));
  // }
  async #processTradeReceipt(receipt: doc.Receipt.Doc) {
    const user = await this.userEmployee.get(receipt.from);
    const keyring = await this.keyringEmployee.get(user.keyring);
    const isValid =
      (await this.#validateInputs(user, keyring, receipt.inputs)) &&
      (await this.#validateOutputs(user, keyring, receipt.outputs));

    if (!isValid) throw new Error("The Input and Output is not Valid");
    await receipt.merge({ status: "inProgress" }).save();
    try {
      await this.#transferInputs(user, receipt.inputs);
      await this.#transferOutputs(user, receipt.outputs);
      await this.discordEmployee.log(`${user.nickname}'s ${receipt.name} trade is completed`);
      return await receipt.merge({ status: "success" }).save();
    } catch (err) {
      await this.discordEmployee.log(String(err));
      return await receipt.merge({ status: "failed", err }).save();
    }
  }
  async #validateInputs(user: doc.User.Doc, keyring: doc.shared.Keyring.Doc, exchanges: cnst.ExchangeInput[]) {
    let isValid = true;
    await Promise.all(
      exchanges.map(async (exchange) => {
        if (exchange.thing && !(await this.ownershipEmployee.hasThing(user._id, exchange.thing, -exchange.value)))
          isValid = false;
        else if (
          exchange.token &&
          (!exchange.wallet ||
            !exchange.hash ||
            !(await this.contractEmployee.validateTx(exchange.token, exchange.wallet, exchange.hash, exchange.value)))
        )
          isValid = false;
        else if (
          exchange.currency &&
          (!exchange.hash ||
            !(await this.currencyEmployee.validateDeposit(exchange.currency, exchange.value, exchange.hash)))
        )
          isValid = false;
      })
    );
    return isValid;
  }
  async #validateOutputs(user: doc.User.Doc, keyring: doc.shared.Keyring.Doc, exchanges: cnst.ExchangeInput[]) {
    let isValid = true;
    await Promise.all(
      exchanges.map(async (exchange) => {
        if (exchange.token) {
          if (!exchange.wallet) isValid = false;
          else if (keyring.wallets.some((wallet) => wallet.equals(exchange.wallet as Id))) isValid = false;
          else await this.contractEmployee.checkApproval(exchange.token, "root", exchange.value);
        }
      })
    );
    return isValid;
  }
  async #transferInputs(user: doc.User.Doc, exchanges: cnst.ExchangeInput[]) {
    const [thingInputs, tokenInputs, currencyInputs] = [
      exchanges
        .filter((exchange) => exchange.thing)
        .map((exc) => ({
          value: exc.value,
          type: "thing" as const,
          user: user._id,
          thing: exc.thing as Id,
        })),
      exchanges.filter((exchange) => exchange.token),
      exchanges.filter((exchange) => exchange.currency),
    ];
    thingInputs.length &&
      (await this.ownershipEmployee.deltaThings(
        await Promise.all(
          thingInputs.map(async (o) => ({
            thing: (await this.thingEmployee.load(o.thing)) as doc.shared.Thing.Doc,
            user: o.user,
            value: o.value,
          }))
        )
      ));
  }
  async #transferOutputs(user: doc.User.Doc, exchanges: cnst.ExchangeInput[]) {
    const [thingOutputs, tokenOutputs, currencyOutputs] = [
      exchanges
        .filter((exchange) => exchange.thing)
        .map((exc) => ({
          value: exc.value,
          type: "thing" as const,
          user: user._id,
          thing: exc.thing as Id,
        })),
      exchanges.filter((exchange) => exchange.token),
      exchanges.filter((exchange) => exchange.currency),
    ];
    // process thing outputs
    thingOutputs.length &&
      (await this.ownershipEmployee.deltaThings(
        await Promise.all(
          thingOutputs.map(async (o) => ({
            thing: (await this.thingEmployee.load(o.thing)) as doc.shared.Thing.Doc,
            user: o.user,
            value: o.value,
          }))
        )
      ));
    // process token outputs
    for (const output of tokenOutputs)
      await this.contractEmployee.transfer(output.token as Id, "root", output.wallet as Id, output.value);
  }
  async summarize(): Promise<cnst.TradeSummary> {
    return {
      totalTrade: await this.Trade.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
