import { MocWallet, MocWalletSummary } from "./mocWallet.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const mocWalletLocale = {
  ...baseLocale,
  address: ["Address", "주소"],
  user: ["User", "사용자"],
  type: ["Type", "타입"],
  expireAt: ["Expire At", "만료일"],
  totalMocWallet: ["Total MocWallet", "MocWallet 총합"],
} as const;

export type MocWalletLocale = Locale<"mocWallet", MocWallet & MocWalletSummary, typeof mocWalletLocale>;
