import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { CallRoomEmployee } from "./callRoom.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.CallRoom)
export class CallRoomResolver extends BaseResolver(
  cnst.CallRoom,
  cnst.CallRoomInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly callRoomEmployee: CallRoomEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly mapEmployee: emp.MapEmployee
  ) {
    super(callRoomEmployee);
  }
  @ResolveField(() => cnst.Map)
  async map(@Parent() callRoom: cnst.CallRoom) {
    return await this.mapEmployee.load(callRoom.map);
  }
}
