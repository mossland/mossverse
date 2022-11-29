import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { BaseArrayFieldGql, Field, Float, InputType, makeDefault, makePurify, ObjectType } from "@shared/util-client";
import { gql as platform } from "@platform/data-access";

@InputType("UserSurveyResponseInput")
export class UserSurveyResponseInput {
  @Field(() => platform.User)
  user: platform.User;

  @Field(() => String, { nullable: true })
  answer: string | null;

  @Field(() => String, { nullable: true })
  selection: number | null;

  @Field(() => String, { nullable: true })
  reason: string | null;
}

@ObjectType("UserSurveyResponse")
export class UserSurveyResponse extends BaseArrayFieldGql(UserSurveyResponseInput) {
  @Field(() => Float)
  num: number;
}
export const defaultUserSurveyResponse = makeDefault(UserSurveyResponse);
export const purifyUserSurveyResponse = makePurify(UserSurveyResponse);

@InputType("MocOwnershipInput")
export class MocOwnershipInput {}
@ObjectType("MocOwnership")
export class MocOwnership extends BaseArrayFieldGql(MocOwnershipInput) {
  @Field(() => platform.User)
  user: platform.User;

  @Field(() => Float)
  num: number;
}

export type ListingFilter = "all" | "mossMarket" | "p2p" | "myTokens";
export type ListingType = "default" | "delivery" | "p2p" | "myTokens";
export type MyTokensFilter = "all" | "onSale";
