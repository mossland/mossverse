import "reflect-metadata";
import gql from "graphql-tag";
import { Utils } from "@shared/util";
import { BaseObject, ClassMeta, defaultMap, DefaultOf, FieldMeta, getFieldMetas, PurifyFunc, Type } from "./scalar";

const getDefaultValue = (metadata: FieldMeta) => {
  if (metadata.default) return metadata.default;
  if (metadata.isArray) return [];
  if (metadata.nullable) return null;
  if (metadata.isClass) return makeDefault(metadata.modelRef, true);
  return defaultMap[metadata.name];
};

export const makeDefault = <T>(target: Type<T>, isChild?: boolean): DefaultOf<T> => {
  const classMeta: ClassMeta | undefined = Reflect.getOwnMetadata("class", target.prototype);
  if (isChild && classMeta?._id) return null as any;
  const metadatas = getFieldMetas(target);
  const result: any = {};
  for (const metadata of metadatas) result[metadata.key] = getDefaultValue(metadata);
  return result;
};
