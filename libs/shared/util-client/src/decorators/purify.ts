import "reflect-metadata";
import { Utils } from "@shared/util";
import { ClassMeta, FieldMeta, getClassMeta, getFieldMetas, getId, PurifyFunc } from "./scalar";

const purify = (metadata: FieldMeta, value: any) => {
  if (metadata.nullable && value === null) return null;
  if (metadata.isArray) return value.map((v: any) => purify({ ...metadata, isArray: false }, v));
  if (metadata.isClass) return getPurify(metadata.modelRef)(value, true);
  if (metadata.name === "Date" && new Date(value).getTime() === new Date(-1).getTime())
    throw new Error("Invalid Date Value (Default)");
  if (["String", "ID"].includes(metadata.name) && value === "") throw new Error("Invalid String Value (Default)");

  if (!metadata.validate(value)) throw new Error(`Invalid Value (Failed to pass validation) / ${value}`);
  if (!metadata.nullable && !value && value !== 0 && value !== false) throw new Error("Invalid Value (Nullable)");
  return value;
};
const getPurify = (target: any) => getClassMeta(target).purify;
export const makePurify =
  <I>(target: any): PurifyFunc<I> =>
  (self: any, isChild?: boolean) => {
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
  };
// export const createPurify =
//   <I>(target: any): PurifyFunc<I | null> =>
//   (self: any) => {
//     try {
//       return makePurify<I>(target)(self);
//     } catch (err) {
//       //   console.log(err);
//       return null;
//     }
//   };
