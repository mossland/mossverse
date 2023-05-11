import "reflect-metadata";
import { ClassMeta, ClassProps, FieldMeta, getClassMeta } from "./scalar";
import { makeFragmentGqlStr } from "./fragment";
import { makeDefault } from "./defaultValue";
import { makeCrystalize, makePurify } from "./purify";

export const getChildClassRefs = (metadatas: FieldMeta[]) => {
  const childRefs = metadatas
    .filter((metadata) => metadata.isClass)
    .reduce((acc, metadata) => {
      const classMeta = getClassMeta(metadata.modelRef);
      return [...acc, metadata.modelRef, ...classMeta.childRefs];
    }, []);
  return childRefs.filter(
    (modelRef, idx) => childRefs.findIndex((ref) => ref.prototype === modelRef.prototype) === idx
  ); // remove duplicates
};

export function ObjectType(refName: string, { _id, isAbstract, gqlRef = refName }: ClassProps = {}) {
  return function (target: any) {
    const metadataMap: Map<string, FieldMeta> = Reflect.getMetadata("fields", target.prototype) ?? new Map();
    for (const [field, metadata] of metadataMap)
      metadataMap.set(field, {
        ...metadata,
        className: metadata.className ?? refName,
        tailed: metadata.tailed || !metadata.className,
      });
    Reflect.defineMetadata("fields", metadataMap, target.prototype);
    const metadatas = [...metadataMap.values()];
    const classMeta: ClassMeta = {
      _id,
      isAbstract,
      refName,
      modelRef: target,
      purify: makePurify(target),
      crystalize: makeCrystalize(target),
      default: makeDefault(target),
      gqlRef,
      gqlStr: makeFragmentGqlStr(refName, gqlRef, metadatas),
      childRefs: getChildClassRefs(metadatas),
      hasFile: metadatas.some((metadata) => metadata.name === "File"),
    };
    Reflect.defineMetadata("class", classMeta, target.prototype);
  };
}
export function InputType(refName: string, { _id, isAbstract, gqlRef = refName }: ClassProps = {}): ClassDecorator {
  return function (target: any) {
    const metadataMap: Map<string, FieldMeta> = Reflect.getMetadata("fields", target.prototype) ?? new Map();
    for (const [field, metadata] of metadataMap)
      metadataMap.set(field, {
        ...metadata,
        className: metadata.className ?? refName,
        tailed: !metadata.tailed && !!metadata.className,
      });

    Reflect.defineMetadata("fields", metadataMap, target.prototype);
    const metadatas = [...metadataMap.values()];
    const classMeta: ClassMeta = {
      _id,
      isAbstract,
      refName,
      modelRef: target,
      purify: makePurify(target),
      crystalize: makeCrystalize(target),
      default: makeDefault(target),
      gqlRef,
      gqlStr: makeFragmentGqlStr(refName, gqlRef, metadatas),
      childRefs: getChildClassRefs(metadatas),
      hasFile: metadatas.some((metadata) => metadata.name === "File"),
    };
    Reflect.defineMetadata("class", classMeta, target.prototype);
  };
}
