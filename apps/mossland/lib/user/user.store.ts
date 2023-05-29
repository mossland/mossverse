import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.userGraphQL),

  self: fetch.defaultUser as fetch.User,
  // self: fetch.User | null;
  // user: fetch.User | null;
  // myItems: fetch.MyItem[];
  // myItem: fetch.MyItem | null;
  // isInventoryOpen: boolean;
  // selectedItemIndex: number | null;
  // // character: types.Character | null;
  // isPossibleEdit: boolean;
  // isProfileNameEdit: boolean;
  isShowVideoAudioSetting: false,
  // operation: "sleep" | "idle" | "loading";
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.userGraphQL, { set, get, pick }),
  //
  whoAmI: async ({ reset }: { reset?: boolean } = {}) =>
    set({ self: reset ? (fetch.defaultUser as fetch.User) : await fetch.whoAmI() }),

  // init: () => Promise<void>; // 초기화
  // initMyItems: () => Promise<void>; // 인벤토리 초기화
  // purify: () => InputOf<fetch.UserInput> | null; // 유효성검사 및 Map => MapInput 변환
  // create: () => Promise<void>; // 생성
  // update: () => Promise<void>; // 수정
  // remove: () => Promise<void>; // 제거
  // reset: (user?: fetch.User) => void; // 수정필드 리셋
  // whoAmI: () => Promise<void>;
  // guest: () => void;
  // saveUser: (currentMap: string, currentPosition: number[]) => Promise<void>;
});

export type UserState = Get<typeof state, typeof actions>;
export type UserSlice = Slice<"user", UserState>;
export const makeUserSlice = createSlicer("user" as const, state, actions);
