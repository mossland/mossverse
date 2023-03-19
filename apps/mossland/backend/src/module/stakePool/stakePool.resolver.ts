import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { StakePoolService } from "./stakePool.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.StakePool)
export class StakePoolResolver extends BaseResolver(
  gql.StakePool,
  gql.StakePoolInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly stakePoolService: StakePoolService,
    private readonly fileService: srv.shared.FileService,
    private readonly userService: srv.UserService,
    private readonly walletService: srv.shared.WalletService,
    private readonly tokenService: srv.shared.TokenService,
    private readonly thingService: srv.shared.ThingService
  ) {
    super(stakePoolService);
  }

  @ResolveField(() => gql.shared.Thing)
  async thing(@Parent() stakePool: gql.StakePool) {
    if (!stakePool.thing) return null;
    return await this.thingService.load(stakePool.thing);
  }
}
