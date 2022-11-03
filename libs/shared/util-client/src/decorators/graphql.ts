import { Utils } from "@shared/util";
import { makeDefault } from "./defaultValue";
import { extractDependentFragments } from "./fragment";
import { makePurify } from "./purify";
import { makeDefaultQMs } from "./queryMutation";
import { DefaultGqls, DefaultOf, getClassMeta, InputOf, PurifyFunc } from "./scalar";

type DefaultValueObj<T extends string, M> = {
  [K in `default${Capitalize<T>}`]: DefaultOf<M>;
};
type PurifyFuncObj<T extends string, I> = {
  [K in `purify${Capitalize<T>}`]: PurifyFunc<I>;
};
type FragmentObj<T extends string> = {
  [K in `${Uncapitalize<T>}Fragment`]: string;
};
export type DefaultGraphQL<T extends string, M, I> = { refName: string } & DefaultValueObj<T, M> &
  PurifyFuncObj<T, I> &
  FragmentObj<T> &
  DefaultGqls<T, M, InputOf<I>>;

export const createGraphQL = <T extends string, M, I>(target: any, inputRef: any): DefaultGraphQL<T, M, I> => {
  const refName = getClassMeta(target).refName;
  const [fieldName, className] = [Utils.lowerlize(refName), Utils.capitalize(refName)];
  return {
    refName,
    [`default${className}`]: makeDefault<M>(target),
    [`purify${className}`]: makePurify<I>(target),
    [`${fieldName}Fragment`]: extractDependentFragments([target]),
    ...makeDefaultQMs<T, M, I>(target, inputRef),
  } as DefaultGraphQL<T, M, I>;
};
