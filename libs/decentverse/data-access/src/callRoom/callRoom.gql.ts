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

@InputType("CallRoomInput")
export class CallRoomInput {
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

  @Field(() => Int)
  maxNum: number;

  @Field(() => String, { default: "call" })
  roomType: cnst.RoomType;
}

@ObjectType("CallRoom", { _id: "id" })
export class CallRoom extends BaseGql(CallRoomInput) {
  @Field(() => String)
  status: cnst.CallRoomStatus;
}

@ObjectType("LightCallRoom", { _id: "id", gqlRef: "CallRoom" })
export class LightCallRoom extends PickType(CallRoom, [
  "center",
  "wh",
  "maxNum",
  "roomType",
  "message",
  "errorMessage",
  "status",
] as const) {}

@ObjectType("CallRoomSummary")
export class CallRoomSummary {
  @Field(() => Int)
  totalCallRoom: number;
}

export const callRoomQueryMap: { [key in keyof CallRoomSummary]: any } = {
  totalCallRoom: { status: { $ne: "inactive" } },
};

export const callRoomGraphQL = createGraphQL("callRoom" as const, CallRoom, CallRoomInput, LightCallRoom);
export const {
  getCallRoom,
  listCallRoom,
  callRoomCount,
  callRoomExists,
  createCallRoom,
  updateCallRoom,
  removeCallRoom,
  callRoomFragment,
  lightCallRoomFragment,
  purifyCallRoom,
  crystalizeCallRoom,
  lightCrystalizeCallRoom,
  defaultCallRoom,
  mergeCallRoom,
} = callRoomGraphQL;
