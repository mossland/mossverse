import { Resolver, Query, Mutation, Args, Int, ID } from "@nestjs/graphql";
import { TradeService } from "./trade.service";
import { Allow, Account, BaseResolver, Id, Auth } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class TradeResolver extends BaseResolver(gql.Trade, gql.TradeInput, Allow.Public, Allow.Public, Allow.Public) {
  constructor(private readonly tradeService: TradeService) {
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
}
