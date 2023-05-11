import { Summary } from "./summary.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const summaryLocale = {
  ...baseLocale,
};

export type SummaryLocale = Locale<"summary", any, typeof summaryLocale>;
