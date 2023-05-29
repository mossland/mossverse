import * as cnst from "../cnst";
import { Document, Model, Query, Schema as Sch, Types } from "mongoose";
import { Id, dbConfig } from "@util/server";
import { ListingInput, ListingSchema } from "./listing.constant";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema(dbConfig.defaultSchemaOptions)
class Listing extends ListingSchema {}
export const name = Listing.name;
export type Input = ListingInput;
export type Raw = Listing;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Listing
) as any;

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  isPurchaseWith: (type: "thing" | "token", tag: cnst.PriceTagInput) => boolean;
  isPurchaseable: () => boolean;
}
schema.methods.isPurchaseWith = function (this: Doc, type: "thing" | "token", tag: cnst.PriceTagInput) {
  return !!(
    tag[type] &&
    this.priceTags.find((priceTag) => priceTag[type]?.equals(tag[type] as Id) && priceTag.price === tag.price)
  );
};
schema.methods.isPurchaseable = function (this: Doc) {
  if (this.status !== "active" || (this.closeAt && this.closeAt.getTime() < Date.now())) return false;
  return true;
};
// * 5. 2. Model Statics
interface MdlStats extends dbConfig.DefaultMdlStats<Doc, Raw> {
  isDuplicated: (data: Input) => Promise<boolean>;
}
schema.statics.isDuplicated = async function (data: Input) {
  return await this.exists({
    user: data.user,
    wallet: data.wallet,
    token: data.token,
    thing: data.thing,
    product: data.product,
    status: "active",
  });
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
    // if (!this.type) this.type = this.thing ? "thing" : this.token ? "token" : this.product ? "product" : undefined;
    // if (!this.type) throw new Error("Unknown Listing Type");
    next();
  });
  return schema;
};
