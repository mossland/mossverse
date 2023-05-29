import { AdminSummary } from "../admin/admin.constant";
import { BaseField, cnst, mixObjectType } from "@util/server";
import { ContractSummary } from "../contract/contract.constant";
import { CurrencySummary } from "../currency/currency.constant";
import { Field, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { FileSummary } from "../file/file.constant";
import { KeyringSummary } from "../keyring/keyring.constant";
import { NetworkSummary } from "../network/network.constant";
import { NotificationSummary } from "../notification/notification.constant";
import { OwnershipSummary } from "../ownership/ownership.constant";
import { ProductSummary } from "../product/product.constant";
import { Prop, Schema } from "@nestjs/mongoose";
import { ThingSummary } from "../thing/thing.constant";
import { TokenSummary } from "../token/token.constant";
import { UserSummary } from "../user/user.constant";
import { WalletSummary } from "../wallet/wallet.constant";

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
class Tail extends Base {
  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.periodTypes,
    default: "non-periodic",
    required: true,
    index: true,
  })
  type: cnst.PeriodType;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: () => new Date(), index: true })
  at: Date;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.summaryStatuses,
    required: true,
    default: "archived",
  })
  status: cnst.SummaryStatus;
}

interface Base
  extends AdminSummary,
    ContractSummary,
    CurrencySummary,
    FileSummary,
    KeyringSummary,
    NetworkSummary,
    ProductSummary,
    ThingSummary,
    TokenSummary,
    UserSummary,
    WalletSummary,
    OwnershipSummary,
    NotificationSummary {}
export const childSummaries = [
  NotificationSummary,
  AdminSummary,
  ContractSummary,
  CurrencySummary,
  FileSummary,
  KeyringSummary,
  NetworkSummary,
  ProductSummary,
  ThingSummary,
  TokenSummary,
  UserSummary,
  WalletSummary,
  OwnershipSummary,
];
childSummaries.map((model) => mixObjectType(Base, model));

// * 최종 생성 모델
@InputType()
export class SummaryInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Summary extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class SummarySchema extends Tail {}
