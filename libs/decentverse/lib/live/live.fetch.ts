import { BaseGql, Field, Float, InputType, Int, ObjectType, PickType, createGraphQL } from "@util/client";
import { Map } from "../map/map.fetch";
import { cnst } from "@util/client";

@InputType("LiveInput")
export class LiveInput {
  @Field(() => Map)
  map: Map;

  @Field(() => String, { nullable: true })
  message: string | null;

  @Field(() => String, { nullable: true })
  errorMessage: string | null;

  @Field(() => [Float])
  center: [number, number];

  @Field(() => [Float])
  wh: [number, number];

  @Field(() => String)
  src: string;
}

@ObjectType("Live", { _id: "id" })
export class Live extends BaseGql(LiveInput) {
  @Field(() => String)
  status: cnst.LiveStatus;
}

@ObjectType("LightLive", { _id: "id", gqlRef: "Live" })
export class LightLive extends PickType(Live, ["message", "errorMessage", "center", "wh", "src", "status"] as const) {}

@ObjectType("LiveSummary")
export class LiveSummary {
  @Field(() => Int)
  totalLive: number;
}

export const liveQueryMap: { [key in keyof LiveSummary]: any } = {
  totalLive: { status: { $ne: "inactive" } },
};

export const liveGraphQL = createGraphQL("live" as const, Live, LiveInput, LightLive);
export const {
  getLive,
  listLive,
  liveCount,
  liveExists,
  createLive,
  updateLive,
  removeLive,
  liveFragment,
  lightLiveFragment,
  purifyLive,
  crystalizeLive,
  lightCrystalizeLive,
  defaultLive,
  mergeLive,
  initLive,
  viewLive,
  editLive,
} = liveGraphQL;
