import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { ThingService } from "./thing.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";
import { FileService } from "../file/file.service";

@Resolver(() => gql.Thing)
export class ThingResolver extends BaseResolver(gql.Thing, gql.ThingInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(private readonly thingService: ThingService, private readonly fileService: FileService) {
    super(thingService);
  }
  @Mutation(() => [gql.File])
  @UseGuards(Allow.Admin)
  async addThingFiles(
    @Args({ name: "files", type: () => [gql.FileUpload] }) files: gql.FileUpload[],
    @Args({ name: "thingId", type: () => ID, nullable: true }) thingId?: string
  ) {
    return await this.fileService.addFiles(files, "thing", thingId);
  }
  @ResolveField(() => gql.File)
  async image(@Parent() thing: gql.Thing) {
    return await this.fileService.load(thing.image);
  }
}
