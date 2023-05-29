//! temp
import * as fetch from "./lib/fetch";
import { RootState } from "./lib/store";
import { Store } from "@util/client";
import { gqlTemp } from "@shared/client";
export const st = {} as Store<RootState>;
Object.assign(gqlTemp, fetch);
//! temp
export * as store from "./lib/store";
export * as fetch from "./lib/fetch";
export * from "./lib/dict";
// export * from "./lib/_common";
export * as Listing from "./lib/listing/_client";
export * as Raffle from "./lib/raffle/_client";
export * as Receipt from "./lib/receipt/_client";
export * as ShipInfo from "./lib/shipInfo/_client";
export * as Snapshot from "./lib/snapshot/_client";
export * as Trade from "./lib/trade/_client";
