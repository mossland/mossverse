import graphql, { gql } from "graphql-tag";
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
  mutate,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Exchange, ExchangeInput } from "../_scalar/scalar.gql";
import { Receipt, receiptFragment } from "../receipt/receipt.gql";

@InputType("TradeInput")
export class TradeInput {
  @Field(() => shared.User, { nullable: true })
  user: shared.User | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String)
  name: string;

  @Field(() => [Exchange])
  inputs: Exchange[];

  @Field(() => [Exchange])
  outputs: Exchange[];

  @Field(() => [String])
  policy: cnst.TradePolicy[];
}

@ObjectType("Trade", { _id: "id" })
export class Trade extends BaseGql(TradeInput) {
  @Field(() => String)
  status: cnst.TradeStatus;
}

@ObjectType("LightTrade", { _id: "id", gqlRef: "Trade" })
export class LightTrade extends PickType(Trade, ["name", "inputs", "outputs", "policy", "description"] as const) {}

@ObjectType("TradeSummary")
export class TradeSummary {
  @Field(() => Int)
  totalTrade: number;
}

export const tradeGraphQL = createGraphQL("trade" as const, Trade, TradeInput, LightTrade);
export const {
  getTrade,
  listTrade,
  tradeCount,
  tradeExists,
  createTrade,
  updateTrade,
  removeTrade,
  tradeFragment,
  lightTradeFragment,
  purifyTrade,
  crystalizeTrade,
  lightCrystalizeTrade,
  defaultTrade,
  mergeTrade,
} = tradeGraphQL;

export type MakeTradeMutation = { makeTrade: Receipt };
export const makeTradeMutation = graphql`
  ${receiptFragment}
  mutation makeTrade(
    $tradeId: ID!
    $executedInputs: [ExchangeInput!]!
    $desiredOutputs: [ExchangeInput!]!
    $reverse: Boolean!
  ) {
    makeTrade(tradeId: $tradeId, executedInputs: $executedInputs, desiredOutputs: $desiredOutputs, reverse: $reverse) {
      ...receiptFragment
    }
  }
`;
export const makeTrade = async (
  tradeId: string,
  executedInputs: ExchangeInput[],
  desiredOutputs: ExchangeInput[],
  reverse = false
) =>
  (await mutate<MakeTradeMutation>(makeTradeMutation, { tradeId, executedInputs, desiredOutputs, reverse })).makeTrade;
