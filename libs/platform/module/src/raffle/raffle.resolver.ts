import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { RaffleService } from "./raffle.service";
import { Allow, Account, BaseResolver, Id, Auth, Signature } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Raffle)
export class RaffleResolver extends BaseResolver(gql.Raffle, gql.RaffleInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(
    private readonly raffleService: RaffleService,
    private readonly fileService: srv.shared.FileService,
    private readonly userService: srv.UserService,
    private readonly walletService: srv.shared.WalletService,
    private readonly tokenService: srv.shared.TokenService,
    private readonly thingService: srv.shared.ThingService,
    private readonly productService: srv.shared.ProductService
  ) {
    super(raffleService);
  }

  @Mutation(() => gql.Receipt)
  @UseGuards(Allow.User)
  async raffle(
    @Args({ name: "raffleId", type: () => ID }) raffleId: Id,
    @Args({ name: "priceTag", type: () => gql.PriceTagInput }) priceTag: gql.PriceTagInput,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.raffleService.raffle(new Id(raffleId), priceTag, new Id(account.keyring), address);
  }

  @Mutation(() => gql.ShipInfo)
  @UseGuards(Allow.User)
  async addWinnerShipInfo(
    @Args({ name: "raffleId", type: () => ID }) raffleId: Id,
    @Args({ name: "shipInfo", type: () => gql.ShipInfoInput }) shipInfo: gql.ShipInfoInput,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.raffleService.addWinnerShipInfo(new Id(raffleId), shipInfo, new Id(account.keyring), address);
  }

  @ResolveField(() => [gql.shared.User])
  async user(@Parent() raffle: gql.Raffle) {
    if (!raffle.winners) return null;
    return await this.userService.loadMany(raffle.winners);
  }
  @ResolveField(() => [gql.shared.User])
  async winners(@Parent() raffle: gql.Raffle) {
    if (!raffle.winners) return null;
    return await this.userService.loadMany(raffle.winners);
  }
  @ResolveField(() => gql.shared.Token)
  async token(@Parent() raffle: gql.Raffle) {
    if (!raffle.token) return null;
    return await this.tokenService.load(raffle.token);
  }

  @ResolveField(() => gql.shared.Thing)
  async thing(@Parent() raffle: gql.Raffle) {
    if (!raffle.thing) return null;
    return await this.thingService.load(raffle.thing);
  }

  @ResolveField(() => gql.shared.Product)
  async product(@Parent() raffle: gql.Raffle) {
    if (!raffle.product) return null;
    return await this.productService.load(raffle.product);
  }
}
