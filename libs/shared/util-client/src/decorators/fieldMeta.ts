import "reflect-metadata";
import { FieldMeta, FieldProps, Float, getClassMeta, getNonArrayModelRef, ID, Int, JSON, ReturnType } from "./scalar";

export function Field(returns: ReturnType, options: FieldProps = {}): PropertyDecorator {
  const isArray = !!returns()[0];
  const modelRef: any = getNonArrayModelRef(returns());
  const isClass = ![String, Boolean, Date, ID, Int, Float, JSON].some(
    (scalarRef) => modelRef.prototype === scalarRef.prototype
  );
  const name = isClass
    ? getClassMeta(modelRef).refName
    : String.prototype === modelRef.prototype
    ? "String"
    : Boolean.prototype === modelRef.prototype
    ? "Boolean"
    : Date.prototype === modelRef.prototype
    ? "Date"
    : ID.prototype === modelRef.prototype
    ? "ID"
    : Int.prototype === modelRef.prototype
    ? "Int"
    : Float.prototype === modelRef.prototype
    ? "Float"
    : JSON.prototype === modelRef.prototype
    ? "JSON"
    : "Unknown";

  return (target, key: string) => {
    const metadata: FieldMeta = {
      key,
      name,
      className: null,
      isClass,
      modelRef,
      nullable: !!options?.nullable,
      tailed: !!options?.tailed,
      isArray,
      validate: options?.validate ?? (() => true),
      default: options?.default ?? (isArray ? [] : null),
    };
    const metadatas =
      Reflect.getOwnMetadata("fields", target) ?? new Map(Reflect.getMetadata("fields", target)) ?? new Map();
    metadatas.set(key, metadata);
    Reflect.defineMetadata("fields", metadatas, target);
  };
}
