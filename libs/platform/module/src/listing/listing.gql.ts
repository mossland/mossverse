import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst, Utils } from "@shared/util";
import { gql as shared } from "@shared/module";
import { PriceTag, PriceTagInput, PriceTagSchema } from "../_scalar/priceTag.gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => shared.User)
  @Prop({ type: ObjectId, required: true, ref: "user", immutable: true, index: true })
  user: Id;

  @Field(() => shared.Wallet, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "wallet", immutable: true, index: true })
  wallet?: Id;

  @Field(() => String, { nullable: false })
  @Prop({ type: String, enum: cnst.sellingTypes, required: true, index: true, default: "limited" })
  sellingType: cnst.SellingType;

  @Field(() => String, { nullable: false })
  @Prop({ type: String, enum: cnst.listingTypes, required: true, index: true })
  type: cnst.ListingType;

  @Field(() => shared.Token, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "token", immutable: true, index: true })
  token?: Id;

  @Field(() => shared.Thing, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "thing", immutable: true, index: true })
  thing?: Id;

  @Field(() => shared.Product, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "product", immutable: true, index: true })
  product?: Id;

  @Field(() => Int, { nullable: false })
  @Prop({ type: Number, required: true, default: 0 })
  value?: number;

  @Field(() => [String])
  @Prop([{ type: String, required: true, index: true }])
  tags: string[];

  @Field(() => [PriceTag])
  @Prop([{ type: PriceTagSchema, required: false }])
  priceTags: PriceTag[];

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false, index: true })
  closeAt?: Date;
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
  @Field(() => [PriceTagInput])
  priceTags: PriceTagInput[];
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

  //매출량
  @Field(() => Int, { nullable: false })
  @Prop({ type: Number, required: true, default: 0 })
  sale: number;
}

// * 최종 생성 모델
@InputType()
export class ListingInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Listing extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class ListingSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class ListingSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalListing: number;
}
