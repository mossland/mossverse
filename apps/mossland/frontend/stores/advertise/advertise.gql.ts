import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { createGraphQL, Field, InputType, ObjectType, BaseGql, Int, Float, PickType } from "@shared/util-client";
import { gql as platform } from "@platform/data-access";
import { Dayjs } from "dayjs";

@InputType("AdvertiseInput")
export class AdvertiseInput {
  @Field(() => Date)
  closeAt: Dayjs;

  @Field(() => Date)
  openAt: Dayjs;
}

@ObjectType("Advertise", { _id: "id" })
export class Advertise extends BaseGql(AdvertiseInput) {
  @Field(() => String)
  status: cnst.AdvertiseStatus;

  @Field(() => [platform.Bid])
  bids: platform.Bid[];
}

@ObjectType("LightAdvertise", { _id: "id", gqlRef: "Advertise" })
export class LightAdvertise extends PickType(Advertise, ["status", "closeAt", "openAt"] as const) {}

export const advertiseGraphQL = createGraphQL("advertise" as const, Advertise, AdvertiseInput, LightAdvertise);
export const {
  getAdvertise,
  listAdvertise,
  advertiseCount,
  advertiseExists,
  createAdvertise,
  updateAdvertise,
  removeAdvertise,
  advertiseFragment,
  lightAdvertiseFragment,
  purifyAdvertise,
  crystalizeAdvertise,
  lightCrystalizeAdvertise,
  defaultAdvertise,
  mergeAdvertise,
} = advertiseGraphQL;
