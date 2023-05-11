import { StateCreator } from "zustand";
import * as gql from "../gql";
import {
  client,
  createActions,
  createState,
  DefaultActions,
  DefaultState,
  makeStore,
  SetGet,
} from "@shared/util-client";
import { userGraphQL, User, UserInput } from "./user.gql";
import { utils } from "..";

const state = {
  ...createState(userGraphQL),
  self: null as gql.User | null,
  myItem: null as gql.MyItem | null,
  myItems: [] as gql.MyItem[],
  balanceInMOC: 10,
  balanceInMMOC: 1000,
  tokens: [] as gql.shared.Token[],
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(userGraphQL, { get, set }),
  whoAmI: async () => {
    const self = await gql.whoAmI();
    const myItems = utils.getMyItems(self);
    set({ ...self, self, myItems });
  },
  initWithOtp: async () => {
    const url = new URL(window.location.href);
    const idx = url.search.indexOf("=");
    const otp = url.search.slice(idx + 1, url.search.length);
    if (!otp) return;
    const token = await gql.shared.signinWithOtp(otp);
    client.setToken(token);
    const self = await gql.whoAmI();
    const myItems = utils.getMyItems(self);
    set({ self, myItems });
  },
  filterMyItems: (listings: gql.Listing[]) => {
    const { self, myItems } = get();
    if (!self || !myItems) return;
    const myListing = listings.filter((listing) => listing.user.id === self.id);
    const filteredMyItems = myItems.filter((item) => {
      const rst = myListing.some(
        (listing) =>
          (item.thing && listing.thing && listing.thing.id === item.thing.id) ||
          (item.token && listing.token && listing.token.id === item.token.id)
      );
      return !rst;
    });
    set({ myItems: filteredMyItems });
  },
  openMyItem: async (myItem: gql.MyItem) => set({ myItem }),
});
export const user = makeStore(userGraphQL.refName, state, actions);
