import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import * as cnst from "../cnst";
import * as emp from "../emp";

@Resolver(() => cnst.Flow)
export class FlowResolver {
  constructor(
    // private readonly characterEmployee: CharacterEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee
  ) {}

  @ResolveField(() => cnst.shared.File)
  async image(@Parent() flow: cnst.Flow) {
    return await this.fileEmployee.load(flow.image);
  }

  @ResolveField(() => cnst.shared.File)
  async background(@Parent() flow: cnst.Flow) {
    return await this.fileEmployee.load(flow.image);
  }
}
