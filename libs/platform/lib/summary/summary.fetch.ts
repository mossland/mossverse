import { ListingSummary } from "../listing/listing.fetch";
import { RaffleSummary } from "../raffle/raffle.fetch";
import { ReceiptSummary } from "../receipt/receipt.fetch";
import { ShipInfoSummary } from "../shipInfo/shipInfo.fetch";
import { SnapshotSummary } from "../snapshot/snapshot.fetch";
import { SurveySummary } from "../survey/survey.fetch";
import { TradeSummary } from "../trade/trade.fetch";

export const summaries = [
  ShipInfoSummary,
  ListingSummary,
  RaffleSummary,
  ReceiptSummary,
  SnapshotSummary,
  SurveySummary,
  TradeSummary,
] as const;
export interface Summary
  extends ListingSummary,
    RaffleSummary,
    ReceiptSummary,
    SnapshotSummary,
    SurveySummary,
    TradeSummary,
    ShipInfoSummary {}
