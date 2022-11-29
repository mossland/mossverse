import * as gql from "../gql";
import {
  createActions,
  createChildActions,
  createChildState,
  createState,
  makeStore,
  SetGet,
} from "@shared/util-client";
import { tradeGraphQL, Trade, TradeInput } from "./trade.gql";

const state = {
  ...createState(tradeGraphQL),
  // ...createChildState("commentInActress" as const, gql.social.commentGraphQL),
  searchInTrade: "",
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(tradeGraphQL, { get, set }),
  // ...createChildActions("commentInActress" as const, gql.social.commentGraphQL, {
  //   get,
  //   set,
  // }),
});
export const trade = makeStore(tradeGraphQL.refName, state, actions);
