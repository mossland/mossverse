import "reflect-metadata";
import gql from "graphql-tag";
import { Utils } from "@shared/util";
import { DefaultGqls, getClassMeta, InputOf, ProtoFile } from "./scalar";
import { extractDependentFragments } from "./fragment";
import { mutate, query } from "../client";
import dayjs from "dayjs";

const fileFragment = `
  fragment fileFragment on File {
    id
    imageSize
    url
    createdAt
    updatedAt
  }
`;

export const makeDefaultGqls = (target: any, lightModelRef: any) => {
  const [classMeta, lightClassMeta] = [getClassMeta(target), getClassMeta(lightModelRef)];
  const [fieldName, className] = [Utils.lowerlize(classMeta.refName), Utils.capitalize(classMeta.refName)];
  const [lightFieldName, lightClassName] = [
    Utils.lowerlize(lightClassMeta.refName),
    Utils.capitalize(lightClassMeta.refName),
  ];
  const [dependentFragments, lightDependentFragments] = [
    extractDependentFragments([target]),
    extractDependentFragments([lightModelRef]),
  ];
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
    `${lightDependentFragments}\n` +
    `  query list${className}($query: JSON!, $skip: Int, $limit: Int, $sort: JSON) {\n` +
    `    list${className}(query: $query, skip: $skip, limit: $limit, sort: $sort) {\n` +
    `      ...${lightFieldName}Fragment\n` +
    `    }\n` +
    `    ${fieldName}Count(query: $query)\n` +
    `  }`;
  const exists = `  query ${fieldName}Exists($query: JSON!) {\n` + `    ${fieldName}Exists(query: $query)\n` + `  }`;
  const count = `  query ${fieldName}Count($query: JSON!) {\n` + `    ${fieldName}Count(query: $query)\n` + `  }`;
  const addFiles =
    `${fileFragment}\n` +
    `  mutation add${className}Files($files: [Upload!]!, $${fieldName}Id: ID) {\n` +
    `    add${className}Files(files: $files, ${fieldName}Id: $${fieldName}Id) {\n` +
    `      ...fileFragment\n` +
    `    }\n` +
    `  }`;
  return {
    create: gql(create),
    update: gql(update),
    remove: gql(remove),
    get: gql(get),
    list: gql(list),
    exists: gql(exists),
    count: gql(count),
    addFiles: gql(addFiles),
  };
};

export const makeDefaultQMs = <T extends string, M, I, L>(
  modelRef: any,
  inputRef: any,
  lightModelRef: any = modelRef
): DefaultGqls<T, M, InputOf<I>, L> => {
  const { refName, hasFile, crystalize } = getClassMeta(modelRef);
  const { crystalize: lightCrystalize } = getClassMeta(lightModelRef);
  const gqls = makeDefaultGqls(modelRef, lightModelRef);
  const requests: DefaultGqls<T, M, InputOf<I>, L> = {} as any;
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
    addFiles: `add${className}Files`,
  };
  requests[names.get] = async (id: string) => crystalize((await query(gqls.get, { [names.id]: id }))[names.get]);
  requests[names.list] = async (qry: any, skip?: number, limit?: number, sort?: any) => {
    const ret = await query(gqls.list, {
      query: qry ?? { status: { $ne: "inactive" } },
      skip,
      limit,
      sort: sort ?? { createdAt: -1 },
    });
    return {
      [names.list]: ret[names.list].map((data) => lightCrystalize(data)),
      [names.count]: ret[names.count],
    };
  };
  requests[names.count] = async (qry: any) => (await query(gqls.count, { query: qry ?? {} }))[names.count];
  requests[names.exists] = async (qry: any) => (await query(gqls.exists, { query: qry ?? {} }))[names.exists];
  requests[names.create] = async (data: I) => crystalize((await mutate(gqls.create, { data }))[names.create]);
  requests[names.update] = async (id: string, data: I) => {
    return crystalize((await mutate(gqls.update, { [names.id]: id, data }))[names.update]);
  };

  requests[names.remove] = async (id: string) =>
    crystalize((await mutate(gqls.remove, { [names.id]: id }))[names.remove]);
  if (hasFile)
    requests[names.addFiles] = async (files: FileList, id?: string) =>
      (await mutate(gqls.addFiles, { files, [names.id]: id }))[names.addFiles].map((file) =>
        Object.assign(new ProtoFile(), { ...file, createdAt: dayjs(file.createdAt), updatedAt: dayjs(file.updatedAt) })
      );
  return requests;
};
