import { BaseGql, Field, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";
import { Dayjs } from "dayjs";
import { fetch as platform } from "@platform/client";

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

@ObjectType("AdvertiseSummary")
export class AdvertiseSummary {
  @Field(() => Int)
  totalAdvertise: number;
}

@ObjectType("LightAdvertise", { _id: "id", gqlRef: "Advertise" })
export class LightAdvertise extends PickType(Advertise, ["status", "closeAt", "openAt"] as const) {}

export const advertiseQueryMap: { [key in keyof AdvertiseSummary]: any } = {
  totalAdvertise: { status: { $ne: "inactive" } },
};

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
