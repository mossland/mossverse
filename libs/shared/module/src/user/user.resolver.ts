import { Resolver, Query, Mutation, Args, ResolveField, Parent, TypeMetadataStorage } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Allow, Account, BaseResolver, Id, Auth } from "@shared/util-server";
import * as srv from "../srv";
import { UserService } from "./user.service";
import * as gql from "../gql";
import * as User from "./user.model";

@Resolver(() => gql.User)
export class UserResolver extends BaseResolver(gql.User, gql.UserInput, Allow.Public, Allow.Public, Allow.Owner) {
  constructor(private readonly userService: UserService, private readonly keyringService: srv.KeyringService) {
    super(userService, keyringService);
  }
  @Query(() => gql.User)
  @UseGuards(Allow.User)
  async whoAmI(@Auth() account: Account) {
    const user = await this.userService.whoAmI(new Id(account.keyring));
    return user;
  }

  @ResolveField(() => gql.Keyring)
  async keyring(@Parent() user: User.Doc) {
    return await this.keyringService.load(user.keyring);
  }
}
