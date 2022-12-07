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

@InputType("CurrencyInput")
export class CurrencyInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  symbol: cnst.CurrencySymbol;

  @Field(() => String)
  type: cnst.CurrencyType;

  @Field(() => [String])
  services: string[];
}

@ObjectType("Currency", { _id: "id" })
export class Currency extends BaseGql(CurrencyInput) {
  @Field(() => Float)
  usdRate: number;

  @Field(() => Float)
  krwRate: number;

  @Field(() => String)
  status: cnst.CurrencyStatus;
}

@ObjectType("LightCurrency", { _id: "id", gqlRef: "Currency" })
export class LightCurrency extends PickType(Currency, ["name", "symbol", "type"] as const) {}

export const currencyGraphQL = createGraphQL("currency" as const, Currency, CurrencyInput, LightCurrency);
export const {
  getCurrency,
  listCurrency,
  currencyCount,
  currencyExists,
  createCurrency,
  updateCurrency,
  removeCurrency,
  currencyFragment,
  lightCurrencyFragment,
  purifyCurrency,
  defaultCurrency,
} = currencyGraphQL;
export type CurrencySlice = SliceModel<"currency", Currency, LightCurrency>;
