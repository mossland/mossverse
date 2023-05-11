import { Utils } from "@shared/util";
import { create, StoreApi, StateCreator, UseBoundStore, Mutate } from "zustand";
import { DefaultGraphQL } from "./graphql";
import { DefaultOf, FieldState, getFieldMetas, InputOf, ProtoFile, Submit, Type } from "./scalar";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import equal from "deep-equal";
import { logger } from "../logger";
import { useEffect, useRef, MutableRefObject } from "react";
import { useInterval } from "../hooks";

export type DefaultState<T extends string, M, L = M> = T extends `${infer S}`
  ? { [K in `${Uncapitalize<S>}Class`]: Type<M> } & { [K in `${Uncapitalize<S>}`]: "loading" | M } & {
      [K in `${Uncapitalize<S>}Form`]: DefaultOf<M>;
    } & {
      [K in `${Uncapitalize<S>}Submit`]: Submit;
    } & {
      [K in `default${Capitalize<S>}`]: DefaultOf<M>;
    } & { [K in `${Uncapitalize<S>}List`]: "loading" | L[] } & { [K in `${Uncapitalize<S>}Selection`]: L[] } & {
      [K in `${Uncapitalize<S>}Count`]: number;
    } & { [K in `${Uncapitalize<S>}Modal`]: "edit" | "view" | string | null } & {
      [K in `lastPageOf${Capitalize<S>}`]: number;
    } & {
      [K in `pageOf${Capitalize<S>}`]: number;
    } & {
      [K in `limitOf${Capitalize<S>}`]: number;
    } & {
      [K in `queryOf${Capitalize<S>}`]: any;
    } & {
      [K in `defaultQueryOf${Capitalize<S>}`]: any;
    } & {
      [K in `sortOf${Capitalize<S>}`]: Partial<{ [key in keyof M]: 1 | -1 }>;
    } & { [K in `${Uncapitalize<S>}Operation`]: "sleep" | "reset" | "idle" | "error" | "loading" }
  : never;

type NameForm = {
  fieldName: string;
  className: string;
  gqlFieldName: string;
  gqlClassName: string;
};
const names = (refName: string, stateName: string = refName): NameForm => {
  return {
    fieldName: Utils.lowerlize(stateName),
    className: Utils.capitalize(stateName),
    gqlFieldName: Utils.lowerlize(refName),
    gqlClassName: Utils.capitalize(refName),
  };
};

const makeState = <T extends string, M, I, L, S extends string = T>(
  graphQL: DefaultGraphQL<T, M, I, L>,
  { fieldName, className, gqlClassName }: NameForm
) => {
  return {
    [`${fieldName}Class`]: new graphQL.modelRef(),
    [fieldName]: "loading",
    [`${fieldName}Form`]: { ...graphQL[`default${gqlClassName}`] },
    [`${fieldName}Submit`]: { disabled: true, loading: false, times: 0 },
    [`default${className}`]: { ...graphQL[`default${gqlClassName}`] },
    [`${fieldName}List`]: "loading",
    [`${fieldName}Selection`]: [],
    [`${fieldName}Count`]: 0,
    [`${fieldName}Modal`]: null,
    [`lastPageOf${className}`]: 1,
    [`pageOf${className}`]: 1,
    [`limitOf${className}`]: 20,
    [`queryOf${className}`]: { status: { $ne: "inactive" } },
    [`defaultQueryOf${className}`]: {},
    [`sortOf${className}`]: { createdAt: -1 },
    [`${fieldName}Operation`]: "sleep",
  } as DefaultState<S, M, L>;
};
export const createState = <T extends string, M, I, L = M>(
  graphQL: DefaultGraphQL<T, M, I, L>
): DefaultState<T, M, L> => {
  return {
    ...(makeState<T, M, I, L>(graphQL, names(graphQL.refName)) as DefaultState<T, M, L>),
  };
};
export type CreateOption = { idx?: number; path?: string; modal?: string };
export type DefaultActions<T extends string, M extends { id: string }, L> = T extends `${infer S}`
  ? {
      [K in `init${Capitalize<S>}`]: (initForm?: InitActionForm<M>) => Promise<void>;
    } & {
      [K in `refresh${Capitalize<S>}`]: (initForm?: InitActionForm<M>) => Promise<void>;
    } & {
      [K in `create${Capitalize<S>}`]: (options?: CreateOption) => Promise<void>;
    } & {
      [K in `update${Capitalize<S>}`]: (options?: CreateOption) => Promise<void>;
    } & {
      [K in `remove${Capitalize<S>}`]: (id: string) => Promise<void>;
    } & {
      [K in `check${Capitalize<S>}Submitable`]: () => Promise<void>;
    } & {
      [K in `submit${Capitalize<S>}`]: (options?: CreateOption) => Promise<void>;
    } & { [K in `new${Capitalize<S>}`]: (partial?: Partial<M>, options?: { modal?: string }) => void } & {
      [K in `edit${Capitalize<S>}`]: (model: M | string, options?: { modal?: string }) => Promise<void>;
    } & {
      [K in `merge${Capitalize<S>}`]: (model: M | string, data: Partial<M>) => Promise<void>;
    } & {
      [K in `view${Capitalize<S>}`]: (model: M | string, options?: { modal?: string }) => Promise<void>;
    } & { [K in `set${Capitalize<S>}`]: (model: M) => void } & {
      [K in `select${Capitalize<S>}`]: (model: L, options?: { refresh?: boolean; remove?: boolean }) => void;
    } & {
      [K in `reset${Capitalize<S>}`]: (model?: M) => void;
    } & {
      [K in `setPageOf${Capitalize<S>}`]: (page: number) => Promise<void>;
    } & {
      [K in `addPageOf${Capitalize<S>}`]: (page: number) => Promise<void>;
    } & {
      [K in `setLimitOf${Capitalize<S>}`]: (limit: number) => Promise<void>;
    } & {
      [K in `setQueryOf${Capitalize<S>}`]: (query: any) => Promise<void>;
    } & {
      [K in `setSortOf${Capitalize<S>}`]: (sort: { [key: string]: 1 | -1 }) => Promise<void>;
    } & FormSetter<M, T>
  : never;

type GetState<T, K> = K extends keyof T ? T[K] : never;
export type ActionParams<T extends string, M, L> = SetGet<DefaultState<T, M, L>> & {
  init?: () => Promise<void>;
  getParent?: () => any;
};
type PickState<G> = G extends () => infer S ? PickFunc<S, keyof S> : never;
type PickFunc<T, F extends keyof T = keyof T> = (...fields: F[]) => {
  [K in (typeof fields)[number]]: Exclude<T[K], null | undefined | "loading">;
}; // & { [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K] };
type MakeState<Maker> = Maker extends (...args: any) => infer S ? S : Maker;

export type SetGet<State> = {
  set: (state: Partial<MakeState<State>> | ((state: MakeState<State>) => any)) => void;
  get: GetState<Mutate<StoreApi<MakeState<State>>, []>, "getState">;
  pick: PickState<GetState<Mutate<StoreApi<MakeState<State>>, []>, "getState">>;
};
export type SetPick<State> = {
  set: (state: Partial<MakeState<State>> | ((state: MakeState<State>) => any)) => void;
  pick: PickState<GetState<Mutate<StoreApi<MakeState<State>>, []>, "getState">>;
};
export type State<StateMaker, Actions = () => Record<string, never>> = (StateMaker extends (...args: any) => infer R
  ? R
  : StateMaker) &
  (Actions extends (...args: any) => infer R ? R : never);
export type Get<State, Actions> = MakeState<State> & MakeState<Actions>;

export const createActions = <T extends string, M extends { id: string }, I, L extends { id: string } = M>(
  graphQL: DefaultGraphQL<T, M, I, L>,
  { set, get, pick }: ActionParams<T, M, L>,
  suffix: string
): DefaultActions<T, M, L> => {
  const ns = names(graphQL.refName);
  return {
    ...makeFormSetter(graphQL, ns, { set, get, pick }, suffix),
    ...makeActions<T, M, I, L>(graphQL as any, ns, { set, get, pick }, suffix),
  };
};

export type InitActionForm<M> = {
  query?: any;
  page?: number | string;
  limit?: number;
  sort?: { [key: string]: 1 | -1 };
  default?: Partial<DefaultOf<M>>;
  invalidate?: boolean;
};
const defaultInitActionForm: InitActionForm<any> = {
  query: { status: { $ne: "inactive" } },
  page: 1,
  limit: 20,
  sort: { createdAt: -1 },
  default: {},
  invalidate: false,
};

type SingleOf<M> = M extends (infer V)[] ? V : never;
type SetterKey<
  Prefix extends string,
  K extends string,
  S extends string
> = `${Prefix}${Capitalize<K>}On${Capitalize<S>}`;
export type FormSetter<M, S extends string> = {
  [K in keyof M as M[K] extends (...args: any) => any ? never : SetterKey<"set", string & K, S>]: (
    value?: FieldState<M[K]>
  ) => void;
} & {
  [K in keyof M as M[K] extends any[] ? SetterKey<"add", string & K, S> : never]: (
    value: SingleOf<M[K]> | SingleOf<M[K]>[],
    options?: { idx?: number; limit?: number }
  ) => void;
} & {
  [K in keyof M as M[K] extends any[] ? SetterKey<"sub", string & K, S> : never]: (idx: number | number[]) => void;
} & {
  [K in keyof M as M[K] extends any[] ? SetterKey<"addOrSub", string & K, S> : never]: (
    value: SingleOf<M[K]>,
    options?: { idx?: number; limit?: number }
  ) => void;
} & {
  [K in keyof M as M[K] extends (ProtoFile | null) | ProtoFile[] ? SetterKey<"upload", string & K, S> : never]: (
    fileList: FileList,
    idx?: number
  ) => Promise<void>;
} & {
  [K in `writeOn${Capitalize<S>}`]: (path: string | (string | number)[], value: any) => void;
};
const makeFormSetter = <T extends string, M, I, L, S extends string = T>(
  graphQL: DefaultGraphQL<T, M, I, L>,
  { gqlClassName, className, fieldName }: NameForm,
  { set, get, pick }: ActionParams<T, any, any>,
  suffix: string
): FormSetter<M, S> => {
  const metadatas = getFieldMetas(graphQL.modelRef);
  const result: any = {};
  const formName = `${fieldName}Form${suffix}` as any;
  for (const metadata of metadatas) {
    result[`set${Utils.capitalize(metadata.key)}On${className}`] = (value: any) =>
      set((state) => (state[formName][metadata.key] = value));
    if (metadata.isArray) {
      result[`add${Utils.capitalize(metadata.key)}On${className}`] = (
        value: L | L[],
        options: { idx?: number; limit?: number } = {}
      ) => {
        const form: any = get()[formName];
        const length = form[metadata.key].length;
        if (options.limit && options.limit <= length) return;
        const idx = options.idx ?? length;
        set(
          (state) =>
            (state[`${fieldName}Form${suffix}`][metadata.key] = [
              ...form[metadata.key].slice(0, idx),
              ...(Array.isArray(value) ? value : [value]),
              ...form[metadata.key].slice(idx),
            ]) as any
        );
      };
      result[`sub${Utils.capitalize(metadata.key)}On${className}`] = (idx: number | number[]) => {
        const form: any = get()[formName];
        set(
          (state) =>
            (state[formName][metadata.key] =
              typeof idx === "number"
                ? form[metadata.key].filter((_, i) => i !== (idx as number))
                : form[metadata.key].filter((_, i) => !(idx as number[]).includes(i)))
        );
      };
      result[`addOrSub${Utils.capitalize(metadata.key)}On${className}`] = (
        value: any,
        options: { idx?: number; limit?: number } = {}
      ) => {
        const addName = `add${Utils.capitalize(metadata.key)}On${className}${suffix}` as any;
        const subName = `sub${Utils.capitalize(metadata.key)}On${className}${suffix}` as any;
        const { [addName]: add, [subName]: sub, [formName]: form }: any = get();
        const index = (form[metadata.key] as any).findIndex((v) => v === value);
        index === -1 ? add(value, options) : sub(index);
      };
    }
    if (metadata.name === "File")
      result[`upload${Utils.capitalize(metadata.key)}On${className}`] = async (fileList: FileList, index?: number) => {
        const form: any = get()[formName];
        if (!fileList.length) return;
        const files = await graphQL[`add${gqlClassName}Files`](fileList, form.id);
        if (metadata.isArray) {
          const idx = index ?? form[metadata.key].length;
          set(
            (state) =>
              (state[formName][metadata.key] = [
                ...form[metadata.key].slice(0, idx),
                ...files,
                ...form[metadata.key].slice(idx),
              ] as any)
          );
        } else set((state) => (state[formName][metadata.key] = files[0]));
      };
  }
  result[`writeOn${className}`] = (path: string | (string | number)[], value: any) =>
    set((state) => Utils.set(state[formName], path, value));
  return result;
};
const makeActions = <T extends string, M extends { id: string }, I, L extends { id: string }>(
  graphQL: DefaultGraphQL<any, M, I, L>,
  { gqlClassName, className, fieldName, gqlFieldName }: NameForm,
  { set, get, pick }: ActionParams<T, any, any>,
  suffix: string
): DefaultActions<T, M, L> => {
  const actions = {
    [`init${className}`]: async (initForm: InitActionForm<M> = defaultInitActionForm) => {
      set({
        [`defaultQueryOf${className}`]: initForm.query ?? { status: { $ne: "inactive" } },
        [`default${className}`]: { ...graphQL[`default${gqlClassName}`], ...(initForm.default ?? {}) },
      } as any);
      await get()[`refresh${className}${suffix}`](initForm);
    },
    [`refresh${className}`]: async ({
      query = get()[`queryOf${className}${suffix}`],
      page = get()[`pageOf${className}${suffix}`],
      limit = get()[`limitOf${className}${suffix}`],
      sort = get()[`sortOf${className}${suffix}`] as any,
      invalidate = false,
    }: InitActionForm<M>) => {
      if (typeof page === "string") page = parseInt(page);
      const {
        [`${fieldName}Operation${suffix}`]: operation,
        [`queryOf${className}${suffix}`]: existingQuery,
        [`pageOf${className}${suffix}`]: existingPage,
        [`limitOf${className}${suffix}`]: existingLimit,
        [`sortOf${className}${suffix}`]: existingSort,
      } = get() as any;
      if (
        !invalidate &&
        !["sleep", "reset"].includes(operation) &&
        equal(query, existingQuery) &&
        page === existingPage &&
        limit === existingLimit &&
        equal(sort, existingSort)
      )
        return; // store-level cache hit
      else set({ [`${fieldName}List`]: "loading" } as any);
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](query, (page - 1) * limit, limit, sort);
      set({
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / limit) + 1, 1),
        [`limitOf${className}`]: limit,
        [`queryOf${className}`]: { ...(query ?? {}) },
        [`sortOf${className}`]: sort,
        [`pageOf${className}`]: page,
        [`${fieldName}Selection`]: [],
        [`${fieldName}Operation`]: "idle",
      } as any);
    },

    [`create${className}`]: async ({ idx, path, modal }: CreateOption = {}) => {
      const {
        [`${fieldName}Form${suffix}`]: form,
        [`${fieldName}List${suffix}`]: list,
        [`${fieldName}Count${suffix}`]: count,
        [`default${className}${suffix}`]: defaultModel,
      } = get() as any;
      const input = graphQL[`purify${gqlClassName}`](form);
      if (!input) return;
      const model = await graphQL[`create${gqlClassName}`](input);
      if (!model) return;
      const index = (typeof idx === "number" && idx) || list.length;
      set({
        [`${fieldName}List`]: list === "loading" ? list : [...list.slice(0, index), model, ...list.slice(index)],
        [`${fieldName}Count`]: count + 1,
        [`${(typeof path === "string" && path) || `${fieldName}`}`]: model,
        [`${fieldName}Form`]: defaultModel,
        [`${fieldName}`]: model,
        [`${fieldName}Modal`]: modal ?? null,
      } as any);
    },
    [`update${className}`]: async ({ idx, path, modal }: CreateOption = {}) => {
      const {
        [`${fieldName}List${suffix}`]: list,
        [`${fieldName}Form${suffix}`]: form,
        [`reset${className}${suffix}`]: reset,
        [`default${className}${suffix}`]: defaultModel,
      } = get() as any;
      const input = graphQL[`purify${gqlClassName}`](form);
      if (!input) throw new Error("Invalid input");
      const model = await graphQL[`update${gqlClassName}`](form.id, input);
      set({
        [`${fieldName}List`]: list === "loading" ? list : [...list.map((item) => (item.id === form.id ? model : item))],
        [`${(typeof path === "string" && path) || `${fieldName}`}`]: model,
        [`${fieldName}Form`]: defaultModel,
        [`${fieldName}`]: model,
        [`${fieldName}Modal`]: modal ?? null,
      } as any);
    },
    [`remove${className}`]: async (id: string) => {
      const {
        [`${fieldName}List${suffix}`]: list,
        [`${fieldName}Selection${suffix}`]: selection,
        [`${fieldName}Count${suffix}`]: count,
      } = get() as any;
      const model = await graphQL[`remove${gqlClassName}`](id);
      if (!model || list === "loading") return;
      model.status === "inactive"
        ? set({
            [`${fieldName}List`]: list.filter((item) => item.id !== id),
            [`${fieldName}Selection`]: selection.filter((item) => item.id !== id),
            [`${fieldName}Count`]: count - 1,
          } as any)
        : set({
            [`${fieldName}List`]: list === "loading" ? list : list.map((item) => (item.id === model.id ? model : item)),
          } as any);
    },
    [`check${className}Submitable`]: async () => {
      const { [`${fieldName}Form${suffix}`]: form, [`${fieldName}Submit${suffix}`]: submit } = get() as any;
      const input = graphQL[`purify${gqlClassName}`](form);
      set({ [`${fieldName}Submit`]: { ...submit, disabled: !input } } as any);
    },
    [`submit${className}`]: async (option?: CreateOption) => {
      const {
        [`${fieldName}Form${suffix}`]: form,
        [`${fieldName}Submit${suffix}`]: submit,
        [`create${className}${suffix}`]: create,
        [`update${className}${suffix}`]: update,
      } = get() as any;
      set({ [`${fieldName}Submit`]: { ...submit, loading: true } } as any);
      form.id ? await update(option) : await create(option);
      set({ [`${fieldName}Submit`]: { ...submit, loading: false, times: submit.times + 1 } } as any);
    },
    [`new${className}`]: (partial: Partial<M> = {}, options: { modal?: string } = {}) =>
      set({
        [`${fieldName}Form`]: { ...get()[`default${className}${suffix}`], ...partial },
        [`${fieldName}`]: "loading",
        [`${fieldName}Modal`]: options.modal ?? "edit",
      } as any),
    [`edit${className}`]: async (model: M | string, options: { modal?: string } = {}) => {
      const entity = await graphQL[`get${gqlClassName}`](typeof model === "string" ? model : model.id);
      const obj = Utils.objectify(entity);
      set({
        [`${fieldName}`]: entity,
        [`${fieldName}Form`]: obj,
        [`${fieldName}Modal`]: options.modal ?? "edit",
      } as any);
    },
    [`merge${className}`]: async (model: M | string, data: Partial<M>) => {
      const { [`${fieldName}List${suffix}`]: list } = get() as any;
      const updated = await graphQL[`merge${className}`](model, data);
      set({
        [`${fieldName}List`]:
          list === "loading" ? list : [...list.map((item) => (item.id === updated.id ? updated : item))],
      } as any);
    },
    [`view${className}`]: async (model: M | string, options: { modal?: string } = {}) => {
      const { [`${fieldName}${suffix}`]: prevModel } = get() as any;
      if (prevModel !== "loading" && prevModel.id === (typeof model === "string" ? model : model.id)) return;
      set({ [`${fieldName}`]: "loading", [`${fieldName}Modal`]: options.modal ?? "view" } as any);
      const entity = await graphQL[`get${gqlClassName}`](typeof model === "string" ? model : model.id);
      set({ [`${fieldName}`]: entity } as any);
    },
    [`set${className}`]: (model: M) => {
      set({ [`${fieldName}`]: model } as any);
    },
    [`select${className}`]: (model: L, options: { refresh?: boolean; remove?: boolean } = {}) => {
      const selection = get()[`${fieldName}Selection${suffix}`];
      if (options.refresh) set({ [`${fieldName}Selection${suffix}`]: [model] } as any);
      else if (options.remove)
        set({ [`${fieldName}Selection`]: selection.filter((sel) => sel.id !== model.id) } as any);
      else set({ [`${fieldName}Selection`]: [...selection, model] } as any);
    },
    [`reset${className}`]: (model?: M) => {
      const obj = get()[`default${className}${suffix}`];
      set({
        [`${fieldName}`]: model ?? "loading",
        [`${fieldName}Form`]: obj,
        [`${fieldName}Modal`]: null,
        // [`${fieldName}Selection`]: [],
      } as any);
      return model ?? null;
    },
    [`setPageOf${className}`]: async (page: number) => {
      const state = get();
      if (state[`pageOf${className}${suffix}`] === page) return;
      set({ [`${fieldName}List`]: "loading" } as any);
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](
        state[`queryOf${className}${suffix}`],
        (page - 1) * state[`limitOf${className}${suffix}`],
        state[`limitOf${className}${suffix}`],
        state[`sortOf${className}${suffix}`]
      );
      set({
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / state[`limitOf${className}${suffix}`]) + 1, 1),
        [`pageOf${className}`]: page,
      } as any);
    },
    [`addPageOf${className}`]: async (page: number) => {
      const state = get();
      if (state[`pageOf${className}${suffix}`] === page) return;
      const addFront = page < state[`pageOf${className}${suffix}`];
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](
        state[`queryOf${className}${suffix}`],
        (page - 1) * state[`limitOf${className}${suffix}`],
        state[`limitOf${className}${suffix}`],
        state[`sortOf${className}${suffix}`]
      );
      set({
        [`${fieldName}List`]: addFront
          ? [...list, ...state[`${fieldName}List${suffix}`]]
          : [...state[`${fieldName}List${suffix}`], ...list],
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / state[`limitOf${className}${suffix}`]) + 1, 1),
        [`pageOf${className}`]: page,
      } as any);
    },
    [`setLimitOf${className}`]: async (limit: number) => {
      const state = get();
      if (state[`limitOf${className}${suffix}`] === limit) return;
      const skip = (state[`pageOf${className}${suffix}`] - 1) * state[`limitOf${className}${suffix}`];
      const page = Math.max(Math.floor((skip - 1) / limit) + 1, 1);
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](state[`queryOf${className}${suffix}`], (page - 1) * limit, limit, state[`sortOf${className}${suffix}`]);
      set({
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / limit) + 1, 1),
        [`limitOf${className}`]: limit,
        [`pageOf${className}`]: page,
      } as any);
    },
    [`setQueryOf${className}`]: async (query: any) => {
      if (equal(get()[`queryOf${className}${suffix}`], query)) return; // store-level cache hit
      set({ [`${fieldName}List`]: "loading" } as any);
      const state = get();
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](query, 0, state[`limitOf${className}${suffix}`], state[`sortOf${className}${suffix}`]);
      set({
        [`queryOf${className}`]: { ...query },
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / state[`limitOf${className}${suffix}`]) + 1, 1),
        [`pageOf${className}`]: 1,
        [`${fieldName}Selection`]: [],
      } as any);
    },
    [`setSortOf${className}`]: async (sort: { [key in keyof M]: 1 | -1 }) => {
      if (equal(get()[`sortOf${className}${suffix}`], sort)) return; // store-level cache hit
      const state = get();
      set({ [`${fieldName}List`]: "loading", [`sortOf${className}`]: { ...sort } } as any);
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](state[`queryOf${className}${suffix}`], 0, state[`limitOf${className}${suffix}`], sort);
      set({
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / state[`limitOf${className}${suffix}`]) + 1, 1),
        [`pageOf${className}`]: 1,
      } as any);
    },
  };
  return actions as unknown as DefaultActions<T, M, L>;
};

export type SliceModel<T extends string, M extends { id: string }, L = M> = {
  refName: T;
  use: {
    [K in keyof DefaultState<T, M, L>]: { (): DefaultState<T, M, L>[K] };
  };
  do: {
    [K in keyof DefaultActions<T, M, L>]: DefaultActions<T, M, L>[K];
  };
} & {
  do: {
    [K in keyof DefaultState<T, M, L> as DefaultState<T, M, L>[K] extends (...args: any) => any
      ? never
      : SetKey<K & string>]: (value: FieldState<DefaultState<T, M, L>[K]>) => void;
  };
};
type SetKey<T extends string> = `set${Capitalize<T>}`;

export type WithSelectors<SA> = {
  sub: {
    (listener: (selectedState: SA, previousSelectedState: SA) => void): () => void;
    <U>(
      selector: (state: SA) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean;
        fireImmediately?: boolean;
      }
    ): () => void;
  };
} & {
  ref: <U>(selector: (state: SA) => U) => MutableRefObject<U>;
} & {
  sel: <U>(selector: (state: SA) => U, equals?: (a: U, b: U) => boolean) => U;
} & {
  use: { [K in keyof SA as SA[K] extends (...args: any) => any ? never : K]: () => SA[K] };
} & {
  do: { [K in keyof SA as SA[K] extends (...args: any) => any ? K : never]: SA[K] } & {
    [K in keyof SA as SA[K] extends (...args: any) => any ? never : SetKey<K & string>]: (
      value: FieldState<SA[K]>
    ) => void;
  };
} & {
  get: () => SA;
} & {
  set: (state: Partial<SA> | ((state: SA) => any)) => void;
} & {
  slice: { [K in keyof SA as K extends `__SLICE__${infer S}` ? S : never]: SA[K] };
};

const makePicker =
  (set, get) =>
  (...fields) => {
    const state = get();
    const ret = {} as any;
    for (const field of fields) {
      const val = state[field] as any;
      if (!val || val === "loading") throw new Error(`Field ${field as string} is not ready`);
      if (typeof val === "string" && !val.length) throw new Error(`Field is empty string (${field})`);
      else if (["self", "myKeyring", "me"].includes(field) && !state[field].id?.length)
        throw new Error("Self, Keyring or Me Id is not defined");
      ret[field] = val;
    }
    return ret;
  };

const createSelectors = <SA>(name: string, _store: any) => {
  const store = {} as WithSelectors<SA>;
  store.get = _store.getState;
  store.set = (s) => {
    return typeof s === "function"
      ? _store.setState((st) => {
          s(st);
        })
      : _store.setState(s);
  };
  store.sel = (selectFn: any, equals?: any) => _store(selectFn, equals);
  const state: any = store.get();
  store.sub = _store.subscribe;
  const useReference = (selectFn) => {
    const ref = useRef(selectFn(store.get()));
    useEffect(() => {
      return store.sub(selectFn, (val) => (ref.current = val));
    }, []);
    return ref;
  };
  store.ref = useReference;
  store.use = {} as any; // (selectFn: (state: any)=> any) => store(selectFn);
  store.do = {} as any;
  store.slice = {} as any;
  for (const k of Object.keys(state)) {
    if (typeof state[k] !== "function") {
      (store.use as any)[k] = () => store.sel((s: any) => s[k as keyof typeof s]);
      const setKey = `set${Utils.capitalize(k)}`;
      if (!state[setKey]) (store.do as any)[setKey] = (value: any) => store.set({ [k]: value } as any);
    } else {
      store.do[k] = async (...args) => {
        logger.verbose(`${k} action loading...`);
        const start = Date.now();
        await state[k](...args);
        const end = Date.now();
        logger.verbose(`=> ${k} action dispatched (${end - start}ms)`);
      };
    }
  }
  const sliceNames: string[] = Object.keys(storeMeta);
  for (const sliceName of sliceNames) {
    store.slice[sliceName] = { do: {}, use: {} };
    const { useKeys, doKeys, refName } = storeMeta[sliceName];
    doKeys.map(([key, sufKey]) => (store.slice[sliceName].do[key] = store.do[sufKey]));
    useKeys.map(([key, sufKey]) => {
      store.slice[sliceName].use[key] = store.use[sufKey];
      store.slice[sliceName].do[`set${Utils.capitalize(key)}`] = store.do[`set${Utils.capitalize(sufKey)}`];
    });
    store.slice[sliceName].sliceName = sliceName;
    store.slice[sliceName].refName = refName;
    store.slice[sliceName].suffix = sliceName.slice(refName.length);
  }
  return store;
};

export const makeStore = <SA>(makeSlice: (...args: any) => SA): WithSelectors<SA> =>
  createSelectors(
    "root",
    create(
      devtools(subscribeWithSelector(immer((set, get) => makeSlice({ set, get, pick: makePicker(set, get) }))), {
        name: "root",
        anonymousActionType: "root",
        type: "root",
      })
    )
  );

export const storeMeta: any = {};

export type ChildState<State, S extends string | undefined = undefined> = {
  [K in keyof State as K extends string ? `${K}${S extends string ? S : ""}` : never]: State[K];
};
export type Slice<T extends string, State> = {
  refName: T;
  sliceName: string;
  suffix: string;
} & {
  use: { [K in keyof State as State[K] extends (...args: any) => any ? never : K]: () => State[K] };
} & {
  do: { [K in keyof State as State[K] extends (...args: any) => any ? K : never]: State[K] };
} & {
  do: {
    [K in keyof State as State[K] extends (...args: any) => any ? never : `set${Capitalize<K & string>}`]: (
      value: FieldState<State[K]>
    ) => void;
  };
};
export const createSlicer = <T extends string, State, Actions>(
  refName: T,
  state: (...args: any) => State,
  actions: (...args: any) => Actions
): (<S extends string | undefined = undefined>(
  setget: SetGet<any>,
  suffix?: S
) => ChildState<State & Actions & { [K in `__SLICE__${T}`]: Slice<T, State & Actions> }, S>) => {
  return ({ set, get, pick }: SetGet<any>, suffix: string | undefined = "") => {
    const store = {} as any;
    const sliceSet = (state: any) => {
      if (typeof state === "function")
        return set((st) => {
          state(st);
        });
      const update = {} as Partial<State>;
      Object.keys(state).forEach((k) => (update[`${k}${suffix}`] = state[k]));
      set(update);
    };
    const slicePick = (...fields: (keyof State)[]) => {
      const data = pick(...(fields.map((k) => `${k as string}${suffix}`) as any));
      const ret = {} as any;
      for (const field of fields) ret[field] = data[`${field as string}${suffix}`];
      return ret;
    };
    const useKeys: any = [];
    const doKeys: any = [];
    Object.entries({
      ...state({ set: sliceSet, get, pick: slicePick }, suffix),
      ...actions({ set: sliceSet, get, pick: slicePick }, suffix),
    } as any).forEach(([key, value]) => {
      const sufKey = `${key}${suffix}`;
      store[sufKey] = value;
      typeof value === "function" ? doKeys.push([key, sufKey]) : useKeys.push([key, sufKey]);
    });
    storeMeta[`${refName}${suffix}`] = { useKeys, doKeys, refName, sliceName: `${refName}${suffix}` };
    return store;
  };
};

//! generateStore will be depreicated
export const generateStore = <S extends UseBoundStore<StoreApi<unknown>>>(store: S) => createSelectors("dumb", store);

//=========================================================
type Write<T, U> = Omit<T, keyof U> & U;
type WithSelectorSubscribe<S> = S extends {
  getState: () => infer T;
}
  ? S & StoreSubscribeWithSelector<T>
  : never;
type StoreSubscribeWithSelector<T> = {
  subscribe: {
    (listener: (selectedState: T, previousSelectedState: T) => void): () => void;
    <U>(
      selector: (state: T) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean;
        fireImmediately?: boolean;
      }
    ): () => void;
  };
};
export type Store<State> = WithSelectors<State>;
