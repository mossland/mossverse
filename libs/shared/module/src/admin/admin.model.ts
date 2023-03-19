import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Query, Schema as MongoSchema } from "mongoose";
import { dbConfig } from "@shared/util-server";
import { AdminSchema, AdminInput } from "./admin.gql";
import { SecurityOptions } from "../option";
import * as bcrypt from "bcrypt";
import { cnst } from "@shared/util";

@Schema(dbConfig.defaultSchemaOptions)
class Admin extends AdminSchema {}
export const name = Admin.name;
export type Input = AdminInput;
export type Raw = Admin;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export type Sch = MongoSchema<null, Mdl, DocMtds, QryHelps, null, MdlStats>;
export const schema: Sch = SchemaFactory.createForClass<Raw, Doc>(Admin) as any;
schema.index({ accountId: "text" });

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  addRole: (role: cnst.AdminRole) => Doc;
  subRole: (role: cnst.AdminRole) => Doc;
}
schema.methods.addRole = function (this: Doc, role: cnst.AdminRole) {
  if (!this.roles.includes(role)) this.roles.push(role);
  return this;
};
schema.methods.subRole = function (this: Doc, role: cnst.AdminRole) {
  this.roles = this.roles.filter((r) => r !== role);
  return this;
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
export const middleware = (options: SecurityOptions) => () => {
  /**
   * * 미들웨어 설계: 스키마 데이터 관리 시 사용할 미들웨어를 작성하세요.
   * ? save 시 자동으로 적용할 알고리즘을 적용하세요.
   */
  schema.pre<Doc>("save", async function (next) {
    const model = this.constructor as Mdl;
    if (this.isNew) model.addSummary(["total", this.status]);
    else if (this.status === "inactive" && this.isModified("status")) model.subSummary(["total", this.status]);
    // else model.moveSummary(this.getChanges().$set?.status, this.status);
    if (!this.isModified("password") || !this.password) return next();
    const encryptedPassword = await bcrypt.hash(this.password, options.saltRounds);
    this.password = encryptedPassword;
    next();
  });
  return schema;
};
