import { Product, ProductSummary } from "./product.fetch";
import { Translate, baseTrans } from "@util/client";

export const productTrans = {
  ...baseTrans,
  name: ["Name", "이름"],
  description: ["Description", "설명"],
  image: ["Image", "이미지"],
  totalProduct: ["Total Product", "총 상품수"],
} satisfies Translate<Product & ProductSummary>;
