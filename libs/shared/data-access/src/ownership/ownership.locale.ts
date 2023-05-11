import { Ownership, OwnershipSummary } from "./ownership.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const ownershipLocale = {
  ...baseLocale,
  type: ["Type", "타입"],
  user: ["User", "유저"],
  wallet: ["Wallet", "지갑"],
  contract: ["Contract", "컨트랙트"],
  token: ["Token", "토큰"],
  thing: ["Thing", "Thing"],
  value: ["Value", "값"],
  reservedValue: ["ReservedValue", "ReservedValue"],
  credit: ["Credit", "Credit"],
  bn: ["Bn", "Bn"],
  has: ["Has", "Has"],
  getName: ["GetOwnershipName", "GetOwnershipName"],
  getImageUrl: ["GetOwnershipImage", "GetOwnershipImage"],
  isRemain: ["IsRemain", "IsRemain"],
  totalOwnership: ["Total Ownership", "총 소유권수"],
  purpose: ["Purpose", "목적"],
} as const;

export type OwnershipLocale = Locale<"ownership", Ownership & OwnershipSummary, typeof ownershipLocale>;
