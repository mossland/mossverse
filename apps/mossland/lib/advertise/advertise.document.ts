import { AdvertiseInput, AdvertiseSchema } from "./advertise.constant";
import { Document, Model, Query, Schema as Sch, Types } from "mongoose";
import { Id, dbConfig } from "@util/server";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema(dbConfig.defaultSchemaOptions)
class Advertise extends AdvertiseSchema {}
export const name = Advertise.name;
export type Input = AdvertiseInput;
export type Raw = Advertise;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Advertise
) as any;

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  //
  addBid: (userId: Id, value: number, images?: Id[], video?: Id) => Doc;
}

schema.methods.addBid = function (this: Doc, userId: Id, value: number, images: Id[] = [], video?: Id) {
  if (this.status !== "active") throw new Error("Advertise is not active");
  // if (value > this.bids[this.bids.length].value) throw new Error("Bid value is too low");
  // this.bids.push({ user: userId, value, images: images, video });
  return this;
};

// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  //
  dumb: () => Promise<Doc>;
}

// * 5. 3. Query Helper
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
