import { adminTrans } from "./admin/admin.dictionary";
import { contractTrans } from "./contract/contract.dictionary";
import { currencyTrans } from "./currency/currency.dictionary";
import { fileTrans } from "./file/file.dictionary";
import { keyringTrans } from "./keyring/keyring.dictionary";
import { makePageProto } from "@util/client";
import { networkTrans } from "./network/network.dictionary";
import { notificationTrans } from "./notification/notification.dictionary";
import { ownershipTrans } from "./ownership/ownership.dictionary";
import { productTrans } from "./product/product.dictionary";
import { sharedTrans } from "./_shared/shared.dictionary";
import { thingTrans } from "./thing/thing.dictionary";
import { tokenTrans } from "./token/token.dictionary";
import { userTrans } from "./user/user.dictionary";
import { walletTrans } from "./wallet/wallet.dictionary";

export const dictionary = {
  shared: sharedTrans,
  admin: adminTrans,
  contract: contractTrans,
  currency: currencyTrans,
  file: fileTrans,
  keyring: keyringTrans,
  notification: notificationTrans,
  network: networkTrans,
  ownership: ownershipTrans,
  product: productTrans,
  thing: thingTrans,
  token: tokenTrans,
  user: userTrans,
  wallet: walletTrans,
} as const;
export const usePage = makePageProto([dictionary]);
