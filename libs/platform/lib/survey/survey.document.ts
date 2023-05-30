import * as Snapshot from "../snapshot/snapshot.document";
import * as cnst from "../cnst";
import { Document, Model, Query, Schema as Sch, Types } from "mongoose";
import { Id, dbConfig } from "@util/server";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { SurveyInput, SurveySchema } from "./survey.constant";
@Schema(dbConfig.defaultSchemaOptions)
class Survey extends SurveySchema {}
export const name = Survey.name;
export type Input = SurveyInput;
export type Raw = Survey;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Survey
) as any;
schema.index({ title: "text", content: "text" });

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  addResponse: (response: cnst.SurveyResponse) => Doc;
  removeResponse: (response: cnst.SurveyResponse) => Doc;
  close: (snapshot: Snapshot.Doc) => Doc;
}
schema.methods.addResponse = function (this: Doc, response: cnst.SurveyResponse) {
  const res = this.responses.find((res) => res.wallet.equals(response.wallet));
  if (res) this.removeResponse(res);
  this.responses.push(response);
  this.walletNum += 1;
  this.tokenNum += response.tokens.length;
  if (response.selection) {
    this.selectTokenNum[response.selection] += response.tokens.length;
    this.selectWalletNum[response.selection] += 1;
  }
  return this;
};
schema.methods.removeResponse = function (this: Doc, response: cnst.SurveyResponse) {
  this.responses = this.responses.filter((res) => !res.wallet.equals(response.wallet));
  this.walletNum -= 1;
  this.tokenNum -= response.tokens.length;
  if (response.selection) {
    this.selectTokenNum[response.selection] -= response.tokens.length;
    this.selectWalletNum[response.selection] -= 1;
  }
  return this;
};
schema.methods.close = function (this: Doc, snapshot: Snapshot.Doc) {
  const selectNum = new Array(this.selections.length).fill(0);
  this.merge({
    walletNum: 0,
    tokenNum: 0,
    selectTokenNum: selectNum,
    selectWalletNum: selectNum,
    responses: [],
  });
  const ownerMap = new Map<string, cnst.shared.Ownership[]>();
  snapshot.ownerships.map((ownership) => {
    const wid = ownership.wallet?.toString() ?? "";
    const ownerships = ownerMap.get(wid) ?? [];
    ownerMap.set(wid, [...ownerships, ownership]);
  });
  this.responses = this.responses.map((response) => {
    const ownerships = ownerMap.get(response.wallet.toString()) ?? [];
    const res: cnst.SurveyResponse = {
      ...response,
      tokenNum: ownerships.reduce((acc, ownership) => acc + ownership.value, 0),
      tokens: ownerships.map((ownership) => ownership.token as Id),
    };
    if (res.selection) {
      this.selectTokenNum[res.selection] += this.tokenNum;
      this.selectWalletNum[res.selection] += 1;
    }
    this.tokenNum += res.tokenNum;
    this.walletNum += 1;
    return res;
  });
  Object.assign(this, { snapshot: snapshot._id, status: "closed" });
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
    const selectCount = this.selections?.length ?? 0;
    if (!selectCount) next();
    const selectNum = new Array(selectCount).fill(0);
    if (!this.selectTokenNum?.length ?? 0 < selectCount) this.selectTokenNum = selectNum;
    if (!this.selectWalletNum?.length ?? 0 < selectCount) this.selectWalletNum = selectNum;
    next();
  });
  return schema;
};
