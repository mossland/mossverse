import { Advertise, AdvertiseSummary } from "./advertise.fetch";
import { Translate, baseTrans } from "@util/client";

export const advertiseTrans = {
  ...baseTrans,
  closeAt: ["Close At", "종료일"],
  openAt: ["Open At", "시작일"],
  bids: ["Bids", "입찰"],
  status: ["Status", "상태"],
  totalAdvertise: ["Total Advertise", "Advertise 총합"],
} satisfies Translate<Advertise & AdvertiseSummary>;
