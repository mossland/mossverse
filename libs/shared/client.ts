//! temp
import * as fetch from "./lib/fetch";
import { RootState } from "./lib/store";
import { Store } from "@util/client";
export const st = {} as Store<RootState>;
export const gqlTemp = { ...fetch };
//! temp
export * as store from "./lib/store";
export * as fetch from "./lib/fetch";
export * from "./lib/dict";
export * from "./lib/_shared/_client";
export * from "./lib/_common";
export * as Admin from "./lib/admin/_client";
export * as Contract from "./lib/contract/_client";
export * as Currency from "./lib/currency/_client";
export * as File from "./lib/file/_client";
export * as Keyring from "./lib/keyring/_client";
export * as Network from "./lib/network/_client";
export * as Notification from "./lib/notification/_client";
export * as Ownership from "./lib/ownership/_client";
export * as Product from "./lib/product/_client";
export * as Thing from "./lib/thing/_client";
export * as Token from "./lib/token/_client";
export * as Wallet from "./lib/wallet/_client";
