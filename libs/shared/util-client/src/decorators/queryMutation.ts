import "reflect-metadata";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { Utils } from "@shared/util";
import { DefaultGqls, getClassMeta, InputOf } from "./scalar";
import { extractDependentFragments } from "./fragment";
import { mutate, query } from "../apollo";

export const makeDefaultGqls = (target: any) => {
  const classMeta = getClassMeta(target);
  const [fieldName, className] = [Utils.lowerlize(classMeta.refName), Utils.capitalize(classMeta.refName)];
  const dependentFragments = extractDependentFragments([target]);
  const create =
    `${dependentFragments}\n` +
    `  mutation create${className}($data: ${className}Input!) {\n` +
    `    create${className}(data: $data) {\n` +
    `      ...${fieldName}Fragment\n` +
    `    }\n` +
    `  }`;
  const update =
    `${dependentFragments}\n` +
    `  mutation update${className}($${fieldName}Id: ID!, $data: ${className}Input!) {\n` +
    `    update${className}(${fieldName}Id: $${fieldName}Id, data: $data) {\n` +
    `      ...${fieldName}Fragment\n` +
    `    }\n` +
    `  }`;
  const remove =
    `${dependentFragments}\n` +
    `  mutation remove${className}($${fieldName}Id: ID!) {\n` +
    `    remove${className}(${fieldName}Id: $${fieldName}Id) {\n` +
    `      ...${fieldName}Fragment\n` +
    `    }\n` +
    `  }`;
  const get =
    `${dependentFragments}\n` +
    `  query get${className}($${fieldName}Id: ID!) {\n` +
    `    get${className}(${fieldName}Id: $${fieldName}Id) {\n` +
    `      ...${fieldName}Fragment\n` +
    `    }\n` +
    `  }`;
  const list =
    `${dependentFragments}\n` +
    `  query list${className}($query: JSON!, $skip: Int, $limit: Int) {\n` +
    `    list${className}(query: $query, skip: $skip, limit: $limit) {\n` +
    `      ...${fieldName}Fragment\n` +
    `    }\n` +
    `    ${fieldName}Count(query: $query)\n` +
    `  }`;
  const exists = `  query ${fieldName}Exists($query: JSON!) {\n` + `    ${fieldName}Exists(query: $query)\n` + `  }`;
  const count = `  query ${fieldName}Count($query: JSON!) {\n` + `    ${fieldName}Count(query: $query)\n` + `  }`;
  return {
    create: gql(create),
    update: gql(update),
    remove: gql(remove),
    get: gql(get),
    list: gql(list),
    exists: gql(exists),
    count: gql(count),
  };
};
export const makeDefaultQMs = <T extends string, M, I>(modelRef: any, inputRef: any): DefaultGqls<T, M, InputOf<I>> => {
  const refName = getClassMeta(modelRef).refName;
  const gqls = makeDefaultGqls(modelRef);
  const requests: DefaultGqls<T, M, InputOf<I>> = {} as any;
  const [fieldName, className] = [Utils.lowerlize(refName), Utils.capitalize(refName)];
  const names = {
    id: `${fieldName}Id`,
    get: `get${className}`,
    list: `list${className}`,
    count: `${fieldName}Count`,
    exists: `${fieldName}Exists`,
    create: `create${className}`,
    update: `update${className}`,
    remove: `remove${className}`,
  };
  requests[names.get] = async (id: string) => (await query(gqls.get, { [names.id]: id }))[names.get];
  requests[names.list] = async (qry: any, skip?: number, limit?: number) =>
    await query(gqls.list, { query: qry ?? {}, skip, limit });
  requests[names.count] = async (qry: any) => (await query(gqls.count, { query: qry ?? {} }))[names.count];
  requests[names.exists] = async (qry: any) => (await query(gqls.exists, { query: qry ?? {} }))[names.exists];
  requests[names.create] = async (data: I) => (await mutate(gqls.create, { data }))[names.create];
  requests[names.update] = async (id: string, data: I) =>
    (await mutate(gqls.update, { [names.id]: id, data }))[names.update];
  requests[names.remove] = async (id: string) => (await mutate(gqls.remove, { [names.id]: id }))[names.remove];
  return requests;
};
