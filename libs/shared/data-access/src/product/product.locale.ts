import { Product, ProductSummary } from "./product.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const productLocale = {
  ...baseLocale,
  name: ["Name", "이름"],
  description: ["Description", "설명"],
  image: ["Image", "이미지"],
  totalProduct: ["Total Product", "총 상품수"],
} as const;

export type ProductLocale = Locale<"product", Product & ProductSummary, typeof productLocale>;
