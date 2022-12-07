import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import {
  addFieldMetadata,
  Field,
  Float,
  ID,
  InputType,
  IntersectionType,
  ObjectType,
  PartialType,
  TypeMetadataStorage,
} from "@nestjs/graphql";
import * as gql from "../gql";
import { cnst } from "@shared/util";
import { v4 as uuidv4 } from "uuid";
import { ApiProperty } from "@nestjs/swagger";

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

  @Field(() => gql.shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true, index: true })
  @ApiProperty({ example: "630e2588121191ca4b2e3ea9", description: "ID of user" })
  from: Id;

  @Field(() => gql.shared.Wallet, { nullable: true })
  @Prop({ type: ObjectId, ref: "wallet", required: false, index: true })
  fromWallet?: Id;

  @Field(() => gql.shared.User, { nullable: true })
  @Prop({ type: ObjectId, ref: "user", required: false, index: true })
  to?: Id;

  @Field(() => gql.shared.Wallet, { nullable: true })
  @Prop({ type: ObjectId, ref: "wallet", required: false, index: true })
  toWallet?: Id;

  @Field(() => gql.Listing, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "listing", index: true })
  listing?: Id;

  @Field(() => gql.Trade, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "trade", index: true })
  trade?: Id;

  @Field(() => [gql.Exchange])
  @Prop([{ type: gql.ExchangeSchema, required: true }])
  inputs: gql.Exchange[];

  @Field(() => [gql.Exchange])
  @Prop([{ type: gql.ExchangeSchema, required: true }])
  @ApiProperty({ type: [gql.Exchange], description: "ID of user" })
  outputs: gql.Exchange[];

  @Field(() => gql.ShipInfo, { nullable: true })
  @Prop({ type: gql.ShipInfoSchema, required: false })
  shipInfo?: gql.ShipInfo;
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
  @Field(() => [gql.ExchangeInput])
  inputs: gql.ExchangeInput[];
  @Field(() => [gql.ExchangeInput])
  outputs: gql.ExchangeInput[];
  @Field(() => gql.ShipInfoInput, { nullable: true })
  shipInfo?: gql.ShipInfoInput;
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
