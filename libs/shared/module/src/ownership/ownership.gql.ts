import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, Float, IntersectionType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { cnst } from "@shared/util";
import { Thing } from "../thing/thing.gql";
import { Token } from "../token/token.gql";
import { Product } from "../product/product.gql";
import { Currency } from "../currency/currency.gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, enum: cnst.ownershipTypes, index: true })
  type: cnst.OwnershipType;

  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  user?: Id;

  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  wallet?: Id;

  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  contract?: Id;

  @Field(() => Token, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  token?: Id;

  @Field(() => Thing, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  thing?: Id;

  @Field(() => Float)
  @Prop({ type: Number, required: true, min: 0, default: 1, index: true })
  value: number;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  token?: Id;
  @Field(() => ID, { nullable: true })
  thing?: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => Float)
  @Prop({ type: Number, required: true, min: 0, default: 0, index: true })
  reservedValue: number;

  @Field(() => Float)
  @Prop({ type: Number, required: true, default: 0, index: true })
  credit: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  bn: number;

  @Field(() => String)
  @Prop({ type: String, required: true, default: "item" })
  purpose: cnst.ThingPurpose;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.ownershipStatuses, required: true, default: "active" })
  status: cnst.OwnershipStatus;
}

// * 최종 생성 모델
@InputType()
export class OwnershipInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Ownership extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class OwnershipSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class OwnershipSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalOwnership: number;
}

// * 5. 실시간 업데이트를 위한 Subscription 모델
@ObjectType()
export class OwnershipUpdate extends PartialType(
  PickType(Ownership, ["id", "user", "value", "reservedValue"] as const)
) {}
