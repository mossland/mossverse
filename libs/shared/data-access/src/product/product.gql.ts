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

export const productGraphQL = createGraphQL<"product", Product, ProductInput>(Product, ProductInput);
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
  defaultProduct,
} = productGraphQL;
