import "reflect-metadata";
import { BaseObject, FieldMeta, getFieldMetas, ID, Type } from "./scalar";
import { ObjectType } from "./classMeta";
import { Field } from "./fieldMeta";

export function BaseGql<T>(inputRef: Type<T>): Type<T & { id: string; createdAt: Date; updatedAt: Date }> {
  @ObjectType("Base")
  class BaseGql extends (inputRef as any) {
    @Field(() => ID)
    id: string;
    @Field(() => Date)
    createdAt: Date;
    @Field(() => Date)
    updatedAt: Date;
  }
  return BaseGql as any;
}
export function BaseArrayFieldGql<T>(inputRef: Type<T>): Type<T & { id: string }> {
  @ObjectType("Base", { isAbstract: true })
  class BaseGql extends (inputRef as any) {
    @Field(() => ID)
    id: string;
  }
  return BaseGql as any;
}

export function PickType<T, F extends keyof T>(
  modelRef: Type<T>,
  fields: readonly F[]
): Type<
  { [P in typeof fields[number]]: T[P] } & {
    [K in keyof T as T[K] extends (...any) => any ? K : never]: T[K];
  } & BaseObject
> {
  const metadataMap: Map<string, FieldMeta> = Reflect.getMetadata("fields", modelRef.prototype) ?? new Map();
  class Pick {}
  Object.assign(Pick.prototype, modelRef.prototype);
  ["id", ...fields, "createdAt", "updatedAt"].map((field) => {
    const fieldMeta = metadataMap.get(field as string);
    if (fieldMeta)
      Field(() => (fieldMeta.isArray ? [fieldMeta.modelRef] : fieldMeta.modelRef), fieldMeta)(
        Pick.prototype,
        field as string
      );
  });
  ObjectType("Pick")(Pick);
  return Pick as any;
}
