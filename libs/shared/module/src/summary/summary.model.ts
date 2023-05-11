import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Query, Schema as Sch } from "mongoose";
import { dbConfig, Id } from "@shared/util-server";
import { SummarySchema, SummaryInput, childSummaries } from "./summary.gql";
import * as gql from "../gql";
import { Utils } from "@shared/util";
@Schema(dbConfig.defaultSchemaOptions)
class Summary extends SummarySchema {}
export const name = Summary.name;
export type Input = SummaryInput;
export type Raw = Summary;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = [Summary, ...childSummaries].reduce(
  (schema, summary) => schema.add(SchemaFactory.createForClass(summary as any)),
  new Sch()
) as any;
/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */
// * 5. 1. Document Methods
export interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  dumb: () => boolean;
}
schema.methods.dumb = function (this: Doc) {
  return true;
};

// * 5. 2. Model Statics
export interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  archive: (archiveType: "periodic" | "non-periodic", data: Input) => Promise<Doc>;
}
schema.statics.archive = async function (archiveType: "periodic" | "non-periodic", data: Input) {
  if (archiveType === "non-periodic") return await new this(data).save();
  const [type, at] = Utils.getPeriodicType();
  await this.updateOne(
    { status: "active", type: "active" },
    { ...data, type: "active", at, status: "active" },
    { upsert: true }
  );
  await this.updateOne({ status: "archived", type, at }, { ...data, type, at, status: "archived" }, { upsert: true });
  return await this.pickOne({ status: "archived", type, at });
};

// * 5. 3. Model Statics
export interface QryHelps extends dbConfig.DefaultQryHelps<Doc, QryHelps> {
  dumb: () => Query<any, Doc, QryHelps> & QryHelps;
}
schema.query.dumb = function () {
  return this.find({});
};

export const middleware = () => () => {
  // /**
  //  * * 미들웨어 설계: 스키마 데이터 관리 시 사용할 미들웨어를 작성하세요.
  //  * ? save 시 자동으로 적용할 알고리즘을 적용하세요.
  //  */
  // schema.pre<Doc>("save", async function (next) {
  //   next();
  // });
  return schema;
};
