import { Resolver, Query, Mutation, Args, ResolveField, Parent, TypeMetadataStorage, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Allow, Account, BaseResolver, Id, Auth, RequiredAuth } from "@shared/util-server";
import { UserService } from "./user.service";
import { KeyringService } from "../keyring/keyring.service";
import { FileService } from "../file/file.service";
import * as gql from "../gql";
import * as User from "./user.model";
import { cnst } from "@shared/util";

@Resolver(() => gql.User)
export class UserResolver extends BaseResolver(gql.User, gql.UserInput, Allow.Public, Allow.Public, Allow.Owner) {
  constructor(
    private readonly userService: UserService,
    private readonly keyringService: KeyringService,
    private readonly fileService: FileService
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

  @Mutation(() => gql.User)
  @UseGuards(Allow.Admin)
  async addUserRole(
    @Args({ name: "userId", type: () => ID }) userId: string,
    @Args({ name: "role", type: () => String }) role: cnst.UserRole
  ) {
    return await this.userService.addUserRole(new Id(userId), role);
  }
  @Mutation(() => gql.User)
  @UseGuards(Allow.Admin)
  async subUserRole(
    @Args({ name: "userId", type: () => ID }) userId: string,
    @Args({ name: "role", type: () => String }) role: cnst.UserRole
  ) {
    return await this.userService.subUserRole(new Id(userId), role);
  }

  @Mutation(() => gql.User)
  @UseGuards(Allow.Admin)
  async restrictUser(
    @Args({ name: "userId", type: () => ID }) userId: string,
    @Args({ name: "restrictReason", type: () => String }) restrictReason: string,
    @Args({ name: "restrictUntil", type: () => Date, nullable: true }) restrictUntil?: Date
  ) {
    return await this.userService.restrictUser(new Id(userId), restrictReason, restrictUntil);
  }

  @Mutation(() => gql.User)
  @UseGuards(Allow.Admin)
  async releaseUser(@Args({ name: "userId", type: () => ID }) userId: string) {
    return await this.userService.releaseUser(new Id(userId));
  }

  @Mutation(() => gql.User, { name: "removeUser" })
  @UseGuards(Allow.Every)
  async remove(@Args({ name: `userId`, type: () => ID }) userId: string, @RequiredAuth() account: Account) {
    if (account.role !== "admin" && !account._id.equals(userId)) throw new Error("Not authorized");
    const user = await this.userService.remove(new Id(userId));
    await this.keyringService.remove(user.keyring);
    return user;
  }

  @ResolveField(() => gql.File, { nullable: true })
  async image(@Parent() user: gql.User) {
    return await this.fileService.load(user.image);
  }
}
