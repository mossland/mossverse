import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { TokenService } from "./token.service";
import { Allow, Account, BaseResolver, Id } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";
import { FileService } from "../file/file.service";
import { ContractService } from "../contract/contract.service";

@Resolver(() => gql.Token)
export class TokenResolver extends BaseResolver(gql.Token, gql.TokenInput, Allow.Every, Allow.Every, Allow.None) {
  constructor(
    private readonly tokenService: TokenService,
    private readonly fileService: FileService,
    private readonly contractService: ContractService
  ) {
    super(tokenService);
  }
  @Mutation(() => [gql.File])
  @UseGuards(Allow.Admin)
  async addTokenFiles(
    @Args({ name: "files", type: () => [gql.FileUpload] }) files: gql.FileUpload[],
    @Args({ name: "tokenId", type: () => ID, nullable: true }) tokenId?: string
  ) {
    return await this.fileService.addFiles(files, "token", tokenId);
  }

  @UseGuards(Allow.Every)
  @Mutation(() => gql.Token)
  async generateToken(
    @Args({ type: () => ID, name: "contractId" }) contractId: string,
    @Args({ type: () => Int, name: "tokenId" }) tokenId: number
  ) {
    const contract = await this.contractService.get(new Id(contractId));
    return await this.tokenService.generate(contract, tokenId);
  }

  @ResolveField(() => gql.File)
  async image(@Parent() token: gql.Token) {
    return await this.fileService.load(token.image);
  }

  @ResolveField(() => gql.Contract)
  async contract(@Parent() token: gql.Token) {
    return await this.contractService.load(token.contract);
  }
}
