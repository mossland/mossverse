import { ShipInfoState, addShipInfoToStore } from "./shipInfo/shipInfo.store";
import { store as shared } from "@shared/data-access";
import { SetGet } from "@shared/util-client";
import { SurveyState, addSurveyToStore } from "./survey/survey.store";
import { ListingState, addListingToStore } from "./listing/listing.store";
import { ReceiptState, addReceiptToStore } from "./receipt/receipt.store";
import { TradeState, addTradeToStore } from "./trade/trade.store";
import { SnapshotState, addSnapshotToStore } from "./snapshot/snapshot.store";
import { RaffleState, addRaffleToStore } from "./raffle/raffle.store";
// export { ShipInfoState, addShipInfoToStore } from "./shipInfo/shipInfo.store";
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
  ...addShipInfoToStore({ set, get, pick }),
  ...addListingToStore({ set, get, pick }),
  ...addRaffleToStore({ set, get, pick }),
  ...addReceiptToStore({ set, get, pick }),
  ...addSnapshotToStore({ set, get, pick }),
  ...addSurveyToStore({ set, get, pick }),
  ...addTradeToStore({ set, get, pick }),
});
