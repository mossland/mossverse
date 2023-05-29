import { Document, Model, Query, Schema as Sch, Types } from "mongoose";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserInput, UserSchema } from "./user.constant";
import { cnst, dbConfig } from "@util/server";
@Schema(dbConfig.defaultSchemaOptions)
class User extends UserSchema {}
export const name = User.name;
export type Input = UserInput;
export type Raw = User;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  User
) as any;
/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */
// * 5. 1. Document Methods
export interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  addRole: (role: cnst.UserRole) => Doc;
  subRole: (role: cnst.UserRole) => Doc;
  addRequestRole: (role: cnst.UserRole) => Doc;
  subRequestRole: (role: cnst.UserRole) => Doc;
}
schema.methods.addRole = function (this: Doc, role: cnst.UserRole) {
  if (!this.roles.includes(role)) this.roles.push(role);
  return this;
};
schema.methods.subRole = function (this: Doc, role: cnst.UserRole) {
  this.roles = this.roles.filter((r) => r !== role);
  return this;
};
schema.methods.addRequestRole = function (this: Doc, role: cnst.UserRole) {
  if (!this.requestRoles.includes(role)) this.requestRoles.push(role);
  return this;
};
schema.methods.subRequestRole = function (this: Doc, role: cnst.UserRole) {
  this.requestRoles = this.requestRoles.filter((r) => r !== role);
  return this;
};

// * 5. 2. Model Statics
export interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  dumb: () => Promise<Doc>;
}
schema.statics.dumb = async function () {
  const doc = this.pickOne({});
  return doc;
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
  schema.pre<Doc>("save", async function (next) {
    const model = this.constructor as Mdl;
    if (this.isNew) model.addSummary(["total", this.status]);
    else if (this.status === "inactive" && this.isModified("status")) model.subSummary(["total", this.status]);
    next();
  });
  return schema;
};
