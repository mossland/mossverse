import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Query, Schema as Sch } from "mongoose";
import { dbConfig, Id } from "@shared/util-server";

import { UserSchema, UserInput } from "./user.gql";
import * as gql from "../gql";
import { db as shared } from "@shared/module";
import { Utils } from "@shared/util";

@Schema(dbConfig.defaultSchemaOptions)
class User extends UserSchema {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface User extends shared.User.Raw {}
export const name = User.name;
export type Input = UserInput & shared.User.Input;
export type Raw = User & shared.User.Raw;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & shared.User.DocType & dbConfig.DefaultSchemaFields;
export type Mdl = Model<Doc, QryHelps, DocMtds> & MdlStats & shared.User.Mdl;
const addSchema = SchemaFactory.createForClass<Raw, Doc>(User);
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = shared.User.schema.add(addSchema) as any;
/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
export interface DocMtds extends shared.User.DocMtds {
  incItems: (items: gql.ExchangeInput[]) => Doc;
  decItems: (items: gql.ExchangeInput[]) => Doc;
  addItem: (thingId: Id, num: number) => Doc;
  hasItem: (thingId: Id, num: number) => boolean;
  item: (thingId: Id) => gql.shared.ThingItem;
}
schema.methods.incItems = function (this: Doc, changes: gql.ExchangeInput[]) {
  changes.map((change) => {
    if (!change.thing) return;
    const item = this.items.find((item) => item.thing.equals(change.thing as Id));
    if ((item?.num ?? 0) + change.num < 0) throw new Error("Negative Item Num");
    if (!item) return this.items.push(change as gql.shared.ThingItemInput);
    else item.num += change.num;
    if (item.num === 0) this.items = this.items.filter((item) => !item.thing.equals(item.thing));
  });
  return this;
};
schema.methods.decItems = function (this: Doc, changes: gql.ExchangeInput[]) {
  changes.map((change) => {
    if (!change.thing) return;
    const thing = change.thing;
    const item = this.items.find((item) => item.thing.equals(change.thing as Id));
    if ((item?.num ?? 0) - change.num < 0) throw new Error("Negative Item Num");
    if (!item) return this.items.push({ ...change, thing, num: -change.num });
    else item.num -= change.num;
    if (item.num === 0) this.items = this.items.filter((item) => !item.thing.equals(item.thing));
  });
  return this;
};
schema.methods.hasItem = function (this: Doc, thingId: Id, num: number) {
  return this.items.some((item) => item.thing.equals(thingId) && item.num >= num);
};
schema.methods.item = function (this: Doc, thingId: Id) {
  return this.items.find((item) => item.thing.equals(thingId)) ?? { thing: thingId, num: 0 };
};

schema.methods.addItem = function (this: Doc, thingId: Id, num: number) {
  this.items.push({ thing: thingId, num });
  return this;
};

// * 5. 2. Model Statics
export interface MdlStats extends shared.User.MdlStats {
  dumb: () => Promise<Doc>;
}
schema.statics.dumb = async function () {
  const doc = this.pickOne({});
  return doc;
};

// * 5. 3. Model Statics
export interface QryHelps extends shared.User.QryHelps {
  dumb: () => Query<any, Doc, QryHelps> & QryHelps;
}
schema.query.dumb = function (this: Mdl) {
  return this.find({});
};

export const middleware = () => () => {
  /**
   * * 미들웨어 설계: 스키마 데이터 관리 시 사용할 미들웨어를 작성하세요.
   * ? save 시 자동으로 적용할 알고리즘을 적용하세요.
   */
  schema.pre<Doc>("save", async function (next) {
    next();
  });
  return schema;
};
