import { MocWallet, MocWalletSummary } from "./mocWallet.fetch";
import { Translate, baseTrans } from "@util/client";

export const mocWalletTrans = {
  ...baseTrans,
  address: ["Address", "주소"],
  user: ["User", "사용자"],
  type: ["Type", "타입"],
  expireAt: ["Expire At", "만료일"],
  totalMocWallet: ["Total MocWallet", "MocWallet 총합"],
} satisfies Translate<MocWallet & MocWalletSummary>;
