import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst } from "@shared/util";
import { v4 as uuidv4 } from "uuid";
import { ApiProperty } from "@nestjs/swagger";
import { gql as shared } from "@shared/module";
import { Listing } from "../listing/listing.gql";
import { Trade } from "../trade/trade.gql";
import { Raffle } from "../raffle/raffle.gql";
import { Exchange, ExchangeInput, ExchangeSchema } from "../_scalar/exchange.gql";
// import { ShipInfo, ShipInfoInput, ShipInfoSchema } from "../_scalar/scalar.gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true, enum: cnst.receiptTypes, index: true })
  type: cnst.ReceiptType;

  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true, index: true })
  @ApiProperty({ example: "630e2588121191ca4b2e3ea9", description: "ID of user" })
  from: Id;

  @Field(() => shared.Wallet, { nullable: true })
  @Prop({ type: ObjectId, ref: "wallet", required: false, index: true })
  fromWallet?: Id;

  @Field(() => shared.User, { nullable: true })
  @Prop({ type: ObjectId, ref: "user", required: false, index: true })
  to?: Id;

  @Field(() => shared.Wallet, { nullable: true })
  @Prop({ type: ObjectId, ref: "wallet", required: false, index: true })
  toWallet?: Id;

  @Field(() => Listing, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "listing", index: true })
  listing?: Id;

  @Field(() => Raffle, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "raffle", index: true })
  raffle?: Id;

  @Field(() => Trade, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "trade", index: true })
  trade?: Id;

  @Field(() => [Exchange])
  @Prop([{ type: ExchangeSchema, required: true }])
  inputs: Exchange[];

  @Field(() => [Exchange])
  @Prop([{ type: ExchangeSchema, required: true }])
  @ApiProperty({ type: [Exchange], description: "ID of user" })
  outputs: Exchange[];

  // @Field(() => ShipInfo, { nullable: true })
  // @Prop({ type: ShipInfoSchema, required: false })
  // shipInfo?: ShipInfo;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  from: Id;
  @Field(() => ID, { nullable: true })
  fromWallet?: Id;
  @Field(() => ID, { nullable: true })
  to?: Id;
  @Field(() => ID, { nullable: true })
  toWallet?: Id;
  @Field(() => ID, { nullable: true })
  listing?: Id;
  @Field(() => ID, { nullable: true })
  trade?: Id;
  @Field(() => ID, { nullable: true })
  raffle?: Id;
  @Field(() => [ExchangeInput])
  inputs: ExchangeInput[];
  @Field(() => [ExchangeInput])
  outputs: ExchangeInput[];
  // @Field(() => ShipInfoInput, { nullable: true })
  // shipInfo?: ShipInfoInput;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => [String])
  @Prop([{ type: String, required: true, index: true }])
  tags: string[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  err?: string;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.receiptStatuses, required: true, default: "active" })
  status: cnst.ReceiptStatus;
}

// * 최종 생성 모델
@InputType()
export class ReceiptInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Receipt extends BaseGql(Tail) {}
@Schema()
export class ReceiptSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class ReceiptSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalReceipt: number;
}
