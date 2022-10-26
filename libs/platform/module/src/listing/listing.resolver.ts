import { Resolver, Query, Mutation, Args, Int, ID, Float, ResolveField, Parent } from "@nestjs/graphql";
import { ListingService } from "./listing.service";
import { Allow, Account, BaseResolver, Id, Auth, Signature } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";
import { UserService } from "../srv";

@Resolver(() => gql.Listing)
export class ListingResolver extends BaseResolver(
  gql.Listing,
  gql.ListingInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly listingService: ListingService,
    private readonly userService: srv.UserService,
    private readonly walletService: srv.shared.WalletService,
    private readonly tokenService: srv.shared.TokenService,
    private readonly thingService: srv.shared.ThingService,
    private readonly productService: srv.shared.ProductService
  ) {
    super(listingService);
  }

  @Mutation(() => gql.Listing)
  @UseGuards(Allow.User)
  async generateListing(
    @Args({ name: "data", type: () => gql.ListingInput }) data: gql.ListingInput,
    @Signature() address: string
  ) {
    return await this.listingService.generateListing(data, address);
  }

  @Mutation(() => gql.Receipt)
  @UseGuards(Allow.User)
  async purchaseListing(
    @Args({ name: "listingId", type: () => ID }) listingId: Id,
    @Args({ name: "priceTag", type: () => gql.PriceTagInput }) priceTag: gql.PriceTagInput,
    @Args({ name: "num", type: () => Float }) num: number,
    @Args({ name: "shipInfo", type: () => gql.ShipInfoInput, nullable: true }) shipInfo: gql.ShipInfoInput | null,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.listingService.purchaseListing(
      new Id(listingId),
      priceTag,
      num,
      shipInfo,
      new Id(account.keyring),
      address
    );
  }

  @Mutation(() => gql.Listing)
  @UseGuards(Allow.User)
  async closeListing(
    @Args({ name: "listingId", type: () => ID }) listingId: Id,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.listingService.closeListing(new Id(listingId));
  }

  @ResolveField(() => gql.shared.User)
  async user(@Parent() listing: gql.Listing) {
    return await this.userService.load(listing.user);
  }

  @ResolveField(() => gql.shared.Wallet)
  async wallet(@Parent() listing: gql.Listing) {
    return await this.walletService.load(listing.wallet);
  }

  @ResolveField(() => gql.shared.Token)
  async token(@Parent() listing: gql.Listing) {
    if (!listing.token) return null;
    return await this.tokenService.load(listing.token);
  }

  @ResolveField(() => gql.shared.Thing)
  async thing(@Parent() listing: gql.Listing) {
    if (!listing.thing) return null;
    return await this.thingService.load(listing.thing);
  }

  @ResolveField(() => gql.shared.Product)
  async product(@Parent() listing: gql.Listing) {
    if (!listing.product) return null;
    return await this.productService.load(listing.product);
  }
}
