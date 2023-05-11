import { NotificationSummary } from "../notification/notification.gql";
import { AdminSummary } from "../admin/admin.gql";
import { ContractSummary } from "../contract/contract.gql";
import { CurrencySummary } from "../currency/currency.gql";
import { FileSummary } from "../file/file.gql";
import { KeyringSummary } from "../keyring/keyring.gql";
import { NetworkSummary } from "../network/network.gql";
import { OwnershipSummary } from "../ownership/ownership.gql";
import { ProductSummary } from "../product/product.gql";
import { ThingSummary } from "../thing/thing.gql";
import { TokenSummary } from "../token/token.gql";
import { WalletSummary } from "../wallet/wallet.gql";

export const summaries = [
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
  extends AdminSummary,
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
