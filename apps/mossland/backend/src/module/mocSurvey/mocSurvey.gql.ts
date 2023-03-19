import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, Float, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { gql as platform } from "@platform/module";
import { gql as shared } from "@shared/module";
import { cnst } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  title: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  description?: string;

  @Field(() => [String])
  @Prop([{ type: String, required: true }])
  selections: string[];

  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true, index: true, immutable: true })
  creator: Id;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.surveyTypes, required: true, default: "objective", immutable: true })
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
  creator: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => Int)
  @Prop({ type: Number, required: true, default: 0 })
  userNum: number; // 몇개의 지갑이 참여했는지

  @Field(() => shared.Thing)
  @Prop({ type: ObjectId, ref: "thing", required: true, index: true, immutable: true })
  thing: Id;

  @Field(() => Float)
  @Prop({ type: Number, required: true, default: 0 })
  mocNum: number; // 몇개의 토큰이 참여했는지

  @Field(() => [Float])
  @Prop([{ type: Number, required: true, default: 0 }])
  selectMocNum: number[]; // 선택지별로 몇개의 토큰이 투표했는지 ( 예/아니오 [50,50] )

  @Field(() => [Float])
  @Prop([{ type: Number, required: true, default: 0 }])
  selectUserNum: number[]; // 선택지별로 몇개의 지갑이 투표했는지 ( 예/아니오 [50,50] )

  @Field(() => [platform.UserSurveyResponse], { nullable: true })
  @Prop([{ type: platform.UserSurveyResponseSchema }])
  responses: platform.UserSurveyResponse[];

  @Field(() => [platform.MocOwnership], { nullable: true }) //* 별도로 쿼리 진행
  @Prop({ type: [platform.MocOwnershipSchema], default: [], select: false })
  snapshot: platform.MocOwnership[];

  @Field(() => Date)
  @Prop({ type: Date, required: true, index: true, default: () => new Date() })
  snapshotAt: Date;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.surveyStatuses, required: true, default: "active" })
  status: cnst.SurveyStatus;
}

// * 최종 생성 모델
@InputType()
export class MocSurveyInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class MocSurvey extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class MocSurveySchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class MocSurveySummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalMocSurvey: number;
}
