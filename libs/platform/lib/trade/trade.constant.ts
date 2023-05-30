import { BaseField, Id, ObjectId, cnst } from "@util/server";
import { Exchange, ExchangeInput, ExchangeSchema } from "../_platform/exchange.constant";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => shared.User, { nullable: true })
  @Prop({ type: ObjectId, ref: "user", required: false, index: true })
  user?: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, index: true })
  description?: string;

  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Field(() => [Exchange])
  @Prop([{ type: ExchangeSchema, required: true }])
  inputs: Exchange[];

  @Field(() => [Exchange])
  @Prop([{ type: ExchangeSchema, required: true }])
  outputs: Exchange[];

  @Field(() => [String])
  @Prop([{ type: String, enum: cnst.tradePolicies, required: true }])
  policy: cnst.TradePolicy[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  user?: Id;
  @Field(() => [ExchangeInput])
  inputs: ExchangeInput[];

  @Field(() => [ExchangeInput])
  outputs: ExchangeInput[];
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.tradeStatuses,
    required: true,
    default: "active",
  })
  status: cnst.TradeStatus;
}

// * 최종 생성 모델
@InputType()
export class TradeInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Trade extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class TradeSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class TradeSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalTrade: number;
}
