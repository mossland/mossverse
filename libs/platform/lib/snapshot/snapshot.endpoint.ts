import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { Resolver } from "@nestjs/graphql";
import { SnapshotEmployee } from "./snapshot.employee";

@Resolver(() => cnst.Snapshot)
export class SnapshotResolver extends BaseResolver(
  cnst.Snapshot,
  cnst.SnapshotInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly snapshotEmployee: SnapshotEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee
  ) {
    super(snapshotEmployee);
  }
}
