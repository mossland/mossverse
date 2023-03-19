import { Resolver, Query, Mutation, Args, Int, ID, Float, ResolveField, Parent } from "@nestjs/graphql";
import { AdvertiseService } from "./advertise.service";
import { Allow, Account, BaseResolver, Id, Auth, Signature } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";
import { UserService } from "../srv";

@Resolver(() => gql.Advertise)
export class AdvertiseResolver extends BaseResolver(
  gql.Advertise,
  gql.AdvertiseInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly AdvertiseService: AdvertiseService,
    private readonly userService: srv.UserService,
    private readonly walletService: srv.shared.WalletService,
    private readonly tokenService: srv.shared.TokenService,
    private readonly thingService: srv.shared.ThingService,
    private readonly productService: srv.shared.ProductService
  ) {
    super(AdvertiseService);
  }
}
