import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.Entry)
export class EntryResolver {
  constructor(private readonly userService: srv.shared.UserService) {}

  @ResolveField(() => gql.shared.User)
  async user(@Parent() entry: gql.Entry) {
    return await this.userService.load(entry.user);
  }
}
