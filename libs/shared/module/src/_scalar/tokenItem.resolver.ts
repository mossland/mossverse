import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.TokenItem)
export class TokenItemResolver {
  constructor(private readonly tokenService: srv.TokenService) {}

  @ResolveField(() => gql.Token)
  async token(@Parent() item: gql.TokenItem) {
    return await this.tokenService.load(item.token);
  }
}
