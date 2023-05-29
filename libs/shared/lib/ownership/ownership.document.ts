import { Document, Model, Query, Schema as Sch, Types } from "mongoose";
import { Id, dbConfig } from "@util/server";
import { OwnershipInput, OwnershipSchema } from "./ownership.constant";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import type * as doc from "../doc";

@Schema(dbConfig.defaultSchemaOptions)
class Ownership extends OwnershipSchema {}
export const name = Ownership.name;
export type Input = OwnershipInput;
export type Raw = Ownership;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Ownership
) as any;

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  add: (value?: number) => Doc;
  sub: (value?: number) => Doc;
  reserve: (value?: number) => Doc;
  addCredit: (value?: number) => Doc;
  release: (value?: number) => Doc;
}
schema.methods.add = function (this: Doc, value = 1) {
  this.value += value;
  console.log(this, value);
  if (this.value < 0) throw new Error("Not enough value");
  return this;
};
schema.methods.sub = function (this: Doc, value = 1) {
  this.value -= value;
  if (this.value < 0) throw new Error("Not enough value");
  return this;
};
schema.methods.reserve = function (this: Doc, value = 1) {
  this.sub(value);
  this.reservedValue += value;
  if (this.reservedValue < 0) throw new Error("Not enough reservedValue");
  return this;
};
schema.methods.addCredit = function (this: Doc, value = 1) {
  this.credit += value;
  return this;
};
schema.methods.release = function (this: Doc, value = 1) {
  this.add(value);
  this.reservedValue -= value;
  if (this.reservedValue < 0) throw new Error("Not enough reservedValue");
  return this;
};

export type ThingInput = { user: Id; thing: doc.Thing.Doc; value: number };
export type TokenInput = {
  user?: Id;
  wallet?: Id;
  token: doc.Token.Doc;
  value: number;
};

// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  browseThing: (data: ThingInput) => Promise<Doc>;
  setThingValues: (inputs: ThingInput[], bn?: number) => Promise<Doc[]>;
  updateThingValue: (input: ThingInput, bn?: number) => Promise<Doc>;
  updateThingValues: (inputs: ThingInput[], bn?: number) => Promise<Doc[]>;
  reserveThingValues: (inputs: ThingInput[]) => Promise<Doc[]>;
  releaseThingValues: (inputs: ThingInput[]) => Promise<Doc[]>;
  creditThingValues: (inputs: ThingInput[]) => Promise<Doc[]>;
  browseToken: (data: TokenInput) => Promise<Doc>;
  setTokenValues: (inputs: TokenInput[], bn?: number) => Promise<Doc[]>;
  updateTokenValue: (input: TokenInput, bn?: number) => Promise<Doc>;
  updateTokenValues: (inputs: TokenInput[], bn?: number) => Promise<Doc[]>;
  reserveTokenValues: (inputs: TokenInput[]) => Promise<Doc[]>;
  releaseTokenValues: (inputs: TokenInput[]) => Promise<Doc[]>;
  creditTokenValues: (inputs: TokenInput[]) => Promise<Doc[]>;
  removeByUser: (userId: Id) => Promise<boolean>;
  resetByContract: (contractId: Id, ninIds?: Id[]) => Promise<boolean>;
  resetByThing: (thingId: Id, ninIds?: Id[]) => Promise<boolean>;
  removeByContract: (contractId: Id) => Promise<boolean>;
  transferByWallet: (walletId: Id, userId: Id | null) => Promise<boolean>;
  transferThing: (thing: doc.Thing.Doc, from: Id, to: Id, value: number) => Promise<Doc[]>;
  transferToken: (token: doc.Token.Doc, from: Id, to: Id, value: number, bn?: number) => Promise<Doc[]>;
}
schema.statics.browseThing = async function (this: Mdl, data: ThingInput) {
  const query = {
    user: data.user,
    type: "thing",
    thing: data.thing._id,
    status: "active",
  };
  return (await this.findOne(query)) ?? new this({ ...query, value: 0, purpose: data.thing.purpose });
};
schema.statics.setThingValues = async function (this: Mdl, inputs: ThingInput[], bn = 0) {
  const ownerships = await Promise.all(
    inputs.map(async (input) => (await this.browseThing(input)).merge({ value: input.value }))
  );
  if (bn && ownerships.some((ownership) => ownership.bn > bn)) throw new Error("Already Processed Block");
  return await Promise.all(ownerships.map(async (ownership) => await ownership.merge({ bn }).save()));
};
schema.statics.updateThingValue = async function (this: Mdl, input: ThingInput, bn = 0) {
  const ownership = await (await this.browseThing(input)).add(input.value);
  if (bn && ownership.bn > bn) throw new Error("Already Processed Block");
  return await ownership.merge({ bn }).save();
};
schema.statics.updateThingValues = async function (this: Mdl, inputs: ThingInput[], bn = 0) {
  return await Promise.all(inputs.map(async (input) => await this.updateThingValue(input, bn)));
};
schema.statics.reserveThingValues = async function (this: Mdl, inputs: ThingInput[]) {
  const ownerships = await Promise.all(
    inputs.map(async (input) => (await this.browseThing(input)).reserve(input.value))
  );
  return await Promise.all(ownerships.map(async (ownership) => await ownership.save()));
};
schema.statics.releaseThingValues = async function (this: Mdl, inputs: ThingInput[]) {
  const ownerships = await Promise.all(
    inputs.map(async (input) => (await this.browseThing(input)).release(input.value))
  );
  return await Promise.all(ownerships.map(async (ownership) => await ownership.save()));
};
schema.statics.creditThingValues = async function (this: Mdl, inputs: ThingInput[]) {
  const ownerships = await Promise.all(
    inputs.map(async (input) => (await this.browseThing(input)).addCredit(input.value))
  );
  return await Promise.all(ownerships.map(async (ownership) => await ownership.save()));
};

schema.statics.browseToken = async function (this: Mdl, data: TokenInput) {
  const query = {
    wallet: data.wallet,
    type: "token",
    token: data.token._id,
    status: "active",
  };
  return (await this.findOne(query)) ?? new this({ ...query, value: 0 });
};
schema.statics.setTokenValues = async function (this: Mdl, inputs: TokenInput[], bn = 0) {
  const ownerships = await Promise.all(
    inputs.map(async (input) => (await this.browseToken(input)).merge({ value: input.value }))
  );
  if (bn && ownerships.some((ownership) => ownership.bn > bn)) throw new Error("Already Processed Block");
  return await Promise.all(ownerships.map(async (ownership) => await ownership.merge({ bn }).save()));
};
schema.statics.updateTokenValue = async function (this: Mdl, input: TokenInput, bn = 0) {
  const ownership = await (await this.browseToken(input)).add(input.value);
  if (bn && ownership.bn > bn) throw new Error("Already Processed Block");
  return await ownership.merge({ bn }).save();
};
schema.statics.updateTokenValues = async function (this: Mdl, inputs: TokenInput[], bn = 0) {
  return await Promise.all(inputs.map(async (input) => await this.updateTokenValue(input, bn)));
};
schema.statics.reserveTokenValues = async function (this: Mdl, inputs: TokenInput[]) {
  const ownerships = await Promise.all(
    inputs.map(async (input) => (await this.browseToken(input)).reserve(input.value))
  );
  return await Promise.all(ownerships.map(async (ownership) => await ownership.save()));
};
schema.statics.releaseTokenValues = async function (this: Mdl, inputs: TokenInput[]) {
  const ownerships = await Promise.all(
    inputs.map(async (input) => (await this.browseToken(input)).release(input.value))
  );
  return await Promise.all(ownerships.map(async (ownership) => await ownership.save()));
};
schema.statics.creditTokenValues = async function (this: Mdl, inputs: TokenInput[]) {
  const ownerships = await Promise.all(
    inputs.map(async (input) => (await this.browseToken(input)).addCredit(input.value))
  );
  return await Promise.all(ownerships.map(async (ownership) => await ownership.save()));
};

schema.statics.removeByUser = async function (this: Mdl, userId: Id) {
  await this.updateMany({ user: userId, wallet: { $exists: false } }, { $set: { status: "inactive" } });
  await this.updateMany({ user: userId, wallet: { $exists: true } }, { $set: { user: null } });
  return true;
};
schema.statics.resetByContract = async function (this: Mdl, contractId: Id, ninIds: Id[] = []) {
  const { modifiedCount } = await this.updateMany(
    { contract: contractId, _id: { $nin: ninIds } },
    { $set: { value: 0 } }
  );
  return !!modifiedCount;
};
schema.statics.resetByThing = async function (this: Mdl, thingId: Id, ninIds: Id[] = []) {
  const { modifiedCount } = await this.updateMany({ thing: thingId, _id: { $nin: ninIds } }, { $set: { value: 0 } });
  return !!modifiedCount;
};
schema.statics.removeByContract = async function (this: Mdl, contractId: Id) {
  const { modifiedCount } = await this.updateMany({ contract: contractId }, { $set: { status: "inactive" } });
  return !!modifiedCount;
};
schema.statics.transferByWallet = async function (this: Mdl, walletId: Id, userId: Id | null) {
  const { modifiedCount } = await this.updateMany({ wallet: walletId }, { $set: { user: userId } });
  return !!modifiedCount;
};
schema.statics.transferThing = async function (this: Mdl, thing: doc.Thing.Doc, from: Id, to: Id, value: number) {
  return await this.updateThingValues([
    { thing, user: from, value: -value },
    { thing, user: to, value },
  ]);
};
schema.statics.transferToken = async function (
  this: Mdl,
  token: doc.Token.Doc,
  from: Id,
  to: Id,
  value: number,
  bn?: number
) {
  return await this.updateTokenValues(
    [
      { token, wallet: from, value: -value },
      { token, wallet: to, value },
    ],
    bn
  );
};

// * 5. 3. Model Statics
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
