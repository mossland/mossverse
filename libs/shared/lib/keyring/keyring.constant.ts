import { BaseField, Id, ObjectId, cnst, validate } from "@util/server";
import { Contract } from "../contract/contract.constant";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { JSON } from "../_shared/shared.constant";
import { Schema as MongoSchema } from "mongoose";
import { Prop, Schema } from "@nestjs/mongoose";
import { Wallet } from "../wallet/wallet.constant";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, index: true })
  name?: string;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  user?: Id;

  @Field(() => [Wallet])
  @Prop([{ type: ObjectId, ref: "wallet", required: true }])
  wallets: Id[];

  @Field(() => [Contract])
  @Prop([{ type: ObjectId, ref: "contract", required: true }])
  holds: Id[];

  @Field(() => JSON)
  @Prop({ type: MongoSchema.Types.Mixed, default: {} })
  discord: Record<string, any>;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    required: false,
    // validate: validate.email,
    index: true,
  })
  accountId?: string;

  // Only Backend
  @Prop({ type: String, required: false, select: false, index: true })
  password?: string;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    required: false,
    validate: validate.phone,
    index: true,
  })
  phone?: string;

  // Only Backend
  @Prop({ type: String, required: false })
  phoneCode?: string;

  @Field(() => [Date])
  @Prop([{ type: Date, required: true }])
  phoneCodeAts: Date[];

  @Field(() => [String])
  @Prop([{ type: String, enum: cnst.verifies, required: true, index: true }])
  verifies: cnst.Verify[];

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: true, required: true, index: true })
  isOnline: boolean;

  @Field(() => Date)
  @Prop({ type: Date, default: () => new Date(), required: true, index: true })
  lastLoginAt: Date;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.keyringStatuses,
    required: true,
    default: "prepare",
  })
  status: cnst.KeyringStatus;
}

// * 최종 생성 모델
@InputType()
export class KeyringInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Keyring extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class KeyringSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class KeyringSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalKeyring: number;
}
