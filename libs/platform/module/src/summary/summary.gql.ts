import { ShipInfoSummary } from "../shipInfo/shipInfo.gql";
import { RaffleSummary } from "../raffle/raffle.gql";
import { SnapshotSummary } from "../snapshot/snapshot.gql";
import { ListingSummary } from "../listing/listing.gql";
import { ReceiptSummary } from "../receipt/receipt.gql";
import { SurveySummary } from "../survey/survey.gql";
import { TradeSummary } from "../trade/trade.gql";
import { PlatformUserSummary } from "../user/user.gql";
import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, mixInputType, mixObjectType, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst } from "@shared/util";
import { gql as shared } from "@shared/module";

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
  extends ListingSummary,
    ReceiptSummary,
    SurveySummary,
    TradeSummary,
    //
    PlatformUserSummary,
    SnapshotSummary,
    RaffleSummary,
    ShipInfoSummary {}
export const childSummaries = [
  ShipInfoSummary,
  ListingSummary,
  ReceiptSummary,
  SurveySummary,
  TradeSummary,
  PlatformUserSummary,
  //
];
childSummaries.map((model) => mixObjectType(Base, model));

export type PlatformSummaryInput = Base;
export type PlatformSummary = Tail & Base;

// * 최종 생성 모델
export class SummaryInput {}
export interface SummaryInput extends shared.SummaryInput, InputOverwrite, Base {}
mixInputType(shared.SummaryInput, IntersectionType(InputOverwrite, Base, InputType));

export class Summary {}
export interface Summary extends shared.Summary, Base, Tail {}
mixObjectType(shared.Summary, IntersectionType(Base, Tail));

@Schema()
export class SummarySchema extends Tail {}
