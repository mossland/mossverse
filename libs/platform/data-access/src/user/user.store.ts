import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import * as utils from "../utils";
import { createSelectors, Nullable } from "@shared/util-client";
import { cnst, Utils } from "@shared/util";

type State = Nullable<types.User> & {
  self: types.User | null;
  user: types.User | null;
  myItem: types.MyItem | null;
  myItems: types.MyItem[];
  balanceInMOC: number;
  balanceInMMOC: number;
  tokens: types.shared.Token[];
  operation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...types.defaultUser,
  self: null,
  user: null,
  myItem: null,
  myItems: [],
  balanceInMOC: 10,
  balanceInMMOC: 1000,
  tokens: [],
  operation: "sleep",
};

type Action = {
  init: () => Promise<void>; // 초기화
  purify: () => types.UserInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: () => Promise<void>; // 제거
  reset: (user?: types.User) => void; // 수정필드 리셋
  initWithOtp: () => Promise<void>; // 초기화
  whoAmI: () => Promise<void>;
  filterMyItems: (listings: types.Listing[]) => void;
};

export const useUser = create<State & Action>((set, get) => ({
  ...initialState,
  init: async () => {
    console.log("asjkdhsakdhsdkfjsdhfkjsdh");
    const self = await gql.whoAmI();
    console.log("asjkdhsakdhsdkfjsdhfkjsdh");
    const myItems = utils.getMyItems(self);
    console.log("asjkdhsakdhsdkfjsdhfkjsdh");
    set({ self, myItems });
  },

  purify: () => {
    const state = get();
    try {
      const user = types.purifyUser(state as types.User);
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  create: async () => {
    const { purify, reset } = get();
    const userInput = purify();
    if (!userInput) return;
    const self = await gql.createUser(userInput);
    reset(self);
  },

  update: async () => {
    const { purify, id } = get();
    //! 예외처리 필요 ex) Alert
    if (!id) return;
    const userInput = purify();
    //! 예외처리 필요 ex) Alert
    if (!userInput) return;
    const self = await gql.updateUser(id, userInput);
    set({ ...self, self });
  },
  remove: async () => {
    const { purify, reset } = get();

    reset();
  },
  reset: (user?: types.User) => set({ ...types.defaultUser, user }),

  whoAmI: async () => {
    const self = await gql.whoAmI();
    set({ ...self, self });
  },

  initWithOtp: async () => {
    const url = new URL(window.location.href);
    const idx = url.search.indexOf("=");
    const otp = url.search.slice(idx + 1, url.search.length);
    if (!otp) return;
    const accessToken = await gql.shared.signinWithOtp(otp);
    gql.setToken(accessToken);
    const self = await gql.whoAmI();
    const myItems = utils.getMyItems(self);
    set({ self, myItems });
  },

  filterMyItems: (listings: types.Listing[]) => {
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

export const userStore = createSelectors(useUser);
