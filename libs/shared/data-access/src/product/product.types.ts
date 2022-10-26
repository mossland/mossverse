import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";

// export const typeOfProduct = ["owenr", "p2p", "shipping"] as const;
// export type TypeOfProduct = typeof typeOfProduct[number];

export type Product = {
  id: string;
  name: string;
  image: types.File;
  status: cnst.ProductStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductInput = {
  image: types.ID;
};

export const defaultProduct: Nullable<Product> = {
  id: null,
  name: null,
  image: null,
  status: null,
  createdAt: null,
  updatedAt: null,
  description: null,
};

export const purifyProduct = (network: Product): ProductInput => ({
  image: network.image.id,
});

export const productFragment = gql`
  ${types.fileFragment}
  fragment productFragment on Product {
    id
    name
    image {
      ...fileFragment
    }
    status
    createdAt
    updatedAt
  }
`;
