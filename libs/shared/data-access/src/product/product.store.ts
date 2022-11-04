import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { productGraphQL, Product, ProductInput } from "./product.gql";

type State = DefaultState<"product", gql.Product> & {
  //
};
const initialState: State = {
  ...createState<"product", gql.Product, gql.ProductInput>(productGraphQL),
};
type Actions = DefaultActions<"product", gql.Product, gql.ProductInput> & {
  //
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"product", gql.Product, gql.ProductInput>(productGraphQL, { get, set }),
}));
export const product = generateStore(store);
