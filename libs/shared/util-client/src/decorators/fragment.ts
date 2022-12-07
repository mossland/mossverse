import "reflect-metadata";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { Utils } from "@shared/util";
import { FieldMeta, getClassMeta } from "./scalar";

export const makeFragmentGqlStr = (refName: string, gqlRef: string, metadatas: FieldMeta[]) => {
  const gqlStr =
    `\n  fragment ${Utils.lowerlize(refName)}Fragment on ${Utils.capitalize(gqlRef)} {\n` +
    metadatas
      .map((metadata) => {
        return metadata.isClass
          ? `    ${metadata.key} {\n      ...${Utils.lowerlize(metadata.name)}Fragment\n    }`
          : `    ${metadata.key}`;
      })
      .join(`\n`) +
    `\n  }`;
  return gqlStr;
};
export const getFragment = (target: any) => getClassMeta(target).gqlStr;
export const extractDependentFragments = (targets: any[]) => {
  const modelRefs = [...targets, ...targets.reduce((acc, target) => [...acc, ...getClassMeta(target).childRefs], [])];
  const gqlStr = modelRefs.map((modelRef) => getFragment(modelRef)).join(`\n  `);
  return gqlStr;
};
export const createFragment = (target: any) => gql(getFragment(target));
