import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { CollisionEmployee } from "./collision.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.Collision)
export class CollisionResolver extends BaseResolver(
  cnst.Collision,
  cnst.CollisionInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly collisionEmployee: CollisionEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly mapEmployee: emp.MapEmployee
  ) {
    super(collisionEmployee);
  }
  @ResolveField(() => cnst.Map)
  async map(@Parent() collision: cnst.Collision) {
    return await this.mapEmployee.load(collision.map);
  }
}
