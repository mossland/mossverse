import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst, Utils } from "@shared/util";
import { gql as platform } from "@platform/module";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => Date)
  @Prop({ type: Date, required: true, default: () => Utils.getLastMonths(-3), index: true })
  closeAt: Date;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: new Date(), index: true })
  openAt: Date;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, required: true, enum: cnst.advertiseStatuses, default: "active" })
  status: string;

  @Field(() => [platform.Bid])
  @Prop([{ type: platform.BidSchema }])
  bids: platform.Bid[];
}

// * 최종 생성 모델
@InputType()
export class AdvertiseInput extends IntersectionType(InputOverwrite, Base, InputType) {}

@ObjectType()
export class Advertise extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class AdvertiseSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class AdvertiseSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalAdvertise: number;
}
