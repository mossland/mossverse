import { gql as shared } from "@shared/data-access";
import { cnst } from "@shared/util";
import {
  BaseArrayFieldGql,
  makeDefault,
  Field,
  InputType,
  Int,
  ObjectType,
  makePurify,
  InputOf,
  Float,
  PickType,
} from "@shared/util-client";

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
export const purifyPriceTag = makePurify(PriceTagInput);

@InputType("ExchangeInput")
export class ExchangeInput {
  @Field(() => String)
  type: cnst.ExchangeType;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | shared.LightToken | null;

  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | shared.LightThing | null;

  @Field(() => shared.Product, { nullable: true })
  product: shared.Product | shared.LightProduct | null;

  @Field(() => shared.Currency, { nullable: true })
  currency: shared.Currency | shared.LightCurrency | null;

  @Field(() => shared.Wallet, { nullable: true })
  wallet: shared.Wallet | shared.LightWallet | null;

  @Field(() => String, { nullable: true })
  hash?: string | null;

  @Field(() => Float)
  num: number;

  @Field(() => Float, { nullable: true })
  originalNum: number | null;
}

@ObjectType("Exchange")
export class Exchange extends ExchangeInput {}

@ObjectType("LightExchange", { gqlRef: "Exchange" })
export class LightExchange extends PickType(Exchange, [
  "type",
  "token",
  "thing",
  "product",
  "currency",
  "num",
] as const) {
  @Field(() => shared.LightToken, { nullable: true })
  override token: shared.LightToken | null;

  @Field(() => shared.LightThing, { nullable: true })
  override thing: shared.LightThing | null;

  @Field(() => shared.LightProduct, { nullable: true })
  override product: shared.LightProduct | null;

  @Field(() => shared.LightCurrency, { nullable: true })
  override currency: shared.LightCurrency | null;
}

export const purifyExchange = makePurify(Exchange);
// export class Exchange extends BaseArrayFieldGql(ExchangeInput) {}

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
export const purifySurveyResponse = makePurify(SurveyResponseInput);

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

export type ListingFilter = "all" | "mossMarket" | "p2p" | "myTokens";
export type ListingType = "default" | "delivery" | "p2p" | "myTokens";
export type MyTokensFilter = "all" | "onSale";
