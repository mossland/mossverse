import { useEffect } from "react";
import i18n from "i18next";
import ICU from "i18next-icu";
import { initReactI18next } from "react-i18next";
import type { NextComponentType } from "next";
import React from "react";
import LanguageDetector from "i18next-browser-languagedetector";

type Props = {
  Component: NextComponentType;
  locales: Record<string, any>[];
  defaultLng?: "ko" | "en" | "zhChs" | "zhCht";
};
export const baseLocale = {
  status: ["Status", "상태"],
  id: ["Id", "아이디"],
  createdAt: ["CreatedAt", "등록일"],
  updatedAt: ["UpdatedAt", "수정일"],
  __ModelType__: ["__ModelType__", "__모델타입__"],
} as const;

const commonLocale = {
  lang: {
    ko: "KO",
    en: "EN",
    // zhChs: "简体中文", //간체
    // zhCht: "繁體中文", //번체
  },
};

export const useI18n = ({ Component, locales, defaultLng }: Props) => {
  //* defaultLng이 있으면 그걸로, 없으면 localStorage, 브라우저 언어 순으로 설정
  const lngOption = defaultLng
    ? {
        lng: defaultLng,
        fallbackLng: defaultLng,
      }
    : {
        detection: { order: ["localStorage", "navigator"] },
      };

  const resources = {
    common: { translation: commonLocale },
    ko: { translation: { ...commonLocale } },
    en: { translation: { ...commonLocale } },
  };
  const koItem = {};
  const enItem = {};
  locales.forEach((locale) => {
    Object.keys(locale).forEach((key) => {
      if (!(key in koItem)) koItem[key] = {};
      if (!(key in enItem)) enItem[key] = {};
      Object.keys(locale[key]).forEach((innerKey) => {
        koItem[key][innerKey] = locale[key][innerKey][1];
        enItem[key][innerKey] = locale[key][innerKey][0];
      });
    });

    resources.ko.translation = { ...resources.ko.translation, ...koItem };
    resources.en.translation = { ...resources.en.translation, ...enItem };
  });
  i18n
    .use(ICU)
    .use(initReactI18next)
    .use(new LanguageDetector(null, { lookupLocalStorage: "language" }))
    .init({
      resources,
      keySeparator: ".",
      ...lngOption,
    });

  useEffect(() => {
    const language = localStorage.getItem("language");
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [Component]);
};

export const makeLocale = <Locale extends string>(t: any) => {
  return {
    l: (key: Locale, param?: any) => {
      const isContainHTML = /<[a-z][\s\S]*>/i.test(t(key, param));
      return isContainHTML ? <span dangerouslySetInnerHTML={{ __html: t(key, param) }}></span> : t(key, param);
    },
    lang: i18n.language,
    setLang: (lang: "en" | "ko") => i18n.changeLanguage(lang),
  };
};
