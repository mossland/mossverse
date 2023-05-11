import { mainLocale, MainLocale } from "./main.locale";
import { listingLocale, ListingLocale } from "./listing/listing.locale";
import { raffleLocale, RaffleLocale } from "./raffle/raffle.locale";
import { receiptLocale, ReceiptLocale } from "./receipt/receipt.locale";
import { shipInfoLocale, ShipInfoLocale } from "./shipInfo/shipInfo.locale";
import { snapshotLocale, SnapshotLocale } from "./snapshot/snapshot.locale";
import { summaryLocale, SummaryLocale } from "./summary/summary.locale";
import { surveyLocale, SurveyLocale } from "./survey/survey.locale";
import { tradeLocale, TradeLocale } from "./trade/trade.locale";
import { userLocale, UserLocale } from "./user/user.locale";
import { makeLocale } from "@shared/util-client";
import { useTranslation } from "react-i18next";

export const locale = {
  main: mainLocale,
  listing: listingLocale,
  raffle: raffleLocale,
  receipt: receiptLocale,
  shipInfo: shipInfoLocale,
  snapshot: snapshotLocale,
  summary: summaryLocale,
  survey: surveyLocale,
  trade: tradeLocale,
  user: userLocale,
} as const;

export type Locale =
  | MainLocale
  | ListingLocale
  | RaffleLocale
  | ReceiptLocale
  | ShipInfoLocale
  | SnapshotLocale
  | SummaryLocale
  | SurveyLocale
  | TradeLocale
  | UserLocale;

export const useLocale = () => {
  const { t, i18n } = useTranslation();
  const { l, lang, setLang } = makeLocale<Locale>(t);
  return { l, lang, setLang };
};
