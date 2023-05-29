import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Account, Allow, Auth, BaseResolver, Id } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { TradeEmployee } from "./trade.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Trade)
export class TradeResolver extends BaseResolver(cnst.Trade, cnst.TradeInput, Allow.Public, Allow.Public, Allow.Public) {
  constructor(private readonly tradeEmployee: TradeEmployee, private readonly userEmployee: emp.shared.UserEmployee) {
    super(tradeEmployee);
  }
  @Mutation(() => cnst.Receipt)
  @UseGuards(Allow.User)
  async makeTrade(
    @Args({ name: "tradeId", type: () => ID }) tradeId: string,
    @Args({ name: "executedInputs", type: () => [cnst.ExchangeInput] })
    executedInputs: cnst.ExchangeInput[],
    @Args({ name: "desiredOutputs", type: () => [cnst.ExchangeInput] })
    desiredOutputs: cnst.ExchangeInput[],
    @Args({ name: "reverse", type: () => Boolean }) reverse: boolean,
    @Auth() account: Account
  ) {
    return await this.tradeEmployee.makeTrade(
      new Id(tradeId),
      executedInputs,
      desiredOutputs,
      reverse,
      account.keyring
    );
  }

  @ResolveField(() => cnst.User)
  async user(@Parent() trade: doc.Trade.Doc) {
    if (!trade.user) return null;
    return await this.userEmployee.load(trade.user);
  }
}
