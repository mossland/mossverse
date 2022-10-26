import * as DataLoader from "dataloader";
import { Model, FilterQuery, Document, Types, Query } from "mongoose";
import * as _ from "lodash";

export const createLoader = <Key, Value>(
  model: Model<any>,
  fieldName = "_id",
  defaultQuery: FilterQuery<unknown> = {}
) => {
  return new DataLoader<Key, Value>(
    (fields) => {
      const query: FilterQuery<unknown> = {
        status: { $ne: "inactive" },
        ...defaultQuery,
      };
      query[fieldName] = { $in: fields };
      const data = model.find(query).then((list: Document<unknown>[]) => {
        const listByKey = _.keyBy(list, fieldName);
        return fields.map((id: unknown) => _.get(listByKey, id as any, null));
      });
      return data;
    },
    { cache: false }
  );
};
export const createArrayLoader = <K, V>(
  model: Model<unknown>,
  fieldName = "_id",
  defaultQuery: FilterQuery<unknown> = {}
) => {
  return new DataLoader<K, V>((fields: any) => {
    const query: FilterQuery<unknown> = {
      status: { $ne: "inactive" },
      ...defaultQuery,
    };
    query[fieldName] = { $in: fields };
    const data = model.find(query).then((list) => {
      return fields.map((field) => list.filter((item) => (field as Types.ObjectId).equals(item[fieldName])));
    });
    return data;
  });
};
export const createArrayElementLoader = <K, V>(
  model: Model<unknown>,
  fieldName = "_id",
  defaultQuery: FilterQuery<unknown> = {}
) => {
  return new DataLoader<K, V>(
    (fields) => {
      const query: FilterQuery<unknown> = {
        status: { $ne: "inactive" },
        ...defaultQuery,
      };
      query[fieldName] = { $in: fields };
      const data = model.find(query).then((list: Document<unknown>[]) => {
        const flatMap = _.flatMap(list, (dat) =>
          dat[fieldName].map((datField: unknown) => ({
            ...dat.toObject(),
            key: datField,
          }))
        );
        const listByKey = _.groupBy(flatMap, (dat) => dat.key);
        return fields.map((id) => _.get(listByKey, id as any, null));
      });
      return data;
    },
    { cache: false }
  );
};
export const createPopulatedLoader = <K, V>(
  model: Model<unknown>,
  fieldName = "_id",
  populateFields: string[] = [],
  defaultQuery: FilterQuery<unknown> = {}
) => {
  return new DataLoader<K, V>(
    (fields) => {
      const query: FilterQuery<unknown> = {
        status: { $ne: "inactive" },
        ...defaultQuery,
      };
      query[fieldName] = { $in: fields };
      const data = populateFields
        .reduce((fn: Query<unknown, unknown, unknown, unknown>, field: string) => fn.populate(field), model.find(query))
        .then((list: Document<unknown>[]) => {
          const listByKey = _.keyBy(list, fieldName);
          return fields.map((id) => _.get(listByKey, id as any, null));
        });
      return data;
    },
    { cache: false }
  );
};
export const createArrayElementPopulatedLoader = <K, V>(
  model: Model<unknown>,
  fieldName = "_id",
  populateFields: string[] = [],
  defaultQuery: FilterQuery<unknown> = {}
) => {
  return new DataLoader<K, V>(
    (fields) => {
      const query: FilterQuery<unknown> = {
        status: { $ne: "inactive" },
        ...defaultQuery,
      };
      query[fieldName] = { $in: fields };
      const data = populateFields
        .reduce((fn: FilterQuery<unknown>, field: string) => fn.populate(field), model.find(query))
        .then((list: Document<unknown>[]) => {
          const flatMap = _.flatMap(list, (dat: any) =>
            dat[fieldName].map((datField: any) => ({
              ...dat.toObject(),
              key: datField,
            }))
          );
          const listByKey = _.groupBy(flatMap, (dat: any) => dat.key);
          return fields.map((id) => _.get(listByKey, id as any, null));
        });
      return data;
    },
    { cache: false }
  );
};
