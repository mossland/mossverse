import { cnst } from "@shared/util";
import { createActions, createState, SetGet, Slice, Get, createSlicer, SetPick, trying } from "@shared/util-client";
import * as gql from "../gql";

// ? Slice는 재사용가능한 상태와 액션을 정의합니다. 외부 상태를 가져다쓰지 않는 경우에만 사용하세요.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget, suffix: string) => ({
  ...createState(gql.adminGraphQL),
  ...createActions(gql.adminGraphQL, setget, suffix),
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, pick }: SetPick<typeof state>, suffix: string) => ({
  addAdminRole: async (adminId: string, role: cnst.AdminRole, idx?: number) => {
    const admin = await trying("Add Role", gql.addAdminRole(adminId, role));
    if (!idx) set({ admin });
    const { adminList } = pick("adminList");
    set({ adminList: adminList.map((a) => (a.id === admin.id ? admin : a)) });
  },
  subAdminRole: async (adminId: string, role: cnst.AdminRole, idx?: number) => {
    const admin = await trying("Remove Role", gql.subAdminRole(adminId, role));
    if (!idx) set({ admin });
    const { adminList } = pick("adminList");
    set({ adminList: adminList.map((a) => (a.id === admin.id ? admin : a)) });
  },
});

export type AdminSliceState = Get<typeof state, typeof actions>;
export type AdminSlice = Slice<"admin", AdminSliceState>;
export const makeAdminSlice = createSlicer("admin" as const, state, actions);
