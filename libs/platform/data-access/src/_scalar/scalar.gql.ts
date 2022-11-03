import { gql as shared } from "@shared/data-access";
import { cnst } from "@shared/util";
import { BaseArrayFieldGql, makeDefault, Field, InputType, Int, ObjectType, makePurify } from "@shared/util-client";

@InputType("PriceTagInput")
export class PriceTagInput {
  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | null;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | null;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  type: cnst.PriceTagType;
}

@ObjectType("PriceTag")
export class PriceTag extends PriceTagInput {}
// export class PriceTag extends BaseArrayFieldGql(PriceTagInput) {}
export const purifyPriceTag = makePurify<PriceTagInput>(PriceTag);

@InputType("ExchangeInput")
export class ExchangeInput {
  @Field(() => String)
  type: cnst.ExchangeType;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | null;

  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | null;

  @Field(() => shared.Product, { nullable: true })
  product: shared.Product | null;

  @Field(() => shared.Wallet, { nullable: true })
  wallet: shared.Wallet | null;

  @Field(() => String, { nullable: true })
  hash: string | null;

  @Field(() => Int)
  num: number;
}

@ObjectType("Exchange")
export class Exchange extends BaseArrayFieldGql(ExchangeInput) {}

@InputType("SurveyResponseInput")
export class SurveyResponseInput {
  @Field(() => shared.Wallet)
  wallet: shared.Wallet;

  @Field(() => String, { nullable: true })
  answer: string | null;

  @Field(() => Int, { nullable: true })
  selection: number | null;

  @Field(() => String, { nullable: true })
  reason: string | null;
}

@ObjectType("SurveyResponse")
export class SurveyResponse extends BaseArrayFieldGql(SurveyResponseInput) {
  @Field(() => Int)
  tokenNum: number;

  @Field(() => [shared.Token])
  tokens: shared.Token[];
}
export const defaultSurveyResponse = makeDefault<SurveyResponse>(SurveyResponse);
export const purifySurveyResponse = makePurify<SurveyResponseInput>(SurveyResponse);

@InputType("OwnershipInput")
export class OwnershipInput {}
@ObjectType("Ownership")
export class Ownership extends BaseArrayFieldGql(OwnershipInput) {
  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | null;

  @Field(() => shared.Wallet)
  wallet: shared.Wallet;

  @Field(() => String)
  address: string;

  @Field(() => Int, { nullable: true })
  tokenId: number | null;

  @Field(() => Int)
  num: number;

  @Field(() => Int)
  bn: number;
}

export type MyItem = {
  token?: shared.Token;
  thing?: shared.Thing;
  type: "token" | "thing";
  num: number;
};
export type ListingFilter = "all" | "mossMarket" | "p2p" | "myTokens";
export type ListingType = "default" | "delivery" | "p2p" | "myTokens";
export type MyTokensFilter = "all" | "onSale";

@InputType("ShipInfoInput")
export class ShipInfoInput {
  @Field(() => String)
  siteName: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  zipcode: string;

  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  message: string | null;
}

@ObjectType("ShipInfo")
export class ShipInfo extends ShipInfoInput {}
export const defaultShipInfo = makeDefault<ShipInfo>(ShipInfo);
export const purifyShipInfo = makePurify<ShipInfoInput>(ShipInfo);

//! Need to refactor this
export const typeOfExchangeMode = ["MOCtoMMOC", "MMOCtoMOC"] as const;
export type TypeOfExchangeMode = typeof typeOfExchangeMode[number];
