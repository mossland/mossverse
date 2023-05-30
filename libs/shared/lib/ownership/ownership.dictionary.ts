import { Ownership, OwnershipSummary } from "./ownership.fetch";
import { Translate, baseTrans } from "@util/client";

export const ownershipTrans = {
  ...baseTrans,
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
} satisfies Translate<Ownership & OwnershipSummary>;
