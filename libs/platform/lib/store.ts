"use client";
import { ListingState, makeListingSlice } from "./listing/listing.store";
import { RaffleState, makeRaffleSlice } from "./raffle/raffle.store";
import { ReceiptState, makeReceiptSlice } from "./receipt/receipt.store";
import { SetGet } from "@util/client";
import { ShipInfoState, makeShipInfoSlice } from "./shipInfo/shipInfo.store";
import { SnapshotState, makeSnapshotSlice } from "./snapshot/snapshot.store";
import { SurveyState, makeSurveySlice } from "./survey/survey.store";
import { TradeState, makeTradeSlice } from "./trade/trade.store";
import { store as shared } from "@shared/client";
// export { ShipInfoState, makeShipInfoSlice } from "./shipInfo/shipInfo.store";
// export { ExchangeState, addExchangeToStore } from "./exchange/exchange.store";

export interface State
  extends ListingState,
    RaffleState,
    ReceiptState,
    SnapshotState,
    SurveyState,
    TradeState,
    ShipInfoState {}
export interface RootState extends shared.State, State {}

export const addToStore = ({ set, get, pick }: SetGet<RootState>) => ({
  ...makeShipInfoSlice({ set, get, pick }),
  ...makeListingSlice({ set, get, pick }),
  ...makeRaffleSlice({ set, get, pick }),
  ...makeReceiptSlice({ set, get, pick }),
  ...makeSnapshotSlice({ set, get, pick }),
  ...makeSurveySlice({ set, get, pick }),
  ...makeTradeSlice({ set, get, pick }),
});
