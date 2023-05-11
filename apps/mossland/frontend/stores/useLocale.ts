import { mainLocale, MainLocale } from "./main.locale";
import { advertiseLocale, AdvertiseLocale } from "./advertise/advertise.locale";
import { buildingLocale, BuildingLocale } from "./building/building.locale";
import { mocSurveyLocale, MocSurveyLocale } from "./mocSurvey/mocSurvey.locale";
import { mocWalletLocale, MocWalletLocale } from "./mocWallet/mocWallet.locale";
import { stakePoolLocale, StakePoolLocale } from "./stakePool/stakePool.locale";
import { userLocale, UserLocale } from "./user/user.locale";
import { makeLocale } from "@shared/util-client";
import { useTranslation } from "react-i18next";

export const locale = {
  main: mainLocale,
  advertise: advertiseLocale,
  building: buildingLocale,
  mocSurvey: mocSurveyLocale,
  mocWallet: mocWalletLocale,
  stakePool: stakePoolLocale,
  user: userLocale,
} as const;

export type Locale =
  | MainLocale
  | AdvertiseLocale
  | BuildingLocale
  | MocSurveyLocale
  | MocWalletLocale
  | StakePoolLocale
  | UserLocale;

export const useLocale = () => {
  const { t, i18n } = useTranslation();
  const { l, lang, setLang } = makeLocale<Locale>(t);
  return { l, lang, setLang };
};
