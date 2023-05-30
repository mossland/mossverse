import { BaseField, cnst } from "@util/server";
import { Field, Float, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, index: true, unique: true, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, index: true, enum: cnst.currencyTypes, required: true })
  type: cnst.CurrencyType;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.currencySymbols,
    unique: true,
    index: true,
    required: true,
  })
  symbol: cnst.CurrencySymbol;

  @Field(() => [String])
  @Prop([{ type: String, required: true }])
  services: string[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => Float)
  @Prop({ type: Number, required: true, default: 0 })
  usdRate: number;

  @Field(() => Float)
  @Prop({ type: Number, required: true, default: 0 })
  krwRate: number;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.currencyStatuses,
    required: true,
    default: "active",
  })
  status: cnst.CurrencyStatus;
}

// * 최종 생성 모델
@InputType()
export class CurrencyInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Currency extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class CurrencySchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class CurrencySummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalCurrency: number;
}
