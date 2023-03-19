import { Currency, CurrencySummary } from "./currency.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const currencyLocale = {
  ...baseLocale,
  name: ["Name", "이름"],
  symbol: ["Symbol", "심볼"],
  type: ["Type", "타입"],
  services: ["Services", "서비스"],
  usdRate: ["UsdRate", "UsdRate"],
  krwRate: ["KrwRate", "KrwRate"],
  totalCurrency: ["Total Currency", "총 통화수"],
} as const;

export type CurrencyLocale = Locale<"currency", Currency & CurrencySummary, typeof currencyLocale>;
