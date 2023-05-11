import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Query, Schema as Sch } from "mongoose";
import { dbConfig, Id } from "@shared/util-server";
import { MocSurveySchema, MocSurveyInput } from "./mocSurvey.gql";
import * as gql from "../gql";
@Schema(dbConfig.defaultSchemaOptions)
class MocSurvey extends MocSurveySchema {}
export const name = MocSurvey.name;
export type Input = MocSurveyInput;
export type Raw = MocSurvey;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  MocSurvey
) as any;

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  getResponseUsers: () => Id[];
  addResponse: (response: gql.platform.UserSurveyResponse) => Doc;
  removeResponse: (response: gql.platform.UserSurveyResponse) => Doc;
  close: (snapshots: { user: Id; num: number }[]) => Doc;
}
schema.methods.addResponse = function (this: Doc, response: gql.platform.UserSurveyResponse) {
  const res = this.responses.find((res) => res.user.equals(response.user));
  if (res) this.removeResponse(res);
  this.responses.push(response);
  this.userNum += 1;
  this.mocNum += response.num;
  if (response.selection) {
    this.selectMocNum[response.selection] += response.num;
    this.selectUserNum[response.selection] += 1;
  }
  return this;
};
schema.methods.removeResponse = function (this: Doc, response: gql.platform.UserSurveyResponse) {
  this.responses = this.responses.filter((res) => !res.user.equals(response.user));
  this.userNum -= 1;
  this.mocNum -= response.num;
  if (response.selection) {
    this.selectMocNum[response.selection] -= response.num;
    this.selectUserNum[response.selection] -= 1;
  }
  return this;
};

schema.methods.getResponseUsers = function (this: Doc) {
  return this.responses.map((response) => response.user);
};
schema.methods.close = function (this: Doc, ownerships: gql.platform.MocOwnership[]) {
  const selectNum = new Array(this.selections.length).fill(0);
  this.merge({ userNum: 0, mocNum: 0, selectMocNum: selectNum, selectUserNum: selectNum, responses: [] });
  const ownerMap = new Map<string, gql.platform.MocOwnership>();
  ownerships.map((snapshot) => {
    const wid = snapshot.user.toString();
    ownerMap.set(wid, snapshot);
  });
  this.responses = this.responses.map((response) => {
    const snapshot = ownerMap.get(response.user.toString()) ?? { user: response.user, num: 0 };
    const res: gql.platform.UserSurveyResponse = {
      ...response,
      user: snapshot.user,
      num: snapshot.num,
    };
    if (res.selection) {
      this.selectMocNum[res.selection] += this.mocNum;
      this.selectUserNum[res.selection] += 1;
    }
    this.mocNum += res.num;
    this.userNum += 1;
    return res;
  });
  Object.assign(this, { snapshot: ownerships, snapshotAt: new Date(), status: "closed" });
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
    const selectCount = this.selections?.length ?? 0;
    if (!selectCount) next();
    const selectNum = new Array(selectCount).fill(0);
    if (!this.selectMocNum?.length ?? 0 < selectCount) this.selectMocNum = selectNum;
    if (!this.selectUserNum?.length ?? 0 < selectCount) this.selectUserNum = selectNum;
    next();
  });
  return schema;
};
