import { Translate, baseTrans } from "@util/client";
import { Wallet, WalletSummary } from "./wallet.fetch";

export const walletTrans = {
  ...baseTrans,
  network: ["Network", "네트워크"],
  address: ["Address", "주소"],
  type: ["Type", "타입"],
  getShortenedAddress: ["GetShortenedAddress", "GetShortenedAddress"],
  totalWallet: ["Total Wallet", "총 지갑수"],
} satisfies Translate<Wallet & WalletSummary>;
