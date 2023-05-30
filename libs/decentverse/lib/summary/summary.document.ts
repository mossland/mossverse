import { Document, Model, Query, Schema as Sch, Types } from "mongoose";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { dbConfig } from "@util/server";

import { SummaryInput, SummarySchema, childSummaries } from "./summary.constant";
import { doc as shared } from "@shared/server";

@Schema(dbConfig.defaultSchemaOptions)
class Summary extends SummarySchema {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Summary extends shared.Summary.Raw {}
export const name = Summary.name;
export type Input = SummaryInput & shared.Summary.Input;
export type Raw = Summary & shared.Summary.Raw;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & shared.Summary.DocType & dbConfig.DefaultSchemaFields;
export type Mdl = Model<Doc, QryHelps, DocMtds> & MdlStats & shared.Summary.Mdl;
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = [Summary, ...childSummaries].reduce(
  (schema, summary) => schema.add(SchemaFactory.createForClass(summary)),
  shared.Summary.schema
) as any;
/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
export interface DocMtds extends shared.Summary.DocMtds {
  dumb2: () => Doc;
}
schema.methods.dumb2 = function (this: Doc) {
  return this;
};

// * 5. 2. Model Statics
export interface MdlStats extends shared.Summary.MdlStats {
  dumb: () => Promise<Doc>;
}
schema.statics.dumb = async function () {
  const doc = this.pickOne({});
  return doc;
};

// * 5. 3. Model Statics
export interface QryHelps extends shared.Summary.QryHelps {
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
