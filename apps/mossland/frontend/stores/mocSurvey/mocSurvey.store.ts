import create from "zustand";
import * as gql from "../gql";
import {
  createActions,
  createState,
  DefaultActions,
  DefaultOf,
  DefaultState,
  generateStore,
  InputOf,
} from "@shared/util-client";
import { cnst } from "@shared/util";
import { mocSurveyGraphQL } from "../gql";

type State = DefaultState<"mocSurvey", gql.MocSurvey> &
  DefaultOf<gql.UserSurveyResponse> & {
    filter: cnst.SurveyFilterType;
    response: gql.UserSurveyResponse | null;
    isWriteMode: boolean;
    adminOperation: "sleep" | "idle" | "loading";
  };
const initialState: State = {
  ...createState<"mocSurvey", gql.MocSurvey, gql.MocSurveyInput>(mocSurveyGraphQL),
  ...gql.defaultUserSurveyResponse,
  filter: "all",
  response: null,
  isWriteMode: false,
  adminOperation: "sleep", // init여부 확인
};
type Actions = DefaultActions<"mocSurvey", gql.MocSurvey, gql.MocSurveyInput> & {
  // adminInit: () => Promise<void>; // 관리자 초기화
  purifyResponse: () => InputOf<gql.UserSurveyResponseInput> | null; // 유효성검사 및 Map => MapInput 변환
  findResponse: (mocSurveyId: string, walletId: string) => gql.UserSurveyResponse | undefined;
  filtermocSurveyList: (filter: cnst.SurveyFilterType) => void;
  responseMocSurvey: () => Promise<void>;
  openMocSurvey: (mocSurveyId: string) => void;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"mocSurvey", gql.MocSurvey, gql.MocSurveyInput>(mocSurveyGraphQL, { get, set }),
  createMocSurvey: async () => {
    const { state, purifyMocSurvey, mocSurveyList } = get();
    const input = purifyMocSurvey();
    if (!input) throw new Error("Invalid Input");
    const mocSurvey = await gql.generateMocSurvey(input);
    set({ mocSurveyList: [...mocSurveyList, mocSurvey] });
    return mocSurvey;
  }, // 생성
  purifyResponse: () => {
    const state = get();
    try {
      const response = gql.purifyUserSurveyResponse(state as gql.UserSurveyResponse);
      return response;
    } catch (err) {
      return null;
    }
  },
  findResponse: (mocSurveyId: string, userId: string) => {
    const { mocSurveyList } = get();
    const mocSurvey = mocSurveyList.find((mocSurvey) => mocSurvey.id === mocSurveyId);
    if (!mocSurvey) throw new Error("No MocSurvey");
    const response = mocSurvey.responses.find((response) => response.user.id === userId);
    // if (!response) throw new Error("No Response");
    return response;
  },

  filtermocSurveyList: () => {
    //
  },

  responseMocSurvey: async () => {
    const { mocSurveyList, mocSurvey, purifyResponse } = get();
    const response = purifyResponse();
    if (!mocSurvey || !response) return;
    const newMocSurvey = await gql.respondMocSurvey(mocSurvey.id, response);
    set({
      mocSurveyList: mocSurveyList.map((sur) => (sur.id !== newMocSurvey.id ? sur : newMocSurvey)),
      mocSurvey: newMocSurvey,
    });
  },
  openMocSurvey: async (mocSurveyId) => {
    const { adminInit } = get();
    await gql.openMocSurvey(mocSurveyId);
    adminInit();
  },
}));
export const mocSurvey = generateStore(store);
