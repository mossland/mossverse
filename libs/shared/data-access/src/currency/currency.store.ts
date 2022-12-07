import * as gql from "../gql";
import {
  createActions,
  createChildActions,
  createChildState,
  createState,
  makeStore,
  SetGet,
} from "@shared/util-client";
import { currencyGraphQL, Currency, CurrencyInput } from "./currency.gql";

const state = {
  ...createState(currencyGraphQL),
  // ...createChildState("commentInActress" as const, gql.social.commentGraphQL),
  searchInCurrency: "",
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(currencyGraphQL, { get, set }),
  // ...createChildActions("commentInActress" as const, gql.social.commentGraphQL, {
  //   get,
  //   set,
  // }),
});
export const currency = makeStore(currencyGraphQL.refName, state, actions);
