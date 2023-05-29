import * as fetch from "../fetch";
import { Get, SetGet, Slice, client, cnst, createActions, createSlicer, createState, trying } from "@util/client";
import type { RootState } from "../store";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.adminGraphQL),

  me: fetch.defaultAdmin as fetch.Admin,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.adminGraphQL, { set, get, pick }),
  addAdminRole: async (adminId: string, role: cnst.AdminRole) => {
    const admin = await trying("Add Role", fetch.addAdminRole(adminId, role));
    const { adminMap } = pick("adminMap");
    adminMap.set(admin.id, admin);
    set({ adminMap: new Map(adminMap) });
  },
  subAdminRole: async (adminId: string, role: cnst.AdminRole) => {
    const admin = await trying("Remove Role", fetch.subAdminRole(adminId, role));
    const { adminMap } = pick("adminMap");
    adminMap.set(admin.id, admin);
    set({ adminMap: new Map(adminMap) });
  },
  initAdminAuth: async () => {
    const me = await fetch.me();
    set({ me });
  },
  signinAdmin: async () => {
    try {
      const { login } = get() as RootState;
      const { accountId, password } = get().adminForm;
      const jwt = (await fetch.signinAdmin(accountId ?? "", password ?? "")).jwt;
      await login({ auth: "admin", jwt });
    } catch (e) {
      throw new Error("Auth Failed");
    }
  },
  signoutAdmin: () => {
    client.reset();
    set({
      me: fetch.defaultAdmin as fetch.Admin,
      adminForm: fetch.adminGraphQL.defaultAdmin,
    });
  },
});

export type AdminState = Get<typeof state, typeof actions>;
export type AdminSlice = Slice<"admin", AdminState>;
export const makeAdminSlice = createSlicer("admin" as const, state, actions);
