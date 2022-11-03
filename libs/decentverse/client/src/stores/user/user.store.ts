import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import * as utils from "../utils";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

type State = Nullable<types.User> & {
  self: types.User | null;
  user: types.User | null;
  myItems: types.MyItem[];
  myItem: types.MyItem | null;
  isInventoryOpen: boolean;
  selectedItemIndex: number | null;
  // character: types.Character | null;
  isPossibleEdit: boolean;
  isProfileNameEdit: boolean;
  isShowVideoAudioSetting: boolean;
  operation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...types.defaultUser,
  self: null,
  user: null,
  myItems: [],
  myItem: null,
  isInventoryOpen: false,
  selectedItemIndex: null,
  // character: null,
  isPossibleEdit: false,
  isProfileNameEdit: false,
  isShowVideoAudioSetting: false,
  operation: "sleep",
};

type Action = {
  init: () => Promise<void>; // 초기화
  initMyItems: () => Promise<void>; // 인벤토리 초기화
  purify: () => types.UserInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: () => Promise<void>; // 제거
  reset: (user?: types.User) => void; // 수정필드 리셋
  whoAmI: () => Promise<void>;
  guest: () => void;
  saveUser: (currentMap: string, currentPosition: number[]) => Promise<void>;
};

export const useUser = create<State & Action>((set, get) => ({
  ...initialState,
  init: async () => {
    //
  },
  initMyItems: async () => {
    const { self } = get();
    if (!self) return;
    const myItems = utils.getMyItems(self);
    set({ myItems });
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
    console.log(self);
    set({ ...self, self });
  },
  guest: () => {
    const guest = `Guest#${Utils.randomNumber(1000)}`;
    set({ id: guest, nickname: guest, self: { ...types.defaultUser, id: guest, nickname: guest, role: "guest" } });
  },

  saveUser: async (currentMap: string, currentPosition: number[]) => {
    const { update } = get();
    set({ currentMap, currentPosition });
    await update();
  },
}));

export const userStore = createSelectors(useUser);
