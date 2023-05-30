import { BaseField, Id, ObjectId, cnst } from "@util/server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { Staking, StakingSchema } from "../_mossland/staking.constant";
import { cnst as shared } from "@shared/server";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    enum: cnst.stakePoolTypes,
    index: true,
  })
  type: cnst.StakePoolType;

  @Field(() => shared.Thing)
  @Prop({ type: ObjectId, required: true, index: true })
  thing: Id;

  // @Field(() => String)
  // @Prop({ type: String })
  // url: string;

  // @Field(() => [Int])
  // @Prop([Number])
  // size: number[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  thing: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.stakePoolStatuses,
    required: true,
    default: "active",
  })
  status: cnst.StakePoolStatus;

  @Field(() => [Staking])
  @Prop([{ type: StakingSchema }])
  stakings: Staking[];

  @Field(() => Number)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalValue: number;
}

// * 최종 생성 모델
@InputType()
export class StakePoolInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class StakePool extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class StakePoolSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class StakePoolSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalStakePool: number;
}
