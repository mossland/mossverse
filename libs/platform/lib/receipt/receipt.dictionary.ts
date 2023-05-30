import { Receipt, ReceiptSummary } from "./receipt.fetch";
import { Translate, baseTrans } from "@util/client";

export const receiptTrans = {
  ...baseTrans,
  name: ["Name", "이름"],
  from: ["From", "보낸이"],
  fromWallet: ["From Wallet", "보낸 지갑"],
  to: ["To", "받는이"],
  toWallet: ["To Wallet", "받는 지갑"],
  raffle: ["Raffle", "경품"],
  listing: ["Listing", "리스팅"],
  inputs: ["Inputs", "Inputs"],
  outputs: ["Outputs", "Outputs"],
  shipInfo: ["Ship Info", "배송 정보"],
  tags: ["Tags", "태그"],
  err: ["Error", "에러"],
  totalReceipt: ["Total Receipt", "총 영수증"],
} satisfies Translate<Receipt & ReceiptSummary>;
