import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  createFragment,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  Int,
  BaseArrayFieldGql,
  makeDefault,
} from "@shared/util-client";

@InputType("CallRoomInput")
export class CallRoomInput {
  @Field(() => String, { nullable: true })
  message: string | null;

  @Field(() => String, { nullable: true })
  errorMessage: string | null;

  @Field(() => [Int])
  center: [number, number];

  @Field(() => [Int])
  wh: [number, number];

  @Field(() => Int)
  maxNum: number;

  @Field(() => String, { nullable: true })
  roomType: cnst.RoomType | null;
}

@ObjectType("CallRoom")
export class CallRoom extends BaseArrayFieldGql(CallRoomInput) {}
export const callRoomFragment = createFragment(CallRoom);
export const defaultCallRoom = makeDefault<CallRoom>(CallRoom);
