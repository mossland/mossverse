import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Query, Schema as Sch } from "mongoose";
import { dbConfig, Id } from "@shared/util-server";
import { KeyringSchema, KeyringInput } from "./keyring.gql";
import * as bcrypt from "bcrypt";
import { SecurityOptions } from "../option";
import { Utils, cnst } from "@shared/util";

@Schema(dbConfig.defaultSchemaOptions)
class Keyring extends KeyringSchema {}
export const name = Keyring.name;
export type Input = KeyringInput;
export type Raw = Keyring;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Keyring
) as any;
schema.index({ accountId: "text", name: "text", phone: "text" });

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  isFor: (userId: Id) => boolean;
  has: (walletId: Id) => boolean;
  addWallet: (walletId: Id) => Doc;
  subWallet: (walletId: Id) => Doc;
  reset: () => Doc;
  applyIdPassword: (accountId: string, password: string) => Doc;
  applyIdWithSSO: (accountId: string, ssoType: cnst.SsoType) => Doc;
  applyPhoneCode: (phone: string, phoneCode: string) => Doc;
  getPhoneCodeAt: () => Date;
  applyPhoneVerification: (phone: string, phoneCode: string) => Doc;
  consumePhoneVerification: (phone: string, phoneCode: string) => Doc;
}
schema.methods.isFor = function (this: Doc, userId: Id) {
  return !!this.user?.equals(userId);
};
schema.methods.has = function (this: Doc, walletId: Id) {
  return this.wallets.some((_id) => _id.equals(walletId));
};
schema.methods.addWallet = function (this: Doc, walletId: Id) {
  this.wallets = this.wallets.filter((_id) => !_id.equals(walletId));
  this.wallets.push(walletId);
  if (!this.verifies.includes("wallet")) this.verifies.push("wallet");
  return this;
};
schema.methods.subWallet = function (this: Doc, walletId: Id) {
  this.wallets = this.wallets.filter((_id) => !_id.equals(walletId));
  if (!this.wallets.length && !this.accountId)
    throw new Error(`Cannot Empty All Wallets keyring(${this._id}), wallet(${walletId})}`);
  if (!this.wallets.length) this.verifies = this.verifies.filter((v) => v !== "wallet");
  return this;
};
schema.methods.reset = function (this: Doc) {
  this.merge({ wallets: [], holds: [], discord: {}, isOnline: false });
  return this;
};
schema.methods.applyIdPassword = function (this: Doc, accountId: string, password: string) {
  if (this.accountId && this.accountId !== accountId) throw new Error("Already Applied Id Password");
  return this.merge({ accountId, password, verifies: [...new Set([...this.verifies, "password" as const])] });
};

schema.methods.applyIdWithSSO = function (this: Doc, accountId: string, ssoType: cnst.SsoType) {
  if (this.accountId && this.accountId !== accountId) throw new Error("Can't Apply This Id");
  return this.merge({ accountId, verifies: [...new Set([...this.verifies, ssoType])] });
};
schema.methods.applyPhoneCode = function (this: Doc, phone: string, phoneCode: string) {
  if (!this.phone || this.phone !== phone) throw new Error("Invalid Phone Number");
  this.merge({
    phoneCode,
    phoneCodeAts: [...this.phoneCodeAts.filter((at) => at.getTime() > Utils.getLastMinutes(3).getTime()), new Date()],
  });
  if (this.phoneCodeAts.length > 3) throw new Error("Too Many Phone Code Attempts. Try Again Later.");
  return this;
};
schema.methods.getPhoneCodeAt = function (this: Doc) {
  return this.phoneCodeAts[this.phoneCodeAts.length - 1] ?? new Date(0);
};
schema.methods.applyPhoneVerification = function (this: Doc, phone: string, phoneCode: string) {
  if (this.phone !== phone || this.phoneCode !== phoneCode) throw new Error("Invalid Phone Code");
  if ((this.phoneCodeAts.at(-1)?.getTime() ?? 0) < Utils.getLastMinutes(3).getTime())
    throw new Error("Expired Phone Code");
  this.merge({
    phone,
    phoneCode,
    phoneCodeAts: [this.phoneCodeAts.at(-1) ?? new Date()],
    verifies: [...new Set([...this.verifies, "phone" as const])],
  });
  return this;
};
schema.methods.consumePhoneVerification = function (this: Doc, phone: string, phoneCode: string) {
  if (this.phone !== phone || this.phoneCode !== phoneCode) throw new Error("Invalid Phone Code");
  if (!(this.verifies.includes("phone") && this.getPhoneCodeAt().getTime() > Utils.getLastMinutes(3).getTime()))
    throw new Error("Invalid Phone Verification");
  return this.merge({ phoneCode: undefined, phoneCodeAts: [] });
};
// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  extinctWallet: (walletId: Id, keyringId: Id) => Promise<number>;
  generateWithWallet: (walletId: Id, keyringId: Id | null) => Promise<Doc>;
  extinctAccountId: (accountId: string, keyringId: Id) => Promise<number>;
  generateWithAccountId: (accountId: string, password: string, keyringId: Id | null) => Promise<Doc>;
  generateWithSSO: (accountId: string, ssoType: cnst.SsoType, keyringId?: Id) => Promise<Doc>;
  getKeyringWithSSO: (accountId: string, ssoType: cnst.SsoType) => Promise<Doc>;
  extinctPhone: (phone: string, keyringId: Id) => Promise<number>;
  generateWithPhone: (phone: string, keyringId: Id | null) => Promise<Doc>;
  getAuthorizedKeyring: (accountId: string, password: string) => Promise<Doc>;
}
schema.statics.extinctWallet = async function (this: Mdl, walletId: Id, keyringId: Id) {
  const { modifiedCount } = await this.updateMany(
    { _id: { $ne: keyringId }, wallets: walletId, status: { $ne: "inactive" } },
    { $pull: { wallets: walletId } }
  );
  return modifiedCount;
};
schema.statics.generateWithWallet = async function (this: Mdl, walletId: Id, keyringId: Id | null) {
  const keyring = keyringId
    ? await this.pickById(keyringId)
    : (await this.findOne({ wallets: walletId, status: { $ne: "inactive" } })) ?? new this();
  if (keyring.status !== "prepare") throw new Error("Already Activated Wallet");
  return await keyring.addWallet(walletId).save();
};
schema.statics.extinctAccountId = async function (this: Mdl, accountId: string, keyringId: Id) {
  const { modifiedCount } = await this.updateMany(
    { _id: { $ne: keyringId }, accountId, status: { $ne: "inactive" } },
    { $unset: { accountId: "" }, $pullAll: { verifies: ["password", ...cnst.ssoTypes] } }
  );
  return modifiedCount;
};
schema.statics.generateWithAccountId = async function (
  this: Mdl,
  accountId: string,
  password: string,
  keyringId: Id | null
) {
  const keyring = keyringId
    ? await this.pickById(keyringId)
    : (await this.findOne({ accountId, status: { $ne: "inactive" } })) ?? new this();
  if (keyring.status !== "prepare") throw new Error("Already Activated AccountId");
  return await keyring.applyIdPassword(accountId, password).save();
};
schema.statics.extinctPhone = async function (this: Mdl, phone: string, keyringId: Id) {
  const { modifiedCount } = await this.updateMany(
    { _id: { $ne: keyringId }, phone, status: { $ne: "inactive" } },
    { $unset: { phone: "", phoneCode: "" }, $set: { phoneCodeAts: [] }, $pull: { verifies: "phone" } }
  );
  return modifiedCount;
};
schema.statics.generateWithPhone = async function (this: Mdl, phone: string, keyringId: Id | null) {
  const keyring: Doc = keyringId
    ? await this.pickById(keyringId)
    : (await this.findOne({ phone, status: { $ne: "inactive" } })) ?? new this();
  if (keyring.status !== "prepare") throw new Error("Already Activated Phone");
  return await keyring.merge({ phone }).save();
};
schema.statics.getAuthorizedKeyring = async function (this: Mdl, accountId: string, password: string) {
  const account = await this.findOne({ accountId, status: "active" }).select({
    _id: true,
    role: true,
    password: true,
  });
  if (!account) throw new Error("Signin Failed");
  else if (!(await bcrypt.compare(password, account.password || ""))) throw new Error("Signin Failed");
  return await this.pickById(account._id);
};

schema.statics.generateWithSSO = async function (this: Mdl, accountId: string, ssoType: cnst.SsoType, keyringId?: Id) {
  const keyring = keyringId
    ? await this.pickById(keyringId)
    : (await this.findOne({ accountId, status: { $ne: "inactive" } })) ?? new this();
  if (keyring.status !== "prepare") throw new Error("Already Activated Phone");
  return keyring.applyIdWithSSO(accountId, ssoType).save();
};

schema.statics.getKeyringWithSSO = async function (this: Mdl, accountId: string, ssoType: cnst.SsoType) {
  const keyring: Doc | null = await this.findOne({ accountId, status: { $ne: "inactive" } });
  if (!keyring) throw new Error("Signin Failed(SSO Status Mismatch)");
  if (!keyring.verifies.includes(ssoType)) throw new Error("Signin Failed(SSO Not Registered)");
  return keyring;
};

// * 5. 3. Query Helper
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
    // if (this.status === "prepare")
    //   this.status = options.verifies.some((verifies) => verifies.every((verify) => this.verifies.includes(verify)))
    //     ? "active"
    //     : "prepare";
    this.password = encryptedPassword;
    next();
  });
  return schema;
};
