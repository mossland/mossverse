import * as cnst from "../cnst";
import * as emp from "../emp";
import { Account, Allow, Auth, BaseResolver, Id, Signature } from "@util/server";
import { Args, Float, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ListingEmployee } from "./listing.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Listing)
export class ListingResolver extends BaseResolver(
  cnst.Listing,
  cnst.ListingInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly listingEmployee: ListingEmployee,
    private readonly userEmployee: emp.UserEmployee,
    private readonly walletEmployee: emp.shared.WalletEmployee,
    private readonly tokenEmployee: emp.shared.TokenEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee,
    private readonly productEmployee: emp.shared.ProductEmployee
  ) {
    super(listingEmployee);
  }

  @Mutation(() => cnst.Listing)
  @UseGuards(Allow.User)
  async generateListing(
    @Args({ name: "data", type: () => cnst.ListingInput })
    data: cnst.ListingInput,
    @Signature() address: string
  ) {
    return await this.listingEmployee.generateListing(data, address);
  }

  @Mutation(() => cnst.Receipt)
  @UseGuards(Allow.User)
  async purchaseListing(
    @Args({ name: "listingId", type: () => ID }) listingId: Id,
    @Args({ name: "priceTag", type: () => cnst.PriceTagInput })
    priceTag: cnst.PriceTagInput,
    @Args({ name: "value", type: () => Float }) value: number,
    @Args({ name: "shipInfo", type: () => cnst.ShipInfoInput, nullable: true })
    shipInfo: cnst.ShipInfoInput | null,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.listingEmployee.purchaseListing(
      new Id(listingId),
      priceTag,
      value,
      shipInfo,
      new Id(account.keyring),
      address
    );
  }

  @Mutation(() => cnst.Listing)
  @UseGuards(Allow.User)
  async closeListing(
    @Args({ name: "listingId", type: () => ID }) listingId: Id,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.listingEmployee.closeListing(new Id(listingId));
  }

  @ResolveField(() => cnst.shared.User)
  async user(@Parent() listing: cnst.Listing) {
    return await this.userEmployee.load(listing.user);
  }

  @ResolveField(() => cnst.shared.Wallet)
  async wallet(@Parent() listing: cnst.Listing) {
    return await this.walletEmployee.load(listing.wallet);
  }

  @ResolveField(() => cnst.shared.Token)
  async token(@Parent() listing: cnst.Listing) {
    if (!listing.token) return null;
    return await this.tokenEmployee.load(listing.token);
  }

  @ResolveField(() => cnst.shared.Thing)
  async thing(@Parent() listing: cnst.Listing) {
    if (!listing.thing) return null;
    return await this.thingEmployee.load(listing.thing);
  }

  @ResolveField(() => cnst.shared.Product)
  async product(@Parent() listing: cnst.Listing) {
    if (!listing.product) return null;
    return await this.productEmployee.load(listing.product);
  }
}
