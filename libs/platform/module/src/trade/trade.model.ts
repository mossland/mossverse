import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Query, Schema as Sch } from "mongoose";
import { dbConfig, Id } from "@shared/util-server";
import { TradeSchema, TradeInput } from "./trade.gql";
import * as gql from "../gql";
@Schema(dbConfig.defaultSchemaOptions)
class Trade extends TradeSchema {}
export const name = Trade.name;
export type Input = TradeInput;
export type Raw = Trade;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Omit<Raw, "id"> {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc, QryHelps, DocMtds>, MdlStats {}
export const schema: Sch<null, Mdl, DocMtds, QryHelps, null, MdlStats> = SchemaFactory.createForClass<Raw, Doc>(
  Trade
) as any;

/**
 * * 5. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 document method를 작성하세요.
 * ? 모델의 유틸리티를 위한 model statics를 작성하세요.
 * ? 모델의 유틸리티를 위한 query helpers를 작성하세요.
 */

// * 5. 1. Document Methods
interface DocMtds extends dbConfig.DefaultDocMtds<Doc> {
  makeExchange: (
    executedInputs: gql.ExchangeInput[],
    desiredOutputs: gql.ExchangeInput[],
    reverse: boolean
  ) => [gql.ExchangeInput[], gql.ExchangeInput[]];
}
schema.methods.makeExchange = function (
  this: Doc,
  executedInputs: gql.ExchangeInput[],
  desiredOutputs: gql.ExchangeInput[],
  reverse: boolean
) {
  if (reverse && !this.policy.includes("reversible")) throw new Error("This Trade is not Reversible");
  const [is, os] = !reverse ? [this.inputs, this.outputs] : [this.outputs, this.inputs];
  const multiple = Math.min(
    ...is.map(
      (input) =>
        (executedInputs.find((i) => i.thing?.equals(input.thing as Id) || i.token?.equals(input.token as Id))?.num ??
          0) / input.num
    )
  );
  const inputs: gql.ExchangeInput[] = is.map((input) => {
    const executed = executedInputs.find(
      (executed) => executed.thing?.equals(input.thing as Id) || executed.token?.equals(input.token as Id)
    );
    if (!executed) throw new Error("Insufficient Executed Inputs");
    return { ...executed, ...input, num: Math.floor(input.num * -multiple) };
  });
  const outputs: gql.ExchangeInput[] = os.map((output) => {
    const desired = desiredOutputs.find(
      (desired) => desired.thing?.equals(output.thing as Id) || desired.token?.equals(output.token as Id)
    );
    if (!desired) throw new Error("Insufficient Desired Outputs");
    return { ...desired, ...output, num: Math.floor(output.num * multiple), wallet: desired.wallet };
  });
  return [inputs, outputs];
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
