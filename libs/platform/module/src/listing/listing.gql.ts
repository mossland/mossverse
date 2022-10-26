import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";
import { cnst, Utils } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => gql.shared.User)
  @Prop({ type: ObjectId, required: true, ref: "user", immutable: true, index: true })
  user: Id;

  @Field(() => gql.shared.Wallet, { nullable: true })
  @Prop({ type: ObjectId, required: true, ref: "wallet", immutable: true, index: true })
  wallet?: Id;

  @Field(() => gql.shared.Token, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "token", immutable: true, index: true })
  token?: Id;

  @Field(() => gql.shared.Thing, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "thing", immutable: true, index: true })
  thing?: Id;

  @Field(() => gql.shared.Product, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "product", immutable: true, index: true })
  product?: Id;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false })
  limit?: number;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: () => Utils.getLastMonths(-3), index: true })
  closeAt: Date;

  @Field(() => [gql.PriceTag])
  @Prop([{ type: gql.PriceTagSchema, required: false }])
  priceTags: gql.PriceTag[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  user: Id;
  @Field(() => ID, { nullable: true })
  wallet?: Id;
  @Field(() => ID, { nullable: true })
  token?: Id;
  @Field(() => ID, { nullable: true })
  thing?: Id;
  @Field(() => ID, { nullable: true })
  product?: Id;
  @Field(() => [gql.PriceTagInput])
  priceTags: gql.PriceTagInput[];
  @Prop({ type: Date })
  closeAt: Date;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.listingStatuses, required: true, default: "active" })
  status: cnst.ListingStatus;
}

// * 최종 생성 모델
@InputType()
export class ListingInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Listing extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class ListingSchema extends Tail {}
