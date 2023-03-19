import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { ShipInfoService } from "./shipInfo.service";
import { Allow, Account, BaseResolver, Id } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.ShipInfo)
export class ShipInfoResolver extends BaseResolver(
  gql.ShipInfo,
  gql.ShipInfoInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly shipInfoService: ShipInfoService,
    private readonly fileService: srv.shared.FileService,
    private readonly userService: srv.shared.UserService,
    private readonly productService: srv.shared.ProductService
  ) {
    super(shipInfoService);
  }

  @Query(() => gql.ShipInfo)
  @UseGuards(Allow.User)
  async getMyShipInfo(
    @Args({ name: "userId", type: () => ID }) userId: Id,
    @Args({ name: "productId", type: () => ID }) productId: Id
  ) {
    return await this.shipInfoService.getShipInfo(new Id(userId), new Id(productId));
  }

  @ResolveField(() => [gql.shared.User])
  async user(@Parent() shipInfo: gql.ShipInfo) {
    if (!shipInfo.user) return null;
    return await this.userService.load(shipInfo.user);
  }

  @ResolveField(() => [gql.shared.Product])
  async product(@Parent() shipInfo: gql.ShipInfo) {
    if (!shipInfo.product) return null;
    return await this.productService.load(shipInfo.product);
  }
}
