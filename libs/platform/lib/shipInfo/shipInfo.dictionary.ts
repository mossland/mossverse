import { ShipInfo, ShipInfoSummary } from "./shipInfo.fetch";
import { Translate, baseTrans } from "@util/client";

export const shipInfoTrans = {
  ...baseTrans,
  name: ["Name", "이름"],
  phone: ["Phone", "전화번호"],
  address: ["Address", "주소"],
  user: ["User", "유저"],
  product: ["Product", "상품"],
  siteName: ["Site Name", "사이트 이름"],
  zipcode: ["Zipcode", "우편번호"],
  message: ["Message", "메세지"],
  totalShipInfo: ["Total ShipInfo", "총 배송 정보"],
} satisfies Translate<ShipInfo & ShipInfoSummary>;
