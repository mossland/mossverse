import { ShipInfo, ShipInfoSummary } from "./shipInfo.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const shipInfoLocale = {
  ...baseLocale,
  name: ["Name", "이름"],
  phone: ["Phone", "전화번호"],
  address: ["Address", "주소"],
  user: ["User", "유저"],
  product: ["Product", "상품"],
  siteName: ["Site Name", "사이트 이름"],
  zipcode: ["Zipcode", "우편번호"],
  message: ["Message", "메세지"],
  totalShipInfo: ["Total ShipInfo", "총 배송 정보"],
} as const;

export type ShipInfoLocale = Locale<"shipInfo", ShipInfo & ShipInfoSummary, typeof shipInfoLocale>;
