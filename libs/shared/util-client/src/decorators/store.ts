import { Utils } from "@shared/util";
import { State, StoreApi } from "zustand";
import create, { UseBoundStore } from "zustand/react";
import { DefaultGraphQL } from "./graphql";
import { DefaultGqls, DefaultOf } from "./scalar";
import { subscribeWithSelector } from "zustand/middleware";

type DefaultSet<T extends string, M> = T extends `${infer S}`
  ? { [K in `${Uncapitalize<S>}`]: M | null } & { [K in `${Uncapitalize<S>}List`]: M[] } & {
      [K in `${Uncapitalize<S>}Count`]: number;
    } & { [K in `${Uncapitalize<S>}Modal`]: "edit" | "view" | string | null } & {
      [K in `min${Capitalize<S>}Page`]: number;
    } & {
      [K in `max${Capitalize<S>}Page`]: number;
    } & { [K in `${Uncapitalize<S>}Operation`]: "sleep" | "idle" | "error" | "loading" }
  : never;
export type DefaultState<T extends string, M> = DefaultSet<T, M> & DefaultOf<M>;
export const createState = <T extends string, M, I>(graphQL: DefaultGraphQL<T, M, I>): DefaultState<T, M> => {
  const [fieldName, className] = [Utils.lowerlize(graphQL.refName), Utils.capitalize(graphQL.refName)];
  return {
    ...graphQL[`default${className}`],
    [fieldName]: null,
    [`${fieldName}List`]: [],
    [`${fieldName}Count`]: 0,
    [`${fieldName}Modal`]: null,
    [`min${className}Page`]: 1,
    [`max${className}Page`]: 1,
    [`${fieldName}Operation`]: "sleep",
  } as DefaultState<T, M>;
};
export type DefaultActions<T extends string, M, I> = T extends `${infer S}`
  ? { [K in `init${Capitalize<S>}`]: (query?: any, skip?: number, limit?: number) => Promise<void> } & {
      [K in `purify${Capitalize<S>}`]: () => I | null;
    } & {
      [K in `create${Capitalize<S>}`]: () => Promise<M>;
    } & { [K in `update${Capitalize<S>}`]: () => Promise<M> } & {
      [K in `remove${Capitalize<S>}`]: (id: string) => Promise<M>;
    } & { [K in `new${Capitalize<S>}`]: () => void } & { [K in `edit${Capitalize<S>}`]: (model: M) => M } & {
      [K in `view${Capitalize<S>}`]: (model: M) => M;
    } & { [K in `set${Capitalize<S>}`]: (model: M) => M } & {
      [K in `reset${Capitalize<S>}`]: (model?: M) => M | null;
    }
  : never;
export const createActions = <T extends string, M, I>(
  graphQL: DefaultGraphQL<T, M, I>,
  { set, get }: any
): DefaultActions<T, M, I> => {
  const [fieldName, className] = [Utils.lowerlize(graphQL.refName), Utils.capitalize(graphQL.refName)];
  const actions = {
    [`init${className}`]: async (query: any = {}, skip = 0, limit = 0) => {
      if (get()[`${fieldName}Operation`] !== "sleep") return;
      const { [`list${className}` as any]: list, [`${fieldName}Count` as any]: count } = await graphQL[
        `list${className}`
      ](query, skip, limit);
      set({ [`${fieldName}List`]: list, [`${fieldName}Count`]: count, [`${fieldName}Operation`]: "idle" });
    },
    [`purify${className}`]: () => {
      const state = get();
      try {
        const input = graphQL[`purify${className}`](state as M);
        return input;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    [`create${className}`]: async () => {
      const {
        [`purify${className}`]: purify,
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`reset${className}`]: reset,
      } = get();
      const input = purify();
      if (!input) return;
      const model = await graphQL[`create${className}`](input);
      if (!model) return;
      set({ [`${fieldName}List`]: [...list, model], [`${fieldName}Count`]: count + 1 });
      reset(model);
      return model;
    },
    [`update${className}`]: async () => {
      const { [`purify${className}`]: purify, [`${fieldName}List`]: list, id, [`reset${className}`]: reset } = get();
      const input = purify();
      if (!input) throw new Error("Invalid input");
      const model = await graphQL[`update${className}`](id, input);
      set({ [`${fieldName}List`]: [...list.filter((item) => item.id !== id), model] });
      reset(model);
      return model;
    },
    [`remove${className}`]: async (id: string) => {
      const { [`${fieldName}List`]: list, [`${fieldName}Count`]: count } = get();
      const model = await graphQL[`remove${className}`](id);
      if (!model) return;
      set({ [`${fieldName}List`]: list.filter((item) => item.id !== id), [`${fieldName}Count`]: count - 1 });
      return model;
    },
    [`new${className}`]: () =>
      set({ ...graphQL[`default${className}`], [`${fieldName}`]: null, [`${fieldName}Modal`]: "edit" }),
    [`edit${className}`]: (model: M) => {
      set({ ...model, [`${fieldName}`]: model, [`${fieldName}Modal`]: "edit" });
      return model;
    },
    [`view${className}`]: (model: M) => {
      set({ [`${fieldName}`]: model, [`${fieldName}Modal`]: "view" });
      return model;
    },
    [`set${className}`]: (model: M) => {
      set({ [`${fieldName}`]: model });
      return model;
    },
    [`reset${className}`]: (model?: M) => {
      set({ ...graphQL[`default${className}`], [`${fieldName}`]: model ?? null, [`${fieldName}Modal`]: null });
      return model ?? null;
    },
  };
  return actions as unknown as DefaultActions<T, M, I>;
};

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;
const createSelectors = <S extends UseBoundStore<StoreApi<State>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState() as any)) {
    (store.use as any)[k] = () => store((s: any) => s[k as keyof typeof s]);
  }
  return store;
};

export const generateStore = <T extends UseBoundStore<StoreApi<unknown>>>(store: T) => createSelectors(store);
