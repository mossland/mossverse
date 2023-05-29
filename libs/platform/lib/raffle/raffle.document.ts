import { Document, Model, Query, Schema as Sch, Types } from "mongoose";
import { Entry } from "../_platform/entry.constant";
import { Id, dbConfig } from "@util/server";
import { PriceTagInput } from "../_platform/priceTag.constant";
import { RaffleInput, RaffleSchema } from "./raffle.constant";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema(dbConfig.defaultSchemaOptions)
class Raffle extends RaffleSchema {}
export const name = Raffle.name;
export type Input = RaffleInput;
export type Raw = Raffle;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Raffle
) as any;

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  isPurchaseWith: (type: "thing" | "token", tag: PriceTagInput) => boolean;
  isPurchaseable: () => boolean;
  getEntry: (user: Id) => Entry | undefined;
  addEntry: (user: Id) => Doc;
  isPicked: (user: Id) => boolean;
  isEntryExceed: (user: Id) => boolean;
}
schema.methods.isPurchaseWith = function (this: Doc, type: "thing" | "token", tag: PriceTagInput) {
  return !!(
    tag[type] &&
    this.priceTags.find((priceTag) => priceTag[type]?.equals(tag[type] as Id) && priceTag.price === tag.price)
  );
};
schema.methods.isPurchaseable = function (this: Doc) {
  if (this.status !== "active" || this.closeAt.getTime() < Date.now()) return false;
  return true;
};
schema.methods.getEntry = function (this: Doc, user: Id) {
  return this.entries.find((entry) => entry.user.equals(user));
};

//! 여기서 값만 업데이트하고 return만 한다.
schema.methods.addEntry = function (this: Doc, user: Id) {
  this.entries.find((entry) => entry.user.equals(user)) ?? this.entries.push({ user, value: 0 });
  this.entries = this.entries.map((entry) => {
    if (entry.user.equals(user)) entry.value += 1;
    return entry;
  });
  return this;
};
schema.methods.isPicked = function (this: Doc, user: Id) {
  return this.winners.every((w) => w.equals(user));
};
schema.methods.isEntryExceed = function (this: Doc, user: Id) {
  const entry = this.getEntry(user);
  return !!(entry && entry.value >= this.entryLimit);
};

// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  dumb: () => Promise<Doc>;
}
schema.statics.dumb = async function () {
  const doc = this.pickOne({});
  return doc;
};

// * 5. 3. Model Statics
interface QryHelps extends dbConfig.DefaultQryHelps<Doc, QryHelps> {
  dumb: () => Query<any, Doc, QryHelps> & QryHelps;
}
schema.query.dumb = function () {
  return this.find({});
};
export const middleware = () => () => {
  /**
   * * 미들웨어 설계: 스키마 데이터 관리 시 사용할 미들웨어를 작성하세요.
   * ? save 시 자동으로 적용할 알고리즘을 적용하세요.
   */
  schema.pre<Doc>("save", async function (next) {
    const model = this.constructor as Mdl;
    if (this.isNew) model.addSummary(["total", this.status]);
    else if (this.status === "inactive" && this.isModified("status")) model.subSummary(["total", this.status]);
    // else model.moveSummary(this.getChanges().$set?.status, this.status);
    next();
  });
  return schema;
};
