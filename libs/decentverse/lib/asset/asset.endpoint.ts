import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { AssetEmployee } from "./asset.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Asset)
export class AssetResolver extends BaseResolver(cnst.Asset, cnst.AssetInput, Allow.Every, Allow.Every, Allow.Admin) {
  constructor(private readonly assetEmployee: AssetEmployee, private readonly fileEmployee: emp.shared.FileEmployee) {
    super(assetEmployee);
  }
  @Mutation(() => [cnst.shared.File])
  @UseGuards(Allow.Admin)
  async addAssetFiles(
    @Args({ name: "files", type: () => [cnst.shared.FileUpload] })
    files: cnst.shared.FileUpload[],
    @Args({ name: "metas", type: () => [cnst.shared.FileMeta] })
    metas: cnst.shared.FileMeta[],
    @Args({ name: "assetId", type: () => ID, nullable: true }) assetId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "asset", assetId);
  }
  // * Resolve Fields
  @ResolveField(() => cnst.shared.File)
  async top(@Parent() asset: cnst.Asset) {
    return await this.fileEmployee.load(asset.top);
  }
  @ResolveField(() => cnst.shared.File)
  async wall(@Parent() asset: cnst.Asset) {
    return await this.fileEmployee.load(asset.wall);
  }
  @ResolveField(() => cnst.shared.File)
  async bottom(@Parent() asset: cnst.Asset) {
    return await this.fileEmployee.load(asset.bottom);
  }
  @ResolveField(() => cnst.shared.File)
  async lighting(@Parent() asset: cnst.Asset) {
    return await this.fileEmployee.load(asset.lighting);
  }
}
