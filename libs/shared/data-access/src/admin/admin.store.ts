import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

type State = Nullable<types.Admin> & {
  modalOpen: boolean;
  admin: types.Admin | null;
  admins: types.Admin[];
  uri: string | null;
  adminMenu: string;
  menuOpen: boolean;
  viewMode: "signin" | "signup" | "info";
  operation: "sleep" | "idle" | "loading";
};
const initialState: State = {
  ...types.defaultAdmin, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  admin: null, // 1개 조회/작업 시 사용되는 필드
  admins: [], // 여러개 조회 시 사용
  uri: null,
  adminMenu: "default",
  menuOpen: false,
  viewMode: "signin",
  operation: "sleep", // init여부 확인
};
type Actions = {
  purify: () => types.AdminInput | null; // 유효성검사 및 Map => MapInput 변환
  init: () => Promise<void>;
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (admin?: types.Admin) => void; // 수정필드 리셋
  initAuth: (uri: string) => Promise<void>; // 초기화
  signin: () => Promise<void>;
  signout: () => void;
};
export const useAdmin = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async () => {
    const admins = await gql.admins({});
    set({ admins, operation: "idle" });
  },
  purify: () => {
    const state = get();
    try {
      const admin = types.purifyAdmin(state as types.Admin);
      return admin;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { purify, admins, reset } = get();
    const input = purify();
    if (!input) return;
    const admin = await gql.createAdmin(input);
    if (!admin) return;
    set({ admins: [...admins, admin], viewMode: "signin" });
    reset(admin);
  },
  update: async () => {
    const { purify, admins, id, reset } = get();
    const input = purify();
    if (!input || !id) return;
    const admin = input && (await gql.updateAdmin(id, input));
    set({ admins: [admin, ...admins.filter((a) => a.id !== admin.id)] });
    reset(admin);
  },
  remove: async (id: types.ID) => {
    const { admins } = get();
    await gql.removeAdmin(id);
    return set({ admins: [...admins.filter((a) => a.id !== id)] });
  },
  reset: (admin) => set({ ...types.defaultAdmin, admin, modalOpen: false }),
  initAuth: async (uri: string) => {
    setLink(uri);
    set({ uri });
    if (!localStorage.getItem("currentUser")) return;
    try {
      const admin = await gql.me();
      set({ admin, viewMode: "info", operation: "idle" });
    } catch (e) {
      localStorage.removeItem("currentUser");
    }
  },
  signin: async () => {
    try {
      const { accountId, password, uri } = get();
      const token = (await gql.signinAdmin(accountId ?? "", password ?? "")).accessToken;
      localStorage.setItem("currentUser", token);
      setLink(uri ?? "");
      const admin = await gql.me();
      set({ admin, viewMode: "info" });
    } catch (e) {
      throw new Error("Auth Failed");
    }
  },
  signout: () => {
    if (localStorage) localStorage.removeItem("currentUser");
    set({ admin: null, viewMode: "signin" });
  },
}));
export const adminStore = createSelectors(useAdmin);
