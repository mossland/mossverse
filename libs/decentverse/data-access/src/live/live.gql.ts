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

@InputType("LiveInput")
export class LiveInput {
  @Field(() => String, { nullable: true })
  message: string | null;

  @Field(() => String, { nullable: true })
  errorMessage: string | null;

  @Field(() => [Int])
  center: [number, number];

  @Field(() => [Int])
  wh: [number, number];

  @Field(() => String)
  src: string;
}

@ObjectType("Live")
export class Live extends BaseArrayFieldGql(LiveInput) {}
export const liveFragment = createFragment(Live);
export const defaultLive = makeDefault<Live>(Live);
