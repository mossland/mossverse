import { Currency, CurrencySummary } from "./currency.fetch";
import { Translate, baseTrans } from "@util/client";

export const currencyTrans = {
  ...baseTrans,
  name: ["Name", "이름"],
  symbol: ["Symbol", "심볼"],
  type: ["Type", "타입"],
  services: ["Services", "서비스"],
  usdRate: ["UsdRate", "UsdRate"],
  krwRate: ["KrwRate", "KrwRate"],
  totalCurrency: ["Total Currency", "총 통화수"],
} satisfies Translate<Currency & CurrencySummary>;
