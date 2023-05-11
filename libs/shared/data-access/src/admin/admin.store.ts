import { client, SetGet, State } from "@shared/util-client";
import type { RootState } from "../store";
import * as gql from "../gql";
import * as slice from "../slice";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = ({ set, get, pick }: SetGet<slice.AdminSliceState>) => ({
  ...slice.makeAdminSlice({ set, get, pick }),
  me: gql.defaultAdmin as gql.Admin,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  initAdminAuth: async () => {
    const me = await gql.me();
    set({ me });
  },
  signinAdmin: async () => {
    try {
      const { login } = get() as RootState;
      const { accountId, password } = get().adminForm;
      const jwt = (await gql.signinAdmin(accountId ?? "", password ?? "")).jwt;
      await login({ auth: "admin", jwt, loginType: "signin" });
    } catch (e) {
      throw new Error("Auth Failed");
    }
  },
  signoutAdmin: () => {
    client.reset();
    set({ me: gql.defaultAdmin as gql.Admin, adminForm: gql.adminGraphQL.defaultAdmin });
  },
});

export type AdminState = State<typeof state, typeof actions>;
// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const addAdminToStore = ({ set, get, pick }: SetGet<AdminState>) => ({
  ...state({ set, get, pick }),
  ...actions({ set, get, pick }),
});
