import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { ListingEmployee } from "../listing/listing.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ReceiptEmployee } from "./receipt.employee";
import { TradeEmployee } from "../trade/trade.employee";
import { UserEmployee } from "../user/user.employee";

@Resolver(() => cnst.Receipt)
export class ReceiptResolver extends BaseResolver(
  cnst.Receipt,
  cnst.ReceiptInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly receiptEmployee: ReceiptEmployee,
    private readonly userEmployee: UserEmployee,
    private readonly listingEmployee: ListingEmployee,
    private readonly tradeEmployee: TradeEmployee,
    private readonly walletEmployee: emp.shared.WalletEmployee
  ) {
    super(receiptEmployee);
  }

  // @Query(() => [cnst.Receipt])
  // @UseGuards(Allow.User)
  // async myReceipts(
  //   @Args({ name: "userId", type: () => ID }) userId: Id,
  //   @Args({ name: "type", type: () => String }) type: cnst.ReceiptType
  // ) {
  //   return this.receiptEmployee.myReceipts(userId, type);
  // }

  @ResolveField(() => cnst.shared.User)
  async from(@Parent() receipt: cnst.Receipt) {
    return await this.userEmployee.load(receipt.from);
  }

  @ResolveField(() => cnst.shared.Wallet)
  async fromWallet(@Parent() receipt: cnst.Receipt) {
    return await this.walletEmployee.load(receipt.fromWallet);
  }

  @ResolveField(() => cnst.shared.User)
  async to(@Parent() receipt: cnst.Receipt) {
    return await this.userEmployee.load(receipt.to);
  }

  @ResolveField(() => cnst.shared.Wallet)
  async toWallet(@Parent() receipt: cnst.Receipt) {
    return await this.walletEmployee.load(receipt.toWallet);
  }

  @ResolveField(() => cnst.Listing)
  async listing(@Parent() receipt: cnst.Receipt) {
    return await this.listingEmployee.load(receipt.listing);
  }

  @ResolveField(() => cnst.Trade)
  async trade(@Parent() receipt: cnst.Receipt) {
    return await this.tradeEmployee.load(receipt.trade);
  }
}
