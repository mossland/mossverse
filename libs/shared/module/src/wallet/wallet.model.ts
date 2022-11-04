import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Query, Schema as Sch } from "mongoose";
import { dbConfig, Id } from "@shared/util-server";
import { WalletSchema, WalletInput } from "./wallet.gql";
import * as gql from "../gql";
@Schema(dbConfig.defaultSchemaOptions)
class Wallet extends WalletSchema {}
export const name = Wallet.name;
export type Input = WalletInput;
export type Raw = Wallet;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc, QryHelps, DocMtds>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Wallet
) as any;
/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  check: (address: string) => Doc;
  hasToken: (contractId: Id) => boolean;
  getOwnership: (contractId: Id) => { tokens: Id[]; tokenNum: number };
}
schema.methods.check = function (this: Doc, address: string) {
  if (this.address !== address)
    throw new Error(`Wallet(${this._id}) address is different - ${this.address} !== ${address}`);
  return this;
};
schema.methods.hasToken = function (this: Doc, contractId: Id) {
  const items = this.items.filter((item) => item.contract.equals(contractId));
  if (!items.length) return false;
  return true;
};
schema.methods.getOwnership = function (this: Doc, contractId: Id) {
  const items = this.items.filter((item) => item.contract.equals(contractId));
  return {
    tokens: items.map((item) => item.token),
    tokenNum: items.reduce((acc, item) => acc + item.num, 0),
  };
};
// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  generate: (networkId: Id, address: string) => Promise<Doc>;
  generateMany: (networkId: Id, addresses: string[]) => Promise<Doc[]>;
  incItem: (item: { contract: Id; token: Id }, walletId: Id, num: number, bn: number) => Promise<gql.TokenItem>;
  resetItems: (contract: Id) => Promise<number>;
  setItems: (contractId: Id, ownerships: gql.Ownership[]) => Promise<number>;
}
schema.statics.generate = async function (networkId: Id, address: string) {
  const doc =
    (await this.findOne({ network: networkId, address: address.toLowerCase(), status: "active" })) ??
    (await new this({ network: networkId, address }).save());
  return doc;
};
schema.statics.generateMany = async function (networkId: Id, addresses: string[]) {
  const operations = addresses
    .map((address) => address.toLowerCase())
    .map((address) => ({
      updateOne: {
        filter: { network: networkId, address },
        update: {
          $set: { network: networkId, address },
        },
        upsert: true,
      },
    }));
  await this.bulkWrite(operations);
  return await this.find({ network: networkId, address: { $in: addresses } });
};
schema.statics.incItem = async function ({ contract, token }, walletId, num, bn) {
  const wallet = await this.pickById(walletId);
  let item = wallet.items.find((item) => item.token.equals(token));
  if (!item && num <= 0) return null;
  else if (!item) {
    item = { contract, token, num, bn } as gql.TokenItemInput;
    await this.updateOne({ _id: walletId }, { $push: { items: item } });
  } else {
    Object.assign(item, { bn, num: Math.max(item.num + num, 0) });
    item.num <= 0
      ? await this.updateOne({ _id: walletId }, { $pull: { items: { token } } })
      : await this.updateOne(
          { _id: walletId, "items.token": token },
          { $set: { "items.$.num": item.num, "items.$.bn": item.bn } }
        );
  }
  return item;
};
schema.statics.resetItems = async function (contract: Id) {
  const { modifiedCount } = await this.updateMany({ "items.contract": contract }, { $pull: { items: { contract } } });
  return modifiedCount;
};
schema.statics.setItems = async function (contractId: Id, ownerships: gql.Ownership[]) {
  const operations = ownerships.map((ownership) => ({
    updateOne: {
      filter: { _id: ownership.wallet },
      update: {
        $pull: { token: ownership.token },
        $push: {
          items: {
            contract: contractId,
            bn: ownership.bn,
            token: ownership.token,
            num: ownership.num,
          } as gql.TokenItemInput,
        },
      },
    },
  }));
  const { nModified } = await this.bulkWrite(operations as any);
  return nModified;
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
    this.address = this.address.toLowerCase();
    next();
  });
  return schema;
};
