import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, IntersectionType, ObjectType, Int } from "@nestjs/graphql";
import { cnst, Utils } from "@shared/util";
import { Entry, EntrySchema, PriceTag, PriceTagInput, PriceTagSchema } from "../_scalar";
import { Product, Thing, Token, User } from "@shared/module/gql";
import { EntryInput } from "../_scalar/entry.gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => [User])
  @Prop([{ type: ObjectId, ref: "user", index: true }])
  winners: Id[];

  @Field(() => String, { nullable: false })
  @Prop({ type: String, enum: cnst.raffleTypes, required: true, index: true })
  type: cnst.RaffleType;

  @Field(() => Token, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "token", immutable: true, index: true })
  token?: Id;

  @Field(() => Thing, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "thing", immutable: true, index: true })
  thing?: Id;

  @Field(() => Product, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "product", immutable: true, index: true })
  product?: Id;

  @Field(() => Int, { nullable: false })
  @Prop({ type: Number, required: true, default: 0 })
  entryLimit: number;

  @Field(() => Int, { nullable: false })
  @Prop({ type: Number, required: true, default: 0 })
  totalRaffleNum: number;

  @Field(() => [String])
  @Prop([{ type: String, required: true, index: true }])
  tags: string[];

  @Field(() => Date)
  @Prop({ type: Date, required: true, index: true })
  closeAt: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false, index: true })
  startAt?: Date;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: () => Utils.getLastMonths(-3), index: true })
  announceAt: Date;

  @Field(() => [PriceTag])
  @Prop([{ type: PriceTagSchema }])
  priceTags: PriceTag[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => [ID])
  winners?: Id[];
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
  @Prop({ type: String, enum: cnst.raffleStatuses, required: true, default: "active" })
  status: cnst.RaffleStatus;
  @Field(() => [Entry], { nullable: true })
  @Prop([{ type: EntrySchema }])
  entries: Entry[];
}

// * 최종 생성 모델
@InputType()
export class RaffleInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Raffle extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class RaffleSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
export class RaffleSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalRaffle: number;
}
