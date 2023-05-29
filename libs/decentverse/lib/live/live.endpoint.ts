import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { LiveEmployee } from "./live.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.Live)
export class LiveResolver extends BaseResolver(cnst.Live, cnst.LiveInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(
    private readonly liveEmployee: LiveEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly mapEmployee: emp.MapEmployee
  ) {
    super(liveEmployee);
  }
  @ResolveField(() => cnst.Map)
  async map(@Parent() live: cnst.Live) {
    return await this.mapEmployee.load(live.map);
  }
}
