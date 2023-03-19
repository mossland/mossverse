import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { createGraphQL, Field, InputType, ObjectType, BaseGql, Int, Float, PickType } from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Map } from "../map/map.gql";

@InputType("TeleportInput")
export class TeleportInput {
  @Field(() => Map)
  map: Map;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [Float])
  center: [number, number];

  @Field(() => [Float])
  wh: [number, number];

  @Field(() => String)
  href: string;
}

@ObjectType("Teleport", { _id: "id" })
export class Teleport extends BaseGql(TeleportInput) {
  @Field(() => String)
  status: cnst.TeleportStatus;
}

@ObjectType("LightTeleport", { _id: "id", gqlRef: "Teleport" })
export class LightTeleport extends PickType(Teleport, ["center", "wh", "href", "status"] as const) {}

@ObjectType("TeleportSummary")
export class TeleportSummary {
  @Field(() => Int)
  totalTeleport: number;
}

export const teleportQueryMap: { [key in keyof TeleportSummary]: any } = {
  totalTeleport: { status: { $ne: "inactive" } },
};

export const teleportGraphQL = createGraphQL("teleport" as const, Teleport, TeleportInput, LightTeleport);
export const {
  getTeleport,
  listTeleport,
  teleportCount,
  teleportExists,
  createTeleport,
  updateTeleport,
  removeTeleport,
  teleportFragment,
  lightTeleportFragment,
  purifyTeleport,
  crystalizeTeleport,
  lightCrystalizeTeleport,
  defaultTeleport,
} = teleportGraphQL;
