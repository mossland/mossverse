import "reflect-metadata";
import { BaseObject, FieldMeta, getFieldMetas, ID, Type } from "./scalar";
import { ObjectType } from "./classMeta";
import { Field } from "./fieldMeta";
import { Dayjs } from "dayjs";

export function BaseGql<T>(inputRef: Type<T>): Type<T & BaseObject> {
  @ObjectType("Base")
  class BaseGql extends (inputRef as any) {
    @Field(() => ID)
    id: string;
    @Field(() => Date)
    createdAt: Dayjs;
    @Field(() => Date)
    updatedAt: Dayjs;

    __ModelType__: "full" | "light" = "full";
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
  { [P in (typeof fields)[number]]: T[P] } & {
    [K in keyof T as T[K] extends (...any) => any ? K : never]: T[K];
  } & BaseObject
> {
  const metadataMap: Map<string, FieldMeta> = Reflect.getMetadata("fields", modelRef.prototype) ?? new Map();
  class Pick extends (modelRef as any) {
    __ModelType__: "full" | "light" = "light";
  }
  // Object.assign(Pick.prototype, modelRef.prototype);
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

export function IntersectionType<A, B>(modelRef: Type<A>, writeRef: Type<B>): Type<A & B> {
  const modelMetadataMap: Map<string, FieldMeta> = Reflect.getMetadata("fields", modelRef.prototype) ?? new Map();
  const writeMetadataMap: Map<string, FieldMeta> = Reflect.getMetadata("fields", writeRef.prototype) ?? new Map();
  class Intersection {}
  Object.assign(Intersection.prototype, modelRef.prototype, writeRef.prototype);
  [...modelMetadataMap.keys()].map((field) => {
    const fieldMeta = modelMetadataMap.get(field as string);
    if (fieldMeta)
      Field(() => (fieldMeta.isArray ? [fieldMeta.modelRef] : fieldMeta.modelRef), fieldMeta)(
        Intersection.prototype,
        field as string
      );
  });
  [...writeMetadataMap.keys()].map((field) => {
    const fieldMeta = writeMetadataMap.get(field as string);
    if (fieldMeta)
      Field(() => (fieldMeta.isArray ? [fieldMeta.modelRef] : fieldMeta.modelRef), fieldMeta)(
        Intersection.prototype,
        field as string
      );
  });
  ObjectType("Intersection")(Intersection);
  return Intersection as any;
}
