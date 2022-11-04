import { Resolver, Query, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql";
import { AssetService } from "./asset.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import { UseGuards } from "@nestjs/common";
import * as gql from "../gql";
import * as db from "../db";
import * as srv from "../srv";

@Resolver(() => gql.Asset)
export class AssetResolver extends BaseResolver(gql.Asset, gql.AssetInput, Allow.Every, Allow.Every, Allow.Admin) {
  constructor(private readonly assetService: AssetService, private readonly fileService: srv.shared.FileService) {
    super(assetService);
  }
  @Mutation(() => [gql.shared.File])
  @UseGuards(Allow.Admin)
  async addAssetFiles(
    @Args({ name: "files", type: () => [gql.shared.FileUpload] }) files: gql.shared.FileUpload[],
    @Args({ name: "assetId", type: () => String, nullable: true }) assetId?: string
  ) {
    return await this.fileService.addFiles(files, "asset", assetId);
  }
  // * Resolve Fields
  @ResolveField(() => gql.shared.File)
  async top(@Parent() asset: gql.Asset) {
    return await this.fileService.load(asset.top);
  }
  @ResolveField(() => gql.shared.File)
  async bottom(@Parent() asset: gql.Asset) {
    return await this.fileService.load(asset.bottom);
  }
  @ResolveField(() => gql.shared.File)
  async lighting(@Parent() asset: gql.Asset) {
    return await this.fileService.load(asset.lighting);
  }
}
