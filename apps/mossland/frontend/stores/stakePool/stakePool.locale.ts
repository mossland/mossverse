import { StakePool, StakePoolSummary } from "./stakePool.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const stakePoolLocale = {
  ...baseLocale,
  type: ["Type", "타입"],
  thing: ["Thing", "Thing"],
  stakings: ["Stakings", "Stakings"],
  totalStakePool: ["Total StakePool", "StakePool 총합"],
} as const;

export type StakePoolLocale = Locale<"stakePool", StakePool & StakePoolSummary, typeof stakePoolLocale>;
