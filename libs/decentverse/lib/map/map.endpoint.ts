import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { MapEmployee } from "./map.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Map)
export class MapResolver extends BaseResolver(cnst.Map, cnst.MapInput, Allow.Every, Allow.Every, Allow.Admin) {
  constructor(private readonly mapEmployee: MapEmployee, private readonly fileEmployee: emp.shared.FileEmployee) {
    super(mapEmployee);
  }
  @Mutation(() => [cnst.shared.File])
  @UseGuards(Allow.Admin)
  async addMapFiles(
    @Args({ name: "files", type: () => [cnst.shared.FileUpload] })
    files: cnst.shared.FileUpload[],
    @Args({ name: "metas", type: () => [cnst.shared.FileMeta] })
    metas: cnst.shared.FileMeta[],
    @Args({ name: "mapId", type: () => ID, nullable: true }) mapId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "map", mapId);
  }
  @ResolveField(() => cnst.shared.File)
  async splash(@Parent() map: doc.Map.Doc) {
    return await this.fileEmployee.load(map.splash);
  }
  @ResolveField(() => cnst.shared.File)
  async logo(@Parent() map: doc.Map.Doc) {
    return await this.fileEmployee.load(map.logo);
  }
  @ResolveField(() => cnst.shared.File)
  async miniView(@Parent() map: doc.Map.Doc) {
    return await this.fileEmployee.load(map.miniView);
  }
}
