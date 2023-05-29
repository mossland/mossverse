import { Trade, TradeSummary } from "./trade.fetch";
import { Translate, baseTrans } from "@util/client";

export const tradeTrans = {
  ...baseTrans,
  name: ["Name", "이름"],
  user: ["User", "사용자"],
  description: ["Description", "설명"],
  inputs: ["Inputs", "Inputs"],
  outputs: ["Outputs", "Outputs"],
  policy: ["Policy", "정책"],
  totalTrade: ["Total Trade", "총 거래"],
} satisfies Translate<Trade & TradeSummary>;
