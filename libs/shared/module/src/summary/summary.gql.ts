import { NotificationSummary } from "../notification/notification.gql";
import { OwnershipSummary } from "../ownership/ownership.gql";
import { AdminSummary } from "../admin/admin.gql";
import { ContractSummary } from "../contract/contract.gql";
import { CurrencySummary } from "../currency/currency.gql";
import { FileSummary } from "../file/file.gql";
import { KeyringSummary } from "../keyring/keyring.gql";
import { NetworkSummary } from "../network/network.gql";
import { ProductSummary } from "../product/product.gql";
import { ThingSummary } from "../thing/thing.gql";
import { TokenSummary } from "../token/token.gql";
import { UserSummary } from "../user/user.gql";
import { WalletSummary } from "../wallet/wallet.gql";
import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, mixObjectType, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst } from "@shared/util";

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
  @Prop({ type: String, enum: cnst.periodTypes, default: "non-periodic", required: true, index: true })
  type: cnst.PeriodType;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: () => new Date(), index: true })
  at: Date;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.summaryStatuses, required: true, default: "archived" })
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
export class Summary extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class SummarySchema extends Tail {}
