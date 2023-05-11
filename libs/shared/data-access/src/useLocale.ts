import { mainLocale, MainLocale } from "./main.locale";
import { adminLocale, AdminLocale } from "./admin/admin.locale";
import { contractLocale, ContractLocale } from "./contract/contract.locale";
import { currencyLocale, CurrencyLocale } from "./currency/currency.locale";
import { fileLocale, FileLocale } from "./file/file.locale";
import { keyringLocale, KeyringLocale } from "./keyring/keyring.locale";
import { notificationLocale, NotificationLocale } from "./notification/notification.locale";
import { networkLocale, NetworkLocale } from "./network/network.locale";
import { ownershipLocale, OwnershipLocale } from "./ownership/ownership.locale";
import { productLocale, ProductLocale } from "./product/product.locale";
import { thingLocale, ThingLocale } from "./thing/thing.locale";
import { tokenLocale, TokenLocale } from "./token/token.locale";
import { userLocale, UserLocale } from "./user/user.locale";
import { walletLocale, WalletLocale } from "./wallet/wallet.locale";
import { makeLocale } from "@shared/util-client";
import { useTranslation } from "react-i18next";

export const locale = {
  main: mainLocale,
  admin: adminLocale,
  contract: contractLocale,
  currency: currencyLocale,
  file: fileLocale,
  keyring: keyringLocale,
  notification: notificationLocale,
  network: networkLocale,
  ownership: ownershipLocale,
  product: productLocale,
  thing: thingLocale,
  token: tokenLocale,
  user: userLocale,
  wallet: walletLocale,
} as const;

export type Locale =
  | MainLocale
  | AdminLocale
  | ContractLocale
  | CurrencyLocale
  | FileLocale
  | KeyringLocale
  | NotificationLocale
  | NetworkLocale
  | OwnershipLocale
  | ProductLocale
  | ThingLocale
  | TokenLocale
  | UserLocale
  | WalletLocale;

export const useLocale = () => {
  const { t, i18n } = useTranslation();
  const { l, lang, setLang } = makeLocale<Locale>(t);
  return { l, lang, setLang };
};
