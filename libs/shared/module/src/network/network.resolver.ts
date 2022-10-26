import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { NetworkService } from "./network.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.Network)
export class NetworkResolver extends BaseResolver(
  gql.Network,
  gql.NetworkInput,
  Allow.Public,
  Allow.Public,
  Allow.SuperAdmin
) {
  constructor(private readonly networkService: NetworkService) {
    super(networkService);
  }
}
