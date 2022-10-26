import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Query, Schema as Sch } from "mongoose";
import { dbConfig, Id } from "@shared/util-server";
import { KeyringSchema, KeyringInput } from "./keyring.gql";
@Schema(dbConfig.defaultSchemaOptions)
class Keyring extends KeyringSchema {}
export const name = Keyring.name;
export type Input = KeyringInput;
export type Raw = Keyring;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc, QryHelps, DocMtds>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Keyring
) as any;

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  has: (walletId: Id) => boolean;
  addWallet: (walletId: Id) => Doc;
  removeWallet: (walletId: Id) => Doc;
  isOtpExpired: () => boolean;
}
schema.methods.has = function (this: Doc, walletId: Id) {
  return this.wallets.some((_id) => _id.equals(walletId));
};
schema.methods.isOtpExpired = function (this: Doc) {
  return this.otpExpireAt ? this.otpExpireAt.getTime() < new Date().getTime() : false;
};
schema.methods.addWallet = function (this: Doc, walletId: Id) {
  this.wallets = this.wallets.filter((_id) => !_id.equals(walletId));
  this.wallets.push(walletId);
  return this;
};
schema.methods.removeWallet = function (this: Doc, walletId: Id) {
  this.wallets = this.wallets.filter((_id) => !_id.equals(walletId));
  if (!this.wallets.length) throw new Error(`Cannot Empty All Wallets keyring(${this._id}), wallet(${walletId})}`);
  return this;
};
// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  findWithAddress: (address: string) => Promise<Doc>;
  extinctWallet: (walletId: Id) => Promise<number>;
}
schema.statics.findWithAddress = async function (address: string) {
  const doc = await this.findOne({ status: "active", address: address.toLowerCase() });
  if (!doc) throw new Error("No Address Keyring");
  return doc;
};
schema.statics.extinctWallet = async function (walletId: Id) {
  const { modifiedCount } = await this.updateMany({ wallets: walletId }, { $pull: { wallets: walletId } });
  return modifiedCount;
};

// * 5. 3. Query Helper
interface QryHelps extends dbConfig.DefaultQryHelps<Doc, QryHelps> {
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
