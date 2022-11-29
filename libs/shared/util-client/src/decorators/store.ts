import { Utils } from "@shared/util";
import create, { StoreApi, StateCreator, UseBoundStore, Mutate } from "zustand";
import { DefaultGraphQL } from "./graphql";
import { DefaultOf, FieldState, getFieldMetas, ProtoFile, Submit } from "./scalar";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import _, { isArray } from "lodash";
import equal from "deep-equal";

export type DefaultState<T extends string, M, L = M> = T extends `${infer S}`
  ? { [K in `${Uncapitalize<S>}`]: "loading" | M } & {
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
    [fieldName]: "loading",
    [`${fieldName}Form`]: graphQL[`default${gqlClassName}`],
    [`${fieldName}Submit`]: { disabled: true, loading: false },
    [`default${className}`]: graphQL[`default${gqlClassName}`],
    [`${fieldName}List`]: [],
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
    ...makeState<T, M, I, L>(graphQL, names(graphQL.refName)),
  } as DefaultState<T, M, L>;
};
export const createChildState = <T extends string, M, I, L, S extends string = T>(
  stateName: S,
  graphQL: DefaultGraphQL<T, M, I, L>
): DefaultState<S, M, L> => {
  return makeState<T, M, I, L, S>(graphQL, names(graphQL.refName, stateName));
};

export type DefaultActions<T extends string, M extends { id: string }, L> = T extends `${infer S}`
  ? {
      [K in `init${Capitalize<S>}`]: (initForm?: InitActionForm<M>) => Promise<void>;
    } & {
      [K in `refresh${Capitalize<S>}`]: (initForm?: InitActionForm<M>) => Promise<void>;
    } & {
      [K in `create${Capitalize<S>}`]: (index?: number) => Promise<void>;
    } & { [K in `update${Capitalize<S>}`]: (path?: string) => Promise<void> } & {
      [K in `remove${Capitalize<S>}`]: (id: string) => Promise<void>;
    } & {
      [K in `check${Capitalize<S>}Submitable`]: () => Promise<void>;
    } & {
      [K in `submit${Capitalize<S>}`]: () => Promise<void>;
    } & { [K in `new${Capitalize<S>}`]: (partial?: Partial<M>) => void } & {
      [K in `edit${Capitalize<S>}`]: (model: M | string) => Promise<void>;
    } & {
      [K in `view${Capitalize<S>}`]: (model: M | string) => Promise<void>;
    } & { [K in `set${Capitalize<S>}`]: (model: M) => void } & {
      [K in `select${Capitalize<S>}`]: (model: L) => void;
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
      [K in `setSortOf${Capitalize<S>}`]: (sort: { [key in keyof M]: 1 | -1 }) => Promise<void>;
    } & FormSetter<M, T>
  : never;

type GetState<T, K> = K extends keyof T ? T[K] : never;
export type ActionParams<T extends string, M, L> = {
  set: GetState<Mutate<StoreApi<DefaultState<T, M, L>>, []>, "setState">;
  get: GetState<Mutate<StoreApi<DefaultState<T, M, L>>, []>, "getState">;
  init?: () => Promise<void>;
  getParent?: () => any;
};
type PickState<G> = G extends () => infer S ? PickFunc<S, keyof S> : never;
type PickFunc<T, F extends keyof T = keyof T> = (...fields: F[]) => {
  [K in typeof fields[number]]: Exclude<T[K], null | undefined | "loading">;
};

export type SetGet<State> = {
  set: GetState<Mutate<StoreApi<State>, []>, "setState">;
  get: GetState<Mutate<StoreApi<State>, []>, "getState">;
  pick: PickState<GetState<Mutate<StoreApi<State>, []>, "getState">>;
};
export type Get<State, Actions> = State & (Actions extends (...args: any) => infer R ? R : never);

export const createActions = <T extends string, M extends { id: string }, I, L = M>(
  graphQL: DefaultGraphQL<T, M, I, L>,
  { set, get, init }: ActionParams<T, M, L>
): DefaultActions<T, M, L> => {
  const ns = names(graphQL.refName);
  return { ...makeFormSetter(graphQL, ns, { set, get }), ...makeActions<T, M, I, L>(graphQL, ns, { set, get, init }) };
};
export const createChildActions = <T extends string, M extends { id: string }, I, L = M, S extends string = T>(
  stateName: S,
  graphQL: DefaultGraphQL<T, M, I, L>,
  params: ActionParams<S, any, any>
): DefaultActions<S, M, L> => {
  const ns = names(graphQL.refName, stateName);
  return {
    ...makeFormSetter<T, M, I, L, S>(graphQL, ns, params as any),
    ...makeActions<S, M, I, L>(graphQL, ns, params),
  };
};
export type InitActionForm<M> = {
  query?: any;
  page?: number | string;
  limit?: number;
  sort?: { [key: string]: 1 | -1 };
  default?: Partial<M>;
};
const defaultInitActionForm: InitActionForm<any> = {
  query: { status: { $ne: "inactive" } },
  page: 1,
  limit: 20,
  sort: { createdAt: -1 },
  default: {},
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
    value: SingleOf<M[K]> | M[K],
    idx?: number
  ) => void;
} & {
  [K in keyof M as M[K] extends any[] ? SetterKey<"remove", string & K, S> : never]: (idx: number | number[]) => void;
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
  { set, get }: ActionParams<T, any, any>
): FormSetter<M, S> => {
  const metadatas = getFieldMetas(graphQL.modelRef);
  const result: any = {};
  for (const metadata of metadatas) {
    result[`set${Utils.capitalize(metadata.key)}On${className}`] = (value: any) =>
      set((state: any): any => {
        state[`${fieldName}Form`] = { ...state[`${fieldName}Form`], [metadata.key]: value };
      });
    if (metadata.isArray) {
      result[`add${Utils.capitalize(metadata.key)}On${className}`] = (value: any | any[], index?: number) =>
        set((state: any): any => {
          const isArray = value.length && !!value[0];
          const idx = index ?? state[`${fieldName}Form`][metadata.key].length;
          state[`${fieldName}Form`] = {
            ...state[`${fieldName}Form`],
            [metadata.key]: [
              ...state[`${fieldName}Form`][metadata.key].slice(0, idx),
              ...(isArray ? value : [value]),
              ...state[`${fieldName}Form`][metadata.key].slice(idx),
            ],
          };
        });
      result[`remove${Utils.capitalize(metadata.key)}On${className}`] = (idx: number | number[]) =>
        set((state: any): any => {
          state[`${fieldName}Form`] = {
            ...state[`${fieldName}Form`],
            [metadata.key]:
              typeof idx === "number"
                ? state[`${fieldName}Form`][metadata.key].filter((_, i) => i !== (idx as number))
                : state[`${fieldName}Form`][metadata.key].filter((_, i) => !(idx as number[]).includes(i)),
          };
        });
    }
    if (metadata.name === "File")
      result[`upload${Utils.capitalize(metadata.key)}On${className}`] = async (fileList: FileList, index?: number) => {
        const id = (get() as any)[`${fieldName}Form`].id;
        if (!fileList.length) return;
        if (metadata.isArray) {
          const files = await graphQL[`add${gqlClassName}Files`](fileList, id);
          set((state: any): any => {
            const idx = index ?? state[`${fieldName}Form`][metadata.key].length;
            state[`${fieldName}Form`] = {
              ...state[`${fieldName}Form`],
              [metadata.key]: [
                ...state[`${fieldName}Form`][metadata.key].slice(0, idx),
                ...files,
                ...state[`${fieldName}Form`][metadata.key].slice(idx),
              ],
            };
          });
          // return files;
        } else {
          const [file] = await graphQL[`add${gqlClassName}Files`](fileList, id);
          set((state: any): any => {
            state[`${fieldName}Form`] = { ...state[`${fieldName}Form`], [metadata.key]: file };
          });
          // return [file];
        }
      };
  }
  result[`writeOn${className}`] = (path: string | (string | number)[], value: any) =>
    set((state): any => {
      _.set(state[`${fieldName}Form`], path, value);
    });
  return result;
};
const makeActions = <T extends string, M extends { id: string }, I, L>(
  graphQL: DefaultGraphQL<any, M, I, L>,
  { gqlClassName, className, fieldName, gqlFieldName }: NameForm,
  { set, get }: ActionParams<T, any, any>
): DefaultActions<T, M, L> => {
  const actions = {
    [`init${className}`]: async (initForm: InitActionForm<M> = defaultInitActionForm) => {
      // const operation = get()[`${fieldName}Operation`];
      // if (!["sleep", "reset"].includes(operation) && !query) return;
      set({
        [`defaultQueryOf${className}`]: initForm.query ?? { status: { $ne: "inactive" } },
        [`default${className}`]: { ...graphQL[`default${gqlClassName}`], ...(initForm.default ?? {}) },
      } as Partial<DefaultState<T, M, L>>);
      await get()[`refresh${className}`](initForm);
    },
    [`refresh${className}`]: async ({
      query = { status: { $ne: "inactive" } },
      page = 1,
      limit = 20,
      sort = { createdAt: -1 },
    }: InitActionForm<M>) => {
      if (typeof page === "string") page = parseInt(page);
      const {
        [`${fieldName}Operation` as any]: operation,
        [`queryOf${className}` as any]: existingQuery,
        [`pageOf${className}` as any]: existingPage,
        [`limitOf${className}` as any]: existingLimit,
        [`sortOf${className}` as any]: existingSort,
      } = get();
      if (
        !["sleep", "reset"].includes(operation) &&
        equal(query, existingQuery) &&
        page === existingPage &&
        limit === existingLimit &&
        equal(sort, existingSort)
      )
        return; // store-level cache hit
      else
        set({
          [`${fieldName}List`]: "loading",
        } as Partial<DefaultState<T, M, L>>);
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](query, (page - 1) * limit, limit, sort);
      console.log({ count, page, lastPage: Math.max(Math.floor((count - 1) / limit) + 1, 1) });
      set({
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / limit) + 1, 1),
        [`limitOf${className}`]: limit,
        [`queryOf${className}`]: { ...(query ?? {}), status: { $ne: "inactive" } },
        [`sortOf${className}`]: sort,
        [`pageOf${className}`]: page,
        [`${fieldName}Operation`]: "idle",
      } as Partial<DefaultState<T, M, L>>);
    },

    [`create${className}`]: async (index?: number) => {
      const {
        [`${fieldName}Form` as any]: form,
        [`${fieldName}List` as any]: list,
        [`${fieldName}Count` as any]: count,
        [`reset${className}` as any]: reset,
      } = get();
      
      const input = graphQL[`purify${gqlClassName}`](form);
      console.log(form, input)
      if (!input) return;
      const model = await graphQL[`create${gqlClassName}`](input);
      if (!model) return;
      const idx = (typeof index === "number" && index) || list.length;
      set({
        [`${fieldName}List`]: [...list.slice(0, idx), model, ...list.slice(idx)],
        [`${fieldName}Count`]: count + 1,
      } as Partial<DefaultState<T, M, L>>);
      reset(model);
    },
    [`update${className}`]: async (path?: string) => {
      const {
        [`${fieldName}List` as any]: list,
        [`${fieldName}Form` as any]: form,
        [`reset${className}` as any]: reset,
      } = get();
      const input = graphQL[`purify${gqlClassName}`](form);
      if (!input) throw new Error("Invalid input");
      const model = await graphQL[`update${gqlClassName}`](form.id, input);
      set({
        [`${fieldName}List`]: [...list.map((item) => (item.id === form.id ? model : item))],
        [`${(typeof path === "string" && path) || fieldName}`]: model,
      } as Partial<DefaultState<T, M, L>>);
      reset(model);
    },
    [`remove${className}`]: async (id: string) => {
      const { [`${fieldName}List` as any]: list, [`${fieldName}Count` as any]: count } = get();
      const model = await graphQL[`remove${gqlClassName}`](id);
      if (!model) return;
      set({ [`${fieldName}List`]: list.filter((item) => item.id !== id), [`${fieldName}Count`]: count - 1 } as Partial<
        DefaultState<T, M, L>
      >);
    },
    [`check${className}Submitable`]: async (id: string) => {
      const { [`${fieldName}Form` as any]: form, [`${fieldName}Submit` as any]: submit } = get();
      const input = graphQL[`purify${gqlClassName}`](form);
      set({ [`${fieldName}Submit`]: { ...submit, disabled: !input } } as Partial<DefaultState<T, M, L>>);
    },
    [`submit${className}`]: async (id: string) => {
      const {
        [`${fieldName}Form` as any]: form,
        [`${fieldName}Submit` as any]: submit,
        [`create${className}` as any]: create,
        [`update${className}` as any]: update,
      } = get();
      set({ [`${fieldName}Submit`]: { ...submit, loading: true } } as any);
      form.id ? await update() : await create();
      set({ [`${fieldName}Submit`]: { ...submit, loading: false } } as any);
    },

    [`new${className}`]: (partial: Partial<M> = {}) =>
      set({
        [`${fieldName}Form`]: { ...get()[`default${className}`], ...partial },
        [`${fieldName}`]: "loading",
        [`${fieldName}Modal`]: "edit",
      } as any),
    [`edit${className}`]: async (model: M) => {
      const entity = await graphQL[`get${gqlClassName}`](typeof model === "string" ? model : model.id);
      const obj = Utils.objectify(entity);
      set({
        [`${fieldName}`]: entity,
        [`${fieldName}Form`]: obj,
        [`${fieldName}Modal`]: "edit",
      } as any);
    },
    [`view${className}`]: async (model: M | string) => {
      const entity = await graphQL[`get${gqlClassName}`](typeof model === "string" ? model : model.id);
      set({ [`${fieldName}`]: entity, [`${fieldName}Modal`]: "view" } as Partial<DefaultState<T, M, L>>);
    },
    [`set${className}`]: (model: M) => {
      set({ [`${fieldName}`]: model } as Partial<DefaultState<T, M, L>>);
    },
    [`select${className}`]: (model: L | L[], refresh?: boolean) => {
      const selection = get()[`default${fieldName}Selection`];
      set({
        [`${fieldName}Selection`]: [...(refresh ? [] : selection), ...(isArray(model) ? model : [model])],
      } as any);
    },
    [`reset${className}`]: (model?: M) => {
      const obj = get()[`default${className}`];
      set({
        [`${fieldName}`]: model ?? "loading",
        [`${fieldName}Form`]: obj,
        [`${fieldName}Modal`]: null,
        [`${fieldName}Selection`]: [],
      } as any);
      return model ?? null;
    },
    [`setPageOf${className}`]: async (page: number) => {
      const state = get();
      if (state[`pageOf${className}`] === page) return;
      set({ [`${fieldName}List`]: "loading" } as any);
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](
        state[`queryOf${className}`],
        (page - 1) * state[`limitOf${className}`],
        state[`limitOf${className}`],
        state[`sortOf${className}`]
      );
      set({
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / state[`limitOf${className}`]) + 1, 1),
        [`pageOf${className}`]: page,
      } as Partial<DefaultState<T, M, L>>);
    },
    [`addPageOf${className}`]: async (page: number) => {
      const state = get();
      if (state[`pageOf${className}`] === page) return;
      const addFront = page < state[`pageOf${className}`];
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](
        state[`queryOf${className}`],
        (page - 1) * state[`limitOf${className}`],
        state[`limitOf${className}`],
        state[`sortOf${className}`]
      );
      set({
        [`${fieldName}List`]: addFront
          ? [...list, ...state[`${fieldName}List`]]
          : [...state[`${fieldName}List`], ...list],
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / state[`limitOf${className}`]) + 1, 1),
        [`pageOf${className}`]: page,
      } as Partial<DefaultState<T, M, L>>);
    },
    [`setLimitOf${className}`]: async (limit: number) => {
      const state = get();
      if (state[`limitOf${className}`] === limit) return;
      const skip = (state[`pageOf${className}`] - 1) * state[`limitOf${className}`];
      const page = Math.max(Math.floor((skip - 1) / limit) + 1, 1);
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](state[`queryOf${className}`], (page - 1) * limit, limit, state[`sortOf${className}`]);
      set({
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / limit) + 1, 1),
        [`limitOf${className}`]: limit,
        [`pageOf${className}`]: page,
      } as Partial<DefaultState<T, M, L>>);
    },
    [`setQueryOf${className}`]: async (query: any) => {
      if (equal(get()[`queryOf${className}`], query)) return; // store-level cache hit
      set({ [`${fieldName}List`]: "loading" } as any);
      const state = get();
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](query, 0, state[`limitOf${className}`], state[`sortOf${className}`]);
      set({
        [`queryOf${className}`]: { ...query },
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / state[`limitOf${className}`]) + 1, 1),
        [`pageOf${className}`]: 1,
        // [`queryOf${className}`]: { ...query },
      } as Partial<DefaultState<T, M, L>>);
    },
    [`setSortOf${className}`]: async (sort: { [key in keyof M]: 1 | -1 }) => {
      if (equal(get()[`sortOf${className}`], sort)) return; // store-level cache hit
      const state = get();
      set({ [`${fieldName}List`]: "loading" } as any);
      const { [`list${gqlClassName}` as any]: list, [`${gqlFieldName}Count` as any]: count } = await graphQL[
        `list${gqlClassName}`
      ](state[`queryOf${className}`], 0, state[`limitOf${className}`], sort);
      set({
        [`${fieldName}List`]: list,
        [`${fieldName}Count`]: count,
        [`lastPageOf${className}`]: Math.max(Math.floor((count - 1) / state[`limitOf${className}`]) + 1, 1),
        [`pageOf${className}`]: 1,
        [`sortOf${className}`]: { ...sort },
      } as Partial<DefaultState<T, M, L>>);
    },
  };
  return actions as unknown as DefaultActions<T, M, L>;
};

export type SliceModel<T extends string, M extends { id: string }, L = M> = {
  use: {
    [K in keyof DefaultState<T, M, L>]: () => DefaultState<T, M, L>[K];
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
type WithSelectors<S> = S extends { getState: () => infer T; setState: (state: infer A) => void }
  ? S & { use: { [K in keyof T]: () => T[K] } } & {
      do: { [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K] };
    } & {
      do: {
        [K in keyof T as T[K] extends (...args: any) => any ? never : SetKey<K & string>]: (
          value: FieldState<T[K]>
        ) => void;
      };
    } & {
      slice: {
        [K in keyof T as K extends `init${infer R}` ? Uncapitalize<R> : never]: K extends `init${infer R}`
          ? SliceModel<
              R extends `${infer M}In${infer _}` ? Uncapitalize<M> : Uncapitalize<R>,
              T extends { [_ in Uncapitalize<R>]: infer I | "loading" } ? I & { id: string } : never
            >
          : never;
      };
    } & { get: () => T; set: (state: A) => void }
  : never;
const createSelectors = <S extends UseBoundStore<StoreApi<unknown>>>(name: string, _store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  const state: any = store.getState();
  store.use = {};
  store.do = {};
  store.slice = {};
  for (const k of Object.keys(state)) {
    (store.use as any)[k] = () => store((s: any) => s[k as keyof typeof s]);
    if (typeof state[k] === "function") store.do[k] = state[k];
    else if (!store.do[`set${Utils.capitalize(k)}`])
      (store.do as any)[`set${Utils.capitalize(k)}`] = (value: any) => store.setState({ [k]: value });
  }
  const className = Utils.capitalize(name);
  const sliceNames = Object.keys(store.do)
    .filter((key) => key.startsWith("init") && key.endsWith(`In${className}`))
    .map((k) => Utils.lowerlize(k.replace("init", "")));
  for (const sliceName of sliceNames) {
    const sliceClassName = Utils.capitalize(sliceName);
    const modelNames = sliceName.split("In");
    const identifier = `In${modelNames[modelNames.length - 1]}`;
    store.slice[sliceName] = { use: {}, do: {} };
    Object.keys(store.use)
      .filter((k) => k.includes(sliceName) || k.includes(sliceClassName))
      .map((k) => (store.slice[sliceName].use[k.replace(identifier, "")] = store.use[k]));
    Object.keys(store.do)
      .filter((k) => k.includes(sliceClassName))
      .map((k) => (store.slice[sliceName].do[k.replace(identifier, "")] = store.do[k]));
  }
  store.slice[Utils.lowerlize(name)] = { use: store.use, do: store.do };
  store.get = store.getState;
  store.set = store.setState;
  return store;
};

//! generateStore will be depreicated
export const generateStore = <S extends UseBoundStore<StoreApi<unknown>>>(store: S) => createSelectors("dumb", store);

export const makeStore = <S, A extends { [key: string]: (...args: any) => void | Promise<void> }>(
  name: string,
  state: S,
  actions: (args: SetGet<S>) => A
) =>
  createSelectors(
    name,
    create(
      devtools(
        subscribeWithSelector(
          immer<S & A>(
            (set, get) =>
              ({
                ...state,
                ...actions({
                  set: set as any,
                  get,
                  pick: (...fields) => {
                    const state = get();
                    const ret = {} as any;
                    for (const field of fields) {
                      const val = state[field] as any;
                      if (!val || val === "loading") throw new Error(`Field ${field as string} is not ready`);
                      ret[field] = val;
                    }
                    return ret;
                  },
                }),
              } as any)
          )
        ),
        {
          name,
          anonymousActionType: name,
          type: name,
        }
      )
    )
  );
