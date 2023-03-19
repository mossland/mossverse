import { Advertise } from "./advertise.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const advertiseLocale = {
  ...baseLocale,
  closeAt: ["Close At", "종료일"],
  openAt: ["Open At", "시작일"],
  bids: ["Bids", "입찰"],
} as const;

export type AdvertiseLocale = Locale<"advertise", Advertise, typeof advertiseLocale>;
