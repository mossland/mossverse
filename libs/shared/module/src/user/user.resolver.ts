import { Resolver, Query, Mutation, Args, ResolveField, Parent, TypeMetadataStorage, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Allow, Account, BaseResolver, Id, Auth } from "@shared/util-server";
import * as srv from "../srv";
import { UserService } from "./user.service";
import * as gql from "../gql";
import * as User from "./user.model";

@Resolver(() => gql.User)
export class UserResolver extends BaseResolver(gql.User, gql.UserInput, Allow.Public, Allow.Public, Allow.Owner) {
  constructor(
    private readonly userService: UserService,
    private readonly keyringService: srv.KeyringService,
    private readonly fileService: srv.FileService
  ) {
    super(userService, keyringService);
  }

  @Mutation(() => [gql.File])
  @UseGuards(Allow.Every)
  async addUserFiles(
    @Args({ name: "files", type: () => [gql.FileUpload] }) files: gql.FileUpload[],
    @Args({ name: "userId", type: () => ID, nullable: true }) userId?: string
  ) {
    return await this.fileService.addFiles(files, "user", userId);
  }

  @Query(() => gql.User)
  @UseGuards(Allow.User)
  async whoAmI(@Auth() account: Account) {
    return await this.userService.whoAmI(new Id(account.keyring));
  }

  @ResolveField(() => gql.File, { nullable: true })
  async image(@Parent() user: gql.User) {
    return await this.fileService.load(user.image);
  }
}
