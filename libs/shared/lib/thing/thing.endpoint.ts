import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FileEmployee } from "../file/file.employee";
import { ThingEmployee } from "./thing.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Thing)
export class ThingResolver extends BaseResolver(cnst.Thing, cnst.ThingInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(private readonly thingEmployee: ThingEmployee, private readonly fileEmployee: FileEmployee) {
    super(thingEmployee);
  }
  @Mutation(() => [cnst.File])
  @UseGuards(Allow.Admin)
  async addThingFiles(
    @Args({ name: "files", type: () => [cnst.FileUpload] }) files: cnst.FileUpload[],
    @Args({ name: "metas", type: () => [cnst.FileMeta] }) metas: cnst.FileMeta[],
    @Args({ name: "thingId", type: () => ID, nullable: true }) thingId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "thing", thingId);
  }
  @ResolveField(() => cnst.File)
  async image(@Parent() thing: cnst.Thing) {
    return await this.fileEmployee.load(thing.image);
  }
}
