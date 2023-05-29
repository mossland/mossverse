import { AdminSummary } from "../admin/admin.fetch";
import { ContractSummary } from "../contract/contract.fetch";
import { CurrencySummary } from "../currency/currency.fetch";
import { Dayjs } from "dayjs";
import { Field, ObjectType, cnst } from "@util/client";
import { FileSummary } from "../file/file.fetch";
import { KeyringSummary } from "../keyring/keyring.fetch";
import { NetworkSummary } from "../network/network.fetch";
import { NotificationSummary } from "../notification/notification.fetch";
import { OwnershipSummary } from "../ownership/ownership.fetch";
import { ProductSummary } from "../product/product.fetch";
import { ThingSummary } from "../thing/thing.fetch";
import { TokenSummary } from "../token/token.fetch";
import { WalletSummary } from "../wallet/wallet.fetch";

@ObjectType("DefaultSummary", { isAbstract: true })
export class DefaultSummary {
  @Field(() => String)
  type: cnst.PeriodType;
  @Field(() => Date)
  at: Dayjs;
  @Field(() => String)
  status: cnst.SummaryStatus;
}

export const summaries = [
  DefaultSummary,
  NotificationSummary,
  AdminSummary,
  ContractSummary,
  CurrencySummary,
  FileSummary,
  KeyringSummary,
  NetworkSummary,
  OwnershipSummary,
  ProductSummary,
  ThingSummary,
  TokenSummary,
  WalletSummary,
] as const;
export interface Summary
  extends DefaultSummary,
    AdminSummary,
    ContractSummary,
    CurrencySummary,
    FileSummary,
    KeyringSummary,
    NetworkSummary,
    OwnershipSummary,
    ProductSummary,
    ThingSummary,
    TokenSummary,
    WalletSummary,
    NotificationSummary {}
