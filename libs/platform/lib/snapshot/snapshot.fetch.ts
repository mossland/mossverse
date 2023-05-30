import { BaseGql, Field, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";

@InputType("SnapshotInput")
export class SnapshotInput {
  @Field(() => String)
  field: string;
}

@ObjectType("Snapshot", { _id: "id" })
export class Snapshot extends BaseGql(SnapshotInput) {
  @Field(() => String)
  status: cnst.SnapshotStatus;
}

@ObjectType("LightSnapshot", { _id: "id", gqlRef: "Snapshot" })
export class LightSnapshot extends PickType(Snapshot, ["status"] as const) {}

@ObjectType("SnapshotSummary")
export class SnapshotSummary {
  @Field(() => Int)
  totalSnapshot: number;
}

export const snapshotQueryMap = {
  // getSnapshot: "snapshot",
  // listSnapshot: "snapshots",
  // snapshotCount: "snapshotCount",
};
export const snapshotGraphQL = createGraphQL("snapshot" as const, Snapshot, SnapshotInput, LightSnapshot);
export const {
  getSnapshot,
  listSnapshot,
  snapshotCount,
  snapshotExists,
  createSnapshot,
  updateSnapshot,
  removeSnapshot,
  snapshotFragment,
  lightSnapshotFragment,
  purifySnapshot,
  crystalizeSnapshot,
  lightCrystalizeSnapshot,
  defaultSnapshot,
  mergeSnapshot,
} = snapshotGraphQL;
