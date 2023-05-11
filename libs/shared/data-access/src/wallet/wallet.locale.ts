import { Wallet, WalletSummary } from "./wallet.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const walletLocale = {
  ...baseLocale,
  network: ["Network", "네트워크"],
  address: ["Address", "주소"],
  type: ["Type", "타입"],
  getShortenedAddress: ["GetShortenedAddress", "GetShortenedAddress"],
  totalWallet: ["Total Wallet", "총 지갑수"],
} as const;

export type WalletLocale = Locale<"wallet", Wallet & WalletSummary, typeof walletLocale>;
