import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";
import { Utils } from "@shared/util";

type State = Nullable<types.Role> & {
  modalOpen: boolean;
  role: types.Role | null;
  roles: types.Role[];
  operation: "sleep" | "idle" | "loading";
};
const initialState: State = {
  ...types.defaultRole, // 기본 수정 필드
  modalOpen: false, // 기본 수정 모달
  role: null, // 1개 조회/작업 시 사용되는 필드
  roles: [], // 여러개 조회 시 사용
  operation: "sleep", // init여부 확인
};
type Actions = {
  init: () => Promise<void>; // 초기화
  purify: () => types.RoleInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (role?: types.Role) => void; // 수정필드 리셋
};
export const useRole = create<State & Actions>((set, get) => ({
  ...initialState,
  init: async () => {
    const roles = await gql.roles({});
    set({ roles });
  },
  purify: () => {
    const state = get();
    try {
      const role = types.purifyRole(state as types.Role);
      return role;
    } catch (err) {
      return null;
    }
  },
  create: async () => {
    const { purify, roles, id } = get();
    const input = purify();
    if (!input) return;
    const role = await gql.createRole(input);
    if (!role) return;
    return set({ roles: [...roles, role] });
  },
  update: async () => {
    const { purify, roles, id } = get();
    const input = purify();
    if (!input || !id) return;
    const role = input && (await gql.updateRole(id, input));
    return set({ roles: [role, ...roles.filter((a) => a.id !== role.id)] });
  },
  remove: async () => {
    const { id, roles } = get();
    const role = id && (await gql.removeRole(id));
    return set({ roles: [...roles.filter((a) => a.id !== id)] });
  },
  reset: (role) => set({ ...types.defaultRole, role }),
}));
export const roleStore = createSelectors(useRole);
