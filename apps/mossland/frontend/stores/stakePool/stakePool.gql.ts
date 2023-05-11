import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { createGraphQL, Field, InputType, ObjectType, BaseGql, Int, Float, PickType } from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { gql as platform } from "@platform/data-access";

@InputType("StakePoolInput")
export class StakePoolInput {
  @Field(() => String)
  type: cnst.StakePoolType;

  @Field(() => shared.Thing)
  thing: shared.Thing;
}

@ObjectType("StakePool", { _id: "id" })
export class StakePool extends BaseGql(StakePoolInput) {
  @Field(() => String)
  status: cnst.StakePoolStatus;

  @Field(() => [platform.Staking])
  stakings: platform.Staking[];
}

@ObjectType("LightStakePool", { _id: "id", gqlRef: "StakePool" })
export class LightStakePool extends PickType(StakePool, ["status", "thing", "type"] as const) {}

@ObjectType("StakePoolSummary")
export class StakePoolSummary {
  @Field(() => Int)
  totalStakePool: number;
}

export const stakePoolGraphQL = createGraphQL("stakePool" as const, StakePool, StakePoolInput, LightStakePool);
export const {
  getStakePool,
  listStakePool,
  stakePoolCount,
  stakePoolExists,
  createStakePool,
  updateStakePool,
  removeStakePool,
  stakePoolFragment,
  lightStakePoolFragment,
  purifyStakePool,
  crystalizeStakePool,
  lightCrystalizeStakePool,
  defaultStakePool,
  mergeStakePool,
} = stakePoolGraphQL;
