import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore, setToken } from "@shared/util-client";
import { userGraphQL, User, UserInput } from "./user.gql";
import { utils } from "..";

type State = DefaultState<"user", gql.User> & {
  self: gql.User | null;
  myItem: gql.MyItem | null;
  myItems: gql.MyItem[];
  balanceInMOC: number;
  balanceInMMOC: number;
  tokens: gql.shared.Token[];
};
const initialState: State = {
  ...createState<"user", gql.User, gql.UserInput>(userGraphQL),
  self: null,
  myItem: null,
  myItems: [],
  balanceInMOC: 10,
  balanceInMMOC: 1000,
  tokens: [],
};
type Actions = DefaultActions<"user", gql.User, gql.UserInput> & {
  initWithOtp: () => Promise<void>; // 초기화
  whoAmI: () => Promise<void>;
  filterMyItems: (listings: gql.Listing[]) => void;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"user", gql.User, gql.UserInput>(userGraphQL, { get, set }),
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
    const accessToken = await gql.shared.signinWithOtp(otp);
    setToken(accessToken);
    localStorage.setItem("currentUser", accessToken);
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
}));
export const user = generateStore(store);
