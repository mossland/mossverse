import * as cnstt from "../cnst";
import { Account, Allow, BaseResolver, Id, RequiredAuth, cnst } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FileEmployee } from "../file/file.employee";
import { KeyringEmployee } from "../keyring/keyring.employee";
import { UseGuards } from "@nestjs/common";
import { UserEmployee } from "./user.employee";

@Resolver(() => cnstt.User)
export class UserResolver extends BaseResolver(cnstt.User, cnstt.UserInput, Allow.Public, Allow.Public, Allow.Owner) {
  constructor(
    private readonly userEmployee: UserEmployee,
    private readonly keyringEmployee: KeyringEmployee,
    private readonly fileEmployee: FileEmployee
  ) {
    super(userEmployee, keyringEmployee);
  }

  @Mutation(() => [cnstt.File])
  @UseGuards(Allow.Every)
  async addUserFiles(
    @Args({ name: "files", type: () => [cnstt.FileUpload] }) files: cnstt.FileUpload[],
    @Args({ name: "metas", type: () => [cnstt.FileMeta] }) metas: cnstt.FileMeta[],
    @Args({ name: "userId", type: () => ID, nullable: true }) userId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "user", userId);
  }

  @Mutation(() => cnstt.User)
  @UseGuards(Allow.Every)
  async addUserRole(
    @Args({ name: "userId", type: () => ID }) userId: string,
    @Args({ name: "role", type: () => String }) role: cnst.UserRole
  ) {
    return await this.userEmployee.addUserRole(new Id(userId), role);
  }
  @Mutation(() => cnstt.User)
  @UseGuards(Allow.Admin)
  async subUserRole(
    @Args({ name: "userId", type: () => ID }) userId: string,
    @Args({ name: "role", type: () => String }) role: cnst.UserRole
  ) {
    return await this.userEmployee.subUserRole(new Id(userId), role);
  }

  @Mutation(() => cnstt.User)
  @UseGuards(Allow.Admin)
  async restrictUser(
    @Args({ name: "userId", type: () => ID }) userId: string,
    @Args({ name: "restrictReason", type: () => String })
    restrictReason: string,
    @Args({ name: "restrictUntil", type: () => Date, nullable: true })
    restrictUntil?: Date
  ) {
    return await this.userEmployee.restrictUser(new Id(userId), restrictReason, restrictUntil);
  }

  @Mutation(() => cnstt.User)
  @UseGuards(Allow.Admin)
  async releaseUser(@Args({ name: "userId", type: () => ID }) userId: string) {
    return await this.userEmployee.releaseUser(new Id(userId));
  }

  @Mutation(() => cnstt.User, { name: "removeUser" })
  @UseGuards(Allow.Every)
  async remove(@Args({ name: `userId`, type: () => ID }) userId: string, @RequiredAuth() account: Account) {
    if (account.role !== "admin" && !account._id.equals(userId)) throw new Error("Not authorized");
    const user = await this.userEmployee.remove(new Id(userId));
    await this.keyringEmployee.remove(user.keyring);
    return user;
  }

  @ResolveField(() => cnstt.File, { nullable: true })
  async image(@Parent() user: cnstt.User) {
    return await this.fileEmployee.load(user.image);
  }
}
