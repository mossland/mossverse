import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { productGraphQL, Product, ProductInput } from "./product.gql";

const state = {
  ...createState(productGraphQL),
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(productGraphQL, { get, set }),
});
export const product = makeStore(productGraphQL.refName, state, actions);
