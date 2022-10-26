import { query, mutate } from "../apollo";
import gql from "graphql-tag";
import * as types from "../types";

export type CreateProductMutation = { createProduct: types.Product };
export const createProductMutation = gql`
  mutation createProduct($data: String!) {
    ${types.productFragment}
    createProduct(data: $data){
      ...productFragment
    }
  }
`;

export const createProduct = async (data: types.ProductInput) =>
  (await mutate<CreateProductMutation>(createProductMutation, { data })).createProduct;

export type ProductQuery = { product: types.Product };
export const productQuery = gql`
  ${types.productFragment}
  query product($productId: ID!) {
    product(productId: $productId) {
      ...productFragment
    }
  }
`;

export type UpdateProductMutation = { updateProduct: types.Product };
export const updateProductMutation = gql`
  ${types.productFragment}
  mutation updateProduct($productId: ID!, $data: ProductInput!) {
    updateProduct(productId: $productId, data: $data) {
      ...productFragment
    }
  }
`;
export const updateProduct = async (productId: string, data: types.ProductInput) =>
  (await mutate<UpdateProductMutation>(updateProductMutation, { productId, data })).updateProduct;

export const product = async (productId: string) => (await query<ProductQuery>(productQuery, { productId })).product;

export type ProductsQuery = { products: types.Product[] };
export const productsQuery = gql`
  ${types.productFragment}
  query products($query: JSON!, $limit: Int, $skip: Int) {
    products(limit: $limit, query: $query, skip: $skip) {
      ...productFragment
    }
  }
`;

export const products = async (qry: any, skip = 0, limit = 0) =>
  (await query<ProductsQuery>(productsQuery, { query: qry, skip, limit })).products;
