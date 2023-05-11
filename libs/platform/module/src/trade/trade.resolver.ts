import { Resolver, Query, Mutation, Args, Int, ID, Parent, ResolveField } from "@nestjs/graphql";
import { TradeService } from "./trade.service";
import { Allow, Account, BaseResolver, Id, Auth } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Trade)
export class TradeResolver extends BaseResolver(gql.Trade, gql.TradeInput, Allow.Public, Allow.Public, Allow.Public) {
  constructor(private readonly tradeService: TradeService, private readonly userService: srv.shared.UserService) {
    super(tradeService);
  }
  @Mutation(() => gql.Receipt)
  @UseGuards(Allow.User)
  async makeTrade(
    @Args({ name: "tradeId", type: () => ID }) tradeId: string,
    @Args({ name: "executedInputs", type: () => [gql.ExchangeInput] }) executedInputs: gql.ExchangeInput[],
    @Args({ name: "desiredOutputs", type: () => [gql.ExchangeInput] }) desiredOutputs: gql.ExchangeInput[],
    @Args({ name: "reverse", type: () => Boolean }) reverse: boolean,
    @Auth() account: Account
  ) {
    return await this.tradeService.makeTrade(new Id(tradeId), executedInputs, desiredOutputs, reverse, account.keyring);
  }

  @ResolveField(() => gql.User)
  async user(@Parent() trade: db.Trade.Doc) {
    if (!trade.user) return null;
    return await this.userService.load(trade.user);
  }
}
