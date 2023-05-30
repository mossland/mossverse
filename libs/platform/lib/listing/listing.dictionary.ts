import { Listing, ListingSummary } from "./listing.fetch";
import { Translate, baseTrans } from "@util/client";

export const listingTrans = {
  ...baseTrans,
  user: ["User", "사용자"],
  type: ["Type", "유형"],
  wallet: ["Wallet", "지갑"],
  token: ["Token", "토큰"],
  thing: ["Thing", "Thing"],
  product: ["Product", "제품"],
  // limit: ["Limit", "한도"],
  closeAt: ["Close At", "종료일"],
  // priceTag: {
  //   price: ["Price", "가격"],
  //   discountPrice: ["Discount Price", "할인 가격"],
  // },
  priceTags: ["Price Tags", "가격 태그"],
  getName: ["Get Name", "Get Name"],
  getImage: ["Get Image", "Get Image"],
  getDescription: ["Get Description", "Get Description"],
  filterMyListing: ["Filter My Listing", "Filter My Listing"],
  sale: ["Sale", "매출"],
  sellingType: ["Selling Type", "판매 유형"],
  value: ["Value", "값"],
  tags: ["Tags", "태그"],
  totalListing: ["Total Listing", "총 목록"],
} satisfies Translate<Listing & ListingSummary>;
