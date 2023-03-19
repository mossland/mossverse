import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  ObjectType,
  BaseGql,
  Int,
  Float,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Map } from "../map/map.gql";

@InputType("CollisionInput")
export class CollisionInput {
  @Field(() => Map)
  map: Map;

  @Field(() => String, { nullable: true })
  message: string | null;

  @Field(() => [Float])
  center: [number, number];

  @Field(() => [Float])
  wh: [number, number];
}

@ObjectType("Collision", { _id: "id" })
export class Collision extends BaseGql(CollisionInput) {
  @Field(() => String)
  status: cnst.CollisionStatus;
}

@ObjectType("LightCollision", { _id: "id", gqlRef: "Collision" })
export class LightCollision extends PickType(Collision, ["message", "center", "wh", "status"] as const) {}

@ObjectType("CollisionSummary")
export class CollisionSummary {
  @Field(() => Int)
  totalCollision: number;
}

export const collisionQueryMap: { [key in keyof CollisionSummary]: any } = {
  totalCollision: { status: { $ne: "inactive" } },
};

export const collisionGraphQL = createGraphQL("collision" as const, Collision, CollisionInput, LightCollision);
export const {
  getCollision,
  listCollision,
  collisionCount,
  collisionExists,
  createCollision,
  updateCollision,
  removeCollision,
  collisionFragment,
  lightCollisionFragment,
  purifyCollision,
  crystalizeCollision,
  lightCrystalizeCollision,
  defaultCollision,
  mergeCollision,
} = collisionGraphQL;
