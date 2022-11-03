export class BaseObject {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface BaseEntity extends Function {
  new (...any: any[]): any;
  [key: string]: any;
}

export class Int {}
export class Float {}
export class ID {}
export class JSON {}
export type SingleFieldType =
  | Int
  | Float
  | StringConstructor
  | BooleanConstructor
  | ID
  | DateConstructor
  | JSON
  | BaseEntity;

export const defaultMap = {
  ID: "",
  String: "",
  Boolean: false,
  Date: new Date(-1),
  Int: 0,
  Float: 0,
  JSON: {},
};
export const getNonArrayModelRef = (modelRef: any) => {
  let target: any = modelRef;
  while (!target.name) target = target[0];
  return target;
};

export interface ClassProps {
  _id?: string;
  isAbstract?: boolean;
}
export interface ClassMeta extends ClassProps {
  refName: string;
  default: any;
  gqlStr: string;
  purify: PurifyFunc<any>;
  modelRef: any;
  childRefs: any[];
}
export type FieldMeta = {
  key: string;
  name: string;
  className: string;
  isClass: boolean;
  nullable: boolean;
  modelRef: any;
  tailed: boolean;
  isArray: boolean;
  isObject?: boolean;
  isInput?: boolean;
  default: any | null;
  validate: (value: any) => boolean;
};
export type ReturnType = () => SingleFieldType | [SingleFieldType];
export type FieldProps = {
  nullable?: boolean;
  tailed?: boolean;
  default?: any;
  validate?: (value: any) => boolean;
};

export const getClassMeta = (modelRef: any) => {
  const target = getNonArrayModelRef(modelRef);
  const classMeta: ClassMeta | undefined = Reflect.getOwnMetadata("class", target.prototype);
  if (!classMeta) throw new Error(`No ClassMeta or GqlStr for this target ${target} in getFragment`);
  return classMeta;
};
export const getFieldMetas = (modelRef: any) => {
  const target = getNonArrayModelRef(modelRef);
  const metadataMap: Map<string, FieldMeta> = Reflect.getMetadata("fields", target.prototype) ?? new Map();
  return [...metadataMap.values()];
};

export type InputField<T> = T extends (infer K)[] ? InputField<K>[] : T extends BaseObject ? string : T;
export type InputOf<T> = { [K in keyof T]: InputField<T[K]> };
export type PurifyFunc<I> = (self: any, isChild?: boolean) => InputOf<I>;

export const getId = (self: any, key: string) => {
  const _id = self[key];
  if (!_id) throw new Error("Invalid Value (No ID)");
  return _id;
};

export type FieldState<T> = T extends string
  ? T
  : T extends number
  ? T
  : T extends boolean
  ? T
  : T extends Date
  ? T
  : T extends any[]
  ? T
  : T | null;

export type DefaultOf<S> = S extends infer T ? { [K in keyof T]: FieldState<T[K]> } : never;

type ListQueryResponse<T extends string, M> = T extends `${infer S}`
  ? { [K in `list${Capitalize<S>}`]: M[] } & { [K in `${Uncapitalize<S>}Count`]: number }
  : never;
type GetQuery<T extends string, M> = T extends `${infer S}`
  ? { [K in `get${Capitalize<S>}`]: (id: string) => Promise<M> }
  : never;
type ListQuery<T extends string, M> = T extends `${infer S}`
  ? { [K in `list${Capitalize<S>}`]: (query: any, skip?: number, limit?: number) => Promise<ListQueryResponse<T, M>> }
  : never;
type CountQuery<T extends string, M> = T extends `${infer S}`
  ? { [K in `${Uncapitalize<S>}Count`]: (query: any) => Promise<number> }
  : never;
type ExistsQuery<T extends string, M> = T extends `${infer S}`
  ? { [K in `${Uncapitalize<S>}Exists`]: (query: any) => Promise<boolean> }
  : never;
type CreateMutation<T extends string, M, I> = T extends `${infer S}`
  ? { [K in `create${Capitalize<S>}`]: (data: I) => Promise<M> }
  : never;
type UpdateMutation<T extends string, M, I> = T extends `${infer S}`
  ? { [K in `update${Capitalize<S>}`]: (id: string, data: I) => Promise<M> }
  : never;
type RemoveMutation<T extends string, M> = T extends `${infer S}`
  ? { [K in `remove${Capitalize<S>}`]: (id: string) => Promise<M> }
  : never;
export type DefaultGqls<T extends string, M, I> = GetQuery<T, M> &
  ListQuery<T, M> &
  CountQuery<T, M> &
  ExistsQuery<T, M> &
  CreateMutation<T, M, I> &
  UpdateMutation<T, M, I> &
  RemoveMutation<T, M>;
