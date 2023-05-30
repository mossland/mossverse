import {
  BaseGql,
  Field,
  InputOf,
  InputType,
  Int,
  ObjectType,
  PickType,
  cnst,
  createGraphQL,
  graphql,
  mutate,
} from "@util/client";
import { fetch as platform } from "@platform/client";
import { fetch as shared } from "@shared/client";

@InputType("StakePoolInput")
export class StakePoolInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  type: cnst.StakePoolType;

  @Field(() => shared.Thing)
  thing: shared.Thing;

  // @Field(() => decentverse.Map)
  // map: decentverse.Map;

  // @Field(() => [Float])
  // center: [number, number];

  // @Field(() => [Float])
  // wh: [number, number];

  // @Field(() => String)
  // url: string;

  // @Field(() => [Int])
  // size: [number, number];
}

@ObjectType("StakePool", { _id: "id" })
export class StakePool extends BaseGql(StakePoolInput) {
  @Field(() => String)
  status: cnst.StakePoolStatus;

  @Field(() => [platform.Staking])
  stakings: platform.Staking[];

  @Field(() => Int)
  totalValue: number;

  getTotalHour = () => {
    return this.stakings.reduce((acc, cur) => acc + cur.getDuration(), 0);
  };
}

@ObjectType("LightStakePool", { _id: "id", gqlRef: "StakePool" })
export class LightStakePool extends PickType(StakePool, ["status", "name", "stakings"] as const) {
  type: any;
}

@ObjectType("StakePoolSummary")
export class StakePoolSummary {
  @Field(() => Int)
  totalStakePool: number;
}

export const stakePoolQueryMap: { [key in keyof StakePoolSummary]: any } = {
  totalStakePool: { status: { $ne: "inactive" } },
};

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
  viewStakePool,
  initStakePool,
  purifyStakePool,
  crystalizeStakePool,
  lightCrystalizeStakePool,
  defaultStakePool,
  mergeStakePool,
} = stakePoolGraphQL;

// * Staking Mutation
export type AddStakingMutation = { addStaking: StakePool };
export const addStakingMutation = graphql`
  ${stakePoolFragment}
  mutation addStaking($stakePoolId: ID!, $staking: StakingInput!) {
    addStaking(stakePoolId: $stakePoolId, staking: $staking) {
      ...stakePoolFragment
    }
  }
`;

export const addStaking = async (stakePoolId: string, staking: InputOf<platform.StakingInput>) =>
  (
    await mutate<AddStakingMutation>(addStakingMutation, {
      stakePoolId,
      staking,
    })
  ).addStaking;
