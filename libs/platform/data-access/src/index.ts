import { Store } from "@shared/util-client";
import type { RootState } from "./store";
export * as gql from "./gql";
export * as store from "./store";
export * as slice from "./slice";
export * from "./useLocale";
export const st = {} as Store<RootState>;
