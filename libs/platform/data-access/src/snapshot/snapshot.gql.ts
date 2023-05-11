import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { createGraphQL, Field, InputType, ObjectType, BaseGql, Int, Float, PickType } from "@shared/util-client";
import { gql as shared } from "@shared/data-access";

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
