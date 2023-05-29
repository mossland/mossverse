import * as cnst from "../cnst";
import { Allow, BaseResolver, Id } from "@util/server";
import { Args, ID, Int, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ContractEmployee } from "../contract/contract.employee";
import { FileEmployee } from "../file/file.employee";
import { TokenEmployee } from "./token.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Token)
export class TokenResolver extends BaseResolver(cnst.Token, cnst.TokenInput, Allow.Every, Allow.Every, Allow.None) {
  constructor(
    private readonly tokenEmployee: TokenEmployee,
    private readonly fileEmployee: FileEmployee,
    private readonly contractEmployee: ContractEmployee
  ) {
    super(tokenEmployee);
  }
  @Mutation(() => [cnst.File])
  @UseGuards(Allow.Admin)
  async addTokenFiles(
    @Args({ name: "files", type: () => [cnst.FileUpload] }) files: cnst.FileUpload[],
    @Args({ name: "metas", type: () => [cnst.FileMeta] }) metas: cnst.FileMeta[],
    @Args({ name: "tokenId", type: () => ID, nullable: true }) tokenId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "token", tokenId);
  }

  @UseGuards(Allow.Every)
  @Mutation(() => cnst.Token)
  async generateToken(
    @Args({ type: () => ID, name: "contractId" }) contractId: string,
    @Args({ type: () => Int, name: "tokenId" }) tokenId: number
  ) {
    const contract = await this.contractEmployee.get(new Id(contractId));
    return await this.tokenEmployee.generate(contract, tokenId);
  }

  @ResolveField(() => cnst.File)
  async image(@Parent() token: cnst.Token) {
    return await this.fileEmployee.load(token.image);
  }

  @ResolveField(() => cnst.Contract)
  async contract(@Parent() token: cnst.Token) {
    return await this.contractEmployee.load(token.contract);
  }
}
