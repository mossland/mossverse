import { Resolver, Query, Parent, Args } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";
import { WalletService } from "../wallet/wallet.service";
import { TokenService } from "../token/token.service";
import { Id } from "@shared/util-server";
@Resolver(() => gql.Reference)
export class ReferenceResolver {
  constructor() {
    //
  }
  @Query(() => gql.Reference)
  async dumbReferenceQuery() {
    return true;
  }
}
