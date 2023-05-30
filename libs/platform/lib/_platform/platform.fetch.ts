import {
  BaseArrayFieldGql,
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  PickType,
  cnst,
  makeCrystalize,
  makeDefault,
 makePurify } from "@util/client";
import { Dayjs } from "dayjs";
import { fetch as shared } from "@shared/client";

@InputType("PriceTagInput")
export class PriceTagInput {
  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | null;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | null;

  @Field(() => Int)
  price: number;

  @Field(() => Int, { nullable: true })
  discountPrice: number | null;

  @Field(() => String)
  type: cnst.PriceTagType;
}

@ObjectType("PriceTag")
export class PriceTag extends PriceTagInput {
  getName() {
    if (this.token?.meta?.name) return this.token.meta.name;
    if (this.thing?.name) return this.thing.name;
    else return `Unknown ${this.token ? `#${this.token.tokenId}` : ""}`;
  }
  getImage() {
    if (this.token?.image) return this.token.image;
    if (this.thing?.image) return this.thing.image;
    else return "";
  }
  getImageUrl() {
    if (this.token?.image?.url) return this.token.image.url;
    if (this.thing?.image?.url) return this.thing.image.url;
    else return "";
  }
}
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
  value: number;

  @Field(() => Float, { nullable: true })
  originalValue: number | null;
}

@ObjectType("Exchange")
export class Exchange extends ExchangeInput {
  getName() {
    return this.type === "thing"
      ? (this.thing as shared.Thing).name
      : this.type === "token"
      ? this?.token?.meta?.name ?? "unknown token"
      : this.type === "currency"
      ? "MOC"
      : "unknown";
  }

  getImageUrl() {
    if (this.thing) return this.thing.image.url;
    if (this.token) return this.token?.meta?.image ?? "";
    return "";
  }
}
export const defaultExchange = makeDefault(Exchange);

@ObjectType("LightExchange", { gqlRef: "Exchange" })
export class LightExchange extends PickType(Exchange, [
  "type",
  "token",
  "thing",
  "product",
  "currency",
  "value",
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
export const crystalizeExchange = makeCrystalize(Exchange);
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

// @InputType("ShipInfoInput")
// export class ShipInfoInput {
//   @Field(() => String)
//   siteName: string;

//   @Field(() => String)
//   name: string;

//   @Field(() => String)
//   phone: string;

//   @Field(() => String)
//   zipcode: string;

//   @Field(() => String)
//   address: string;

//   @Field(() => String, { nullable: true })
//   message: string | null;
// }

// @ObjectType("ShipInfo")
// export class ShipInfo extends ShipInfoInput {}
// export const defaultShipInfo = makeDefault<ShipInfo>(ShipInfo);
// export const purifyShipInfo = makePurify<ShipInfoInput>(ShipInfo);

@InputType("EntryInput")
export class EntryInput {
  @Field(() => shared.User)
  user: shared.User | shared.LightUser;

  @Field(() => Int)
  value: number;

  @Field(() => Date, { nullable: true })
  expireAt: Date | null;
}

@ObjectType("Entry")
export class Entry extends EntryInput {}
export const purifyEntry = makePurify(EntryInput);

@InputType("BidInput")
export class BidInput {
  @Field(() => shared.User)
  user: shared.User | shared.LightUser;

  @Field(() => Int)
  value: number;

  @Field(() => [shared.File])
  images: shared.File[] | shared.LightFile[];

  @Field(() => shared.File, { nullable: true })
  video: shared.File | shared.LightFile | null;
}

@ObjectType("Bid")
export class Bid extends BidInput {}
export const purifyBid = makePurify(BidInput);

@InputType("StakingInput")
export class StakingInput {
  @Field(() => shared.User)
  user: shared.User | shared.LightUser;

  @Field(() => Int)
  value: number;

  @Field(() => shared.Wallet)
  wallet: shared.Wallet | shared.LightWallet;

  @Field(() => Date)
  stakingAt: Dayjs;

  @Field(() => Date, { nullable: true })
  expireAt: Dayjs | null;
}

@ObjectType("Staking")
export class Staking extends StakingInput {
  getDuration() {
    return this.expireAt?.diff(this.stakingAt, "hour") ?? 0;
  }

  getRewardPrecent = () => {
    return Math.round((this.value / (this.getDuration() * this.value)) * 100 * 100) / 100;
  };

  getReward = () => {
    return Math.round((this.getRewardPrecent() * this.value) / 100);
  };
}
export const purifyStaking = makePurify(StakingInput);

//! Need to refactor this
export const typeOfExchangeMode = ["MOCtoMMOC", "MMOCtoMOC"] as const;
export type TypeOfExchangeMode = (typeof typeOfExchangeMode)[number];

export type ListingFilter = "all" | "mossMarket" | "p2p" | "myTokens";
export type ListingType = "default" | "delivery" | "p2p" | "myTokens";
export type MyTokensFilter = "all" | "onSale";
