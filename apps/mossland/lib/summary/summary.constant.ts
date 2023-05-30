import { AdvertiseSummary } from "../advertise/advertise.constant";
import { InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { MocSurveySummary } from "../mocSurvey/mocSurvey.constant";
import { MosslandUserSummary } from "../user/user.constant";
import { Schema } from "@nestjs/mongoose";
import { mixInputType, mixObjectType } from "@util/server";
import { cnst as shared } from "@shared/server";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {}

interface Base
  extends AdvertiseSummary,
    MocSurveySummary,
    // MocWalletSummary,
    // StakePoolSummary,
    MosslandUserSummary {}
export const childSummaries = [
  MocSurveySummary,
  // AdvertiseSummary,
  // MocWalletSummary,
  MosslandUserSummary,
  //
];
childSummaries.map((model) => mixObjectType(Base, model));

export type MosslandSummaryInput = Base;
export type MosslandSummary = Tail & Base;

// * 최종 생성 모델
export class SummaryInput {}
export interface SummaryInput extends shared.SummaryInput, InputOverwrite, Base {}
mixInputType(shared.SummaryInput, IntersectionType(InputOverwrite, Base, InputType));

export class Summary {}
export interface Summary extends shared.Summary, Base, Tail {}
mixObjectType(shared.Summary, IntersectionType(Base, Tail));

@Schema()
export class SummarySchema extends Tail {}
