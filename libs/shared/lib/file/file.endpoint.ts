import * as cnst from "../cnst";
import { Allow, BaseResolver, Id } from "@util/server";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileEmployee } from "./file.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.File)
export class FileResolver extends BaseResolver(cnst.File, cnst.FileInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(private readonly fileEmployee: FileEmployee) {
    super(fileEmployee);
  }
  @Mutation(() => [cnst.File])
  @UseGuards(Allow.Every)
  async addFiles(
    @Args({ name: "files", type: () => [cnst.FileUpload] }) files: cnst.FileUpload[],
    @Args({ name: "metas", type: () => [cnst.FileMeta] }) metas: cnst.FileMeta[],
    @Args({ name: "parentId", type: () => ID, nullable: true }) parentId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "file", parentId);
  }
  @UseGuards(Allow.Public)
  @Query(() => cnst.File, { name: `getFile` })
  async get(@Args({ name: `fileId`, type: () => ID }) id: string) {
    return await this.fileEmployee.get(new Id(id));
  }
}
