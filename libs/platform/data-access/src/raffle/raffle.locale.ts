import { Raffle, RaffleSummary } from "./raffle.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const raffleLocale = {
  ...baseLocale,
  type: ["Type", "타입"],
  token: ["Token", "토큰"],
  thing: ["Thing", "Thing"],
  product: ["Product", "제품"],
  entryLimit: ["Entry Limit", "참여 제한"],
  tags: ["Tags", "태그"],
  closeAt: ["Close At", "종료일"],
  announceAt: ["Announce At", "발표일"],
  priceTags: ["Price Tags", "가격 태그"],
  entries: ["Entries", "참여자"],
  getName: ["Get Name", "Get Name"],
  getImage: ["Get Image", "Get Image"],
  getDescription: ["Get Description", "Get Description"],
  getRemainCloseTime: ["Get Remain Close Time", "Get Remain Close Time"],
  entryNum: ["Entry Num", "참여자 수"],
  isPicked: ["Is Picked", "당첨 여부"],
  winners: ["Winners", "당첨자"],
  totalRaffleNum: ["Total Raffle Num", "총 랜덤 뽑기 수"],
  totalRaffle: ["Total Raffle", "총 랜덤 뽑기"],
} as const;

export type RaffleLocale = Locale<"raffle", Raffle & RaffleSummary, typeof raffleLocale>;
