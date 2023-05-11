import { GetObject, GetStateObject } from "@shared/util";
import type { ReactNode } from "react";

export type UserMenuItem = {
  title: string | ReactNode;
  icon?: ReactNode;
  path: string;
  query?: any;
  children?: UserMenuItem[];
  onClick?: () => void;
};

export type TranslationSingle = readonly [string, string];
export type TranslationWithParam = readonly [string, string, { [key: string]: string | number }];
export type Translation = TranslationSingle | TranslationWithParam;
export type Locale<
  RefName extends string,
  Checker,
  T extends { [K in keyof GetStateObject<Checker>]: Translation }
> = `${RefName}.${keyof T extends string ? keyof T : never}`;
export type ValueOf<Obj, Key extends string> = Obj extends object
  ? Key extends `${infer Parent}.${infer Leaf}`
    ? Parent extends keyof Obj
      ? ValueOf<Obj[Parent], Leaf>
      : never
    : Key extends keyof Obj
    ? Obj[Key]
    : never
  : never;
export type LocaleParam<Obj, Key extends string> = ValueOf<Obj, Key> extends TranslationWithParam
  ? ValueOf<Obj, Key>[2]
  : never;
