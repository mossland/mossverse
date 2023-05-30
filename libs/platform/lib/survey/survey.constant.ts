import { BaseField, Id, ObjectId, cnst } from "@util/server";
import { Field, Float, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { SurveyResponse, SurveyResponseSchema } from "../_platform/surveyResponse.constant";
import { cnst as shared } from "@shared/server";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  title: string;

  @Field(() => String)
  @Prop({ type: String, required: false })
  content?: string;

  @Field(() => [String])
  @Prop([{ type: String, required: true }])
  selections: string[];

  @Field(() => shared.Contract)
  @Prop({
    type: ObjectId,
    ref: "contract",
    required: true,
    index: true,
    immutable: true,
  })
  contract: Id;

  @Field(() => shared.Wallet)
  @Prop({
    type: ObjectId,
    ref: "wallet",
    required: true,
    index: true,
    immutable: true,
  })
  creator: Id;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.surveyTypes,
    required: true,
    default: "objective",
    immutable: true,
  })
  type: cnst.SurveyType;

  //realtime: 지금은 안쓰고, 나중에 실시간 투표 진행현황 새로고침 없이 subscribe
  //openvote: 어떤 지갑이 얼마나 투표했는지 보여줌
  //openprogress: 투표 close전에도 투표진행현황 가결과를 보여줌.
  @Field(() => [String])
  @Prop([{ type: String, enum: cnst.surveyPolicies, required: true }])
  policy: cnst.SurveyPolicy[];

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: new Date() })
  closeAt: Date;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: new Date() })
  openAt: Date;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  contract: Id;

  @Field(() => ID)
  creator: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => Int)
  @Prop({ type: Number, required: true, default: 0 })
  walletNum: number; // 몇개의 지갑이 참여했는지

  @Field(() => Float)
  @Prop({ type: Number, required: true, default: 0 })
  tokenNum: number; // 몇개의 토큰이 참여했는지

  @Field(() => [Float])
  @Prop([{ type: Number, required: true, default: 0 }])
  selectTokenNum: number[]; // 선택지별로 몇개의 토큰이 투표했는지 ( 예/아니오 [50,50] )

  @Field(() => [Float])
  @Prop([{ type: Number, required: true, default: 0 }])
  selectWalletNum: number[]; // 선택지별로 몇개의 지갑이 투표했는지 ( 예/아니오 [50,50] )

  @Field(() => [SurveyResponse], { nullable: true })
  @Prop([{ type: SurveyResponseSchema }])
  responses: SurveyResponse[];

  // @Field(() => [Ownership]) //* 별도로 쿼리 진행
  @Prop({ type: ObjectId, required: false })
  snapshot?: Id;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.surveyStatuses,
    required: true,
    default: "active",
  })
  status: cnst.SurveyStatus;
}

// * 최종 생성 모델
@InputType()
export class SurveyInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Survey extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class SurveySchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class SurveySummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalSurvey: number;
}
