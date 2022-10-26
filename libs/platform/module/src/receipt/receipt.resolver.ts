import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, ID } from "@nestjs/graphql";
import { ReceiptService } from "./receipt.service";
import { Allow, Account, BaseResolver, Id } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UserService } from "../user/user.service";
import { ListingService } from "../listing/listing.service";
import { TradeService } from "../trade/trade.service";
import { forwardRef, Inject, UseGuards } from "@nestjs/common";
import { cnst } from "@shared/util";

@Resolver(() => gql.Receipt)
export class ReceiptResolver extends BaseResolver(
  gql.Receipt,
  gql.ReceiptInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly receiptService: ReceiptService,
    private readonly userService: UserService,
    private readonly listingService: ListingService,
    private readonly tradeService: TradeService,
    private readonly walletService: srv.shared.WalletService
  ) {
    super(receiptService);
  }

  @Query(() => [gql.Receipt])
  @UseGuards(Allow.User)
  async myReceipts(
    @Args({ name: "userId", type: () => ID }) userId: Id,
    @Args({ name: "type", type: () => String }) type: cnst.ReceiptType
  ) {
    return this.receiptService.myReceipts(userId, type);
  }

  @ResolveField(() => gql.shared.User)
  async from(@Parent() receipt: gql.Receipt) {
    return await this.userService.load(receipt.from);
  }

  @ResolveField(() => gql.shared.Wallet)
  async fromWallet(@Parent() receipt: gql.Receipt) {
    return await this.walletService.load(receipt.fromWallet);
  }

  @ResolveField(() => gql.shared.User)
  async to(@Parent() receipt: gql.Receipt) {
    return await this.userService.load(receipt.to);
  }

  @ResolveField(() => gql.shared.Wallet)
  async toWallet(@Parent() receipt: gql.Receipt) {
    return await this.walletService.load(receipt.toWallet);
  }

  @ResolveField(() => gql.Listing)
  async listing(@Parent() receipt: gql.Receipt) {
    return await this.listingService.load(receipt.listing);
  }

  @ResolveField(() => gql.Trade)
  async trade(@Parent() receipt: gql.Receipt) {
    return await this.tradeService.load(receipt.trade);
  }
}
