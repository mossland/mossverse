import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  createFragment,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  PickType,
  Int,
} from "@shared/util-client";
import { File } from "../file/file.gql";

@InputType("ProductInput")
export class ProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => File)
  image: File;
}

@ObjectType("Product", { _id: "id" })
export class Product extends BaseGql(ProductInput) {
  @Field(() => String)
  status: cnst.ProductStatus;
}

@ObjectType("LightProduct", { _id: "id", gqlRef: "Product" })
export class LightProduct extends PickType(Product, ["name", "image", "description", "status"] as const) {}

@ObjectType("ProductSummary")
export class ProductSummary {
  @Field(() => Int)
  totalProduct: number;
}

export const productGraphQL = createGraphQL("product" as const, Product, ProductInput, LightProduct);
export const {
  getProduct,
  listProduct,
  productCount,
  productExists,
  createProduct,
  updateProduct,
  removeProduct,
  productFragment,
  purifyProduct,
  crystalizeProduct,
  lightCrystalizeProduct,
  defaultProduct,
  mergeProduct,
} = productGraphQL;
