import "reflect-metadata";
import {
  ClassMeta,
  CrystalizeFunc,
  DefaultOf,
  FieldMeta,
  getClassMeta,
  getFieldMetas,
  getId,
  PurifyFunc,
  Type,
} from "./scalar";
import { logger } from "../logger";
import dayjs from "dayjs";

const purify = (metadata: FieldMeta, value: any) => {
  // 1. Check Data Validity
  if (metadata.nullable && (value === null || value === undefined || (typeof value === "string" && !value.length)))
    return null;
  if (metadata.isArray) return value.map((v: any) => purify({ ...metadata, isArray: false }, v));
  if (metadata.isClass) return getClassMeta(metadata.modelRef).purify(value, true);
  if (metadata.name === "Date" && dayjs(value).isBefore(dayjs(new Date(-1))))
    throw new Error(`Invalid Date Value (Default) in ${metadata.key} for value ${value}`);
  if (["String", "ID"].includes(metadata.name) && (value === "" || !value))
    throw new Error(`Invalid String Value (Default) in ${metadata.key} for value ${value}`);
  if (!metadata.validate(value))
    throw new Error(`Invalid Value (Failed to pass validation) / ${value} in ${metadata.key}`);
  if (!metadata.nullable && !value && value !== 0 && value !== false)
    throw new Error(`Invalid Value (Nullable) in ${metadata.key} for value ${value}`);

  // 2. Convert Value
  if (metadata.name === "Date") return dayjs(value).toDate();
  return value;
};

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
      logger.debug(err);
      return null;
    }
  };

const crystalize = (metadata: FieldMeta, value: any) => {
  if (metadata.isArray) return value.map((v: any) => crystalize({ ...metadata, isArray: false }, v));
  if (metadata.isClass) return getClassMeta(metadata.modelRef).crystalize(value, true);
  if (metadata.name === "Date") return dayjs(value);
  return value;
};

export const makeCrystalize =
  <M>(target: Type<M>): CrystalizeFunc<M> =>
  (self: M, isChild?: boolean) => {
    try {
      const metadatas = getFieldMetas(target);
      const result = Object.assign(new target() as any, self);
      for (const metadata of metadatas.filter((m) => !!self[m.key])) {
        result[metadata.key] = crystalize(metadata, self[metadata.key]);
      }
      return result;
    } catch (err) {
      if (isChild) throw new Error(err);
      return null;
    }
  };
