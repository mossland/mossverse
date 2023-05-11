import { Trade, TradeSummary } from "./trade.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const tradeLocale = {
  ...baseLocale,
  name: ["Name", "이름"],
  user: ["User", "사용자"],
  description: ["Description", "설명"],
  inputs: ["Inputs", "Inputs"],
  outputs: ["Outputs", "Outputs"],
  policy: ["Policy", "정책"],
  totalTrade: ["Total Trade", "총 거래"],
} as const;

export type TradeLocale = Locale<"trade", Trade & TradeSummary, typeof tradeLocale>;
