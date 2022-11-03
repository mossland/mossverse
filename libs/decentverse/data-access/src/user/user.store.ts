import create from "zustand";
import * as gql from "../gql";
import * as utils from "../utils";
import { generateStore, InputOf, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

//! Need to be refactored

type State = Nullable<gql.User> & {
  self: gql.User | null;
  user: gql.User | null;
  myItems: gql.MyItem[];
  myItem: gql.MyItem | null;
  isInventoryOpen: boolean;
  selectedItemIndex: number | null;
  // character: types.Character | null;
  isPossibleEdit: boolean;
  isProfileNameEdit: boolean;
  isShowVideoAudioSetting: boolean;
  operation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...gql.defaultUser,
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
  purify: () => InputOf<gql.UserInput> | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: () => Promise<void>; // 제거
  reset: (user?: gql.User) => void; // 수정필드 리셋
  whoAmI: () => Promise<void>;
  guest: () => void;
  saveUser: (currentMap: string, currentPosition: number[]) => Promise<void>;
};

const store = create<State & Action>((set, get) => ({
  ...initialState,
  init: async () => {
    const self = await gql.whoAmI();
    const myItems = utils.getMyItems(self);
    set({ self, myItems, ...self });
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
      const user = gql.purifyUser(state as gql.User);
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
  reset: (user?: gql.User) => set({ ...gql.defaultUser, user }),

  whoAmI: async () => {
    const self = await gql.whoAmI();
    set({ ...self, self });
  },
  guest: () => {
    const guest = `Guest#${Utils.randomNumber(1000)}`;
    set({ id: guest, nickname: guest, self: { ...gql.defaultUser, id: guest, nickname: guest, role: "guest" } });
  },

  saveUser: async (currentMap: string, currentPosition: number[]) => {
    const { update } = get();
    set({ currentMap, currentPosition });
    await update();
  },
}));

export const user = generateStore(store);
