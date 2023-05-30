import { Document, Model, Query, Schema as Sch, Types } from "mongoose";
import { Id, dbConfig } from "@util/server";
import { MocWalletInput, MocWalletSchema } from "./mocWallet.constant";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema(dbConfig.defaultSchemaOptions)
class MocWallet extends MocWalletSchema {}
export const name = MocWallet.name;
export type Input = MocWalletInput;
export type Raw = MocWallet;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  MocWallet
) as any;

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  isActive: () => boolean;
  deposit: (user: Id) => Promise<Doc>;
}
schema.methods.isActive = function (this: Doc) {
  return this.status === "active";
};
schema.methods.deposit = async function (this: Doc, user: Id) {
  const expireAt = new Date(new Date().getTime() + 60 * 60 * 6 * 1000);
  return await this.merge({ user, expireAt, status: "reserved" }).save();
};

// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  foo: () => void;
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
