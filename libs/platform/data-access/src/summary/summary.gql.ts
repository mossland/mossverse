import { ShipInfoSummary } from "../shipInfo/shipInfo.gql";
import { ListingSummary } from "../listing/listing.gql";
import { RaffleSummary } from "../raffle/raffle.gql";
import { ReceiptSummary } from "../receipt/receipt.gql";
import { SnapshotSummary } from "../snapshot/snapshot.gql";
import { SurveySummary } from "../survey/survey.gql";
import { TradeSummary } from "../trade/trade.gql";

export const summaries = [ShipInfoSummary, 
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
    TradeSummary, ShipInfoSummary {}
