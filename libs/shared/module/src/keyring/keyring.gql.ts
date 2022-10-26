import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Schema as MongoSchema } from "mongoose";
import * as gql from "../gql";
import { cnst } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, required: false })
  prevUser?: Id;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => [gql.Wallet])
  @Prop([{ type: ObjectId, ref: "wallet", required: true }])
  wallets: Id[];

  @Field(() => [gql.Contract])
  @Prop([{ type: ObjectId, ref: "contract", required: true }])
  holds: Id[];

  @Field(() => gql.JSON)
  @Prop({ type: MongoSchema.Types.Mixed, default: {} })
  discord: Record<string, any>;

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: true, required: true, index: true })
  isOnline: boolean;

  @Field(() => Date)
  @Prop({ type: Date, default: () => new Date(), required: true, index: true })
  lastLoginAt: Date;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.keyringStatuses, required: true, default: "active" })
  status: cnst.KeyringStatus;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, require: false, select: false })
  otp?: string;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, require: false, select: false })
  otpExpireAt?: Date;
}

// * 최종 생성 모델
@InputType()
export class KeyringInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Keyring extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class KeyringSchema extends Tail {}
