//! temp
import * as fetch from "./lib/fetch";
import { gqlTemp } from "@shared/client";
Object.assign(gqlTemp, fetch);
//! temp
export { st } from "./lib/store";
export * as fetch from "./lib/fetch";
export * from "./lib/dict";
export * from "./lib/_mossland/_client";
export * as Common from "./lib/_mossland/_client";
export * as Advertise from "./lib/advertise/_client";
export * as MocSurvey from "./lib/mocSurvey/_client";
export * as MocWallet from "./lib/mocWallet/_client";
export * as StakePool from "./lib/stakePool/_client";
