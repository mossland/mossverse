import "reflect-metadata";
import { Utils } from "@shared/util";
import { ClassMeta, DefaultOf, FieldMeta, getClassMeta, getFieldMetas, getId, PurifyFunc, Type } from "./scalar";

const purify = (metadata: FieldMeta, value: any) => {
  if (metadata.nullable && value === null) return null;
  if (metadata.isArray) return value.map((v: any) => purify({ ...metadata, isArray: false }, v));
  if (metadata.isClass) return getPurify(metadata.modelRef)(value, true);
  if (metadata.name === "Date" && new Date(value).getTime() === new Date(-1).getTime())
    throw new Error(`Invalid Date Value (Default) in ${metadata.key} for value ${value}`);
  if (["String", "ID"].includes(metadata.name) && value === "")
    throw new Error(`Invalid String Value (Default) in ${metadata.key} for value ${value}`);
  if (!metadata.validate(value))
    throw new Error(`Invalid Value (Failed to pass validation) / ${value} in ${metadata.key}`);
  if (!metadata.nullable && !value && value !== 0 && value !== false)
    throw new Error(`Invalid Value (Nullable) in ${metadata.key} for value ${value}`);
  return value;
};
const getPurify = (target: any) => getClassMeta(target).purify;
export const makePurify =
  <I>(target: Type<I>): PurifyFunc<I> =>
  (self: DefaultOf<I>, isChild?: boolean) => {
    try {
      const classMeta: ClassMeta | undefined = Reflect.getOwnMetadata("class", target.prototype);
      if (isChild && classMeta?._id) return getId(self, classMeta._id);
      const metadatas = getFieldMetas(target);
      const result: any = {};
      for (const metadata of metadatas) {
        if (metadata.tailed) continue;
        const val = self[metadata.key];
        result[metadata.key] = purify(metadata, val);
      }
      return result;
    } catch (err) {
      if (isChild) throw new Error(err);
      return null;
    }
  };
