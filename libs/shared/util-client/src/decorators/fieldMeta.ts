import "reflect-metadata";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { Utils } from "@shared/util";
import {
  defaultMap,
  FieldMeta,
  FieldProps,
  Float,
  getClassMeta,
  getNonArrayModelRef,
  ID,
  Int,
  JSON,
  ReturnType,
} from "./scalar";

export function Field(returns: ReturnType, options?: FieldProps): PropertyDecorator {
  const isArray = !!returns()[0];
  const modelRef: any = getNonArrayModelRef(returns());
  const isClass = ![String, Boolean, Date, ID, Int, Float, JSON].some(
    (scalarRef) => modelRef.prototype === scalarRef.prototype
  );
  const name = isClass ? getClassMeta(modelRef).refName : modelRef.name;

  return (target, key: string) => {
    const metadata: FieldMeta = {
      key,
      name,
      className: target.constructor.name,
      isClass,
      modelRef,
      nullable: !!options?.nullable,
      tailed: !!options?.tailed,
      isArray,
      validate: options?.validate ?? (() => true),
      default: isArray ? [] : options?.default ?? null,
    };
    const metadatas =
      Reflect.getOwnMetadata("fields", target) ?? new Map(Reflect.getMetadata("fields", target)) ?? new Map();
    metadatas.set(key, metadata);
    Reflect.defineMetadata("fields", metadatas, target);
  };
}
