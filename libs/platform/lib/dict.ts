import { listingTrans } from "./listing/listing.dictionary";
import { makePageProto } from "@util/client";
import { platformTrans } from "./_platform/platform.dictionary";
import { raffleTrans } from "./raffle/raffle.dictionary";
import { receiptTrans } from "./receipt/receipt.dictionary";
import { shipInfoTrans } from "./shipInfo/shipInfo.dictionary";
import { snapshotTrans } from "./snapshot/snapshot.dictionary";
import { summaryTrans } from "./summary/summary.dictionary";
import { surveyTrans } from "./survey/survey.dictionary";
import { tradeTrans } from "./trade/trade.dictionary";
import { userTrans } from "./user/user.dictionary";

export const dictionary = {
  platform: platformTrans,
  listing: listingTrans,
  raffle: raffleTrans,
  receipt: receiptTrans,
  shipInfo: shipInfoTrans,
  snapshot: snapshotTrans,
  summary: summaryTrans,
  survey: surveyTrans,
  trade: tradeTrans,
  user: userTrans,
} as const;
export const usePage = makePageProto([dictionary]);
