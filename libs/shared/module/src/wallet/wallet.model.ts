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
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Wallet
) as any;
schema.index({ address: "text" });

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  check: (address: string) => Doc;
}
schema.methods.check = function (this: Doc, address: string) {
  if (this.address !== address)
    throw new Error(`Wallet(${this._id}) address is different - ${this.address} !== ${address}`);
  return this;
};
// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  generate: (networkId: Id, address: string) => Promise<Doc>;
  generateMany: (networkId: Id, addresses: string[]) => Promise<Doc[]>;
}
schema.statics.generate = async function (networkId: Id, address: string) {
  const doc =
    (await this.findOne({ network: networkId, address: address.toLowerCase(), status: "active" })) ??
    (await new this({ network: networkId, address: address.toLowerCase() }).save());
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
    this.address = this.address.toLowerCase();
    next();
  });
  return schema;
};
