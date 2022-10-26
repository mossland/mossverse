import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { createSelectors, Nullable } from "@shared/util-client";
import { update } from "libs/shared/util/src/utils";
import { cnst } from "@shared/util";

type State = Nullable<types.MocSurvey & types.UserSurveyResponse> & {
  mocSurvey: types.MocSurvey | null;
  response: types.UserSurveyResponse | null;
  mocSurveys: types.MocSurvey[];
  filter: cnst.SurveyFilterTypes;
  isWriteMode: boolean;
  modalOpen: boolean;
  operation: "sleep" | "idle" | "loading";
  adminOperation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...types.defaultMocSurvey,
  ...types.defaultUserSurveyResponse,
  filter: "all",
  mocSurvey: null,
  response: null,
  mocSurveys: [],
  isWriteMode: false,
  modalOpen: false,
  operation: "sleep", // init여부 확인
  adminOperation: "sleep", // init여부 확인
};

type Action = {
  init: () => Promise<void>; // 초기화
  adminInit: () => Promise<void>; // 관리자 초기화
  purify: () => types.MocSurveyInput | null; // 유효성검사 및 Map => MapInput 변환
  purifyResponse: (user: types.lib.User) => types.UserSurveyResponseInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (mocSurvey?: types.MocSurvey) => void; // 수정필드 리셋
  findResponse: (mocSurveyId: string, walletId: string) => types.UserSurveyResponse | undefined;
  filterMocSurveys: (filter: cnst.SurveyFilterTypes) => void;
  responseMocSurvey: (user: types.lib.User) => Promise<void>;
  openMocSurvey: (mocSurveyId: string) => void;
};

export const useMocSurvey = create<State & Action>()(
  devtools((set, get) => ({
    ...initialState,
    init: async () => {
      const mocSurveys = await gql.mocSurveys({ status: { $in: ["opened", "closed"] } });
      set({ mocSurveys, operation: "idle" });
    },
    adminInit: async () => {
      const mocSurveys = await gql.mocSurveys({ status: { $ne: "inactive" } });
      set({ mocSurveys, adminOperation: "idle" });
    },
    purify: () => {
      const state = get();
      try {
        const mocSurvey = types.purifyMocSurvey(state as types.MocSurvey);
        return mocSurvey;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    purifyResponse: (user: types.lib.User) => {
      const state = get();
      try {
        const response = types.purifyMocResponse(state as types.UserSurveyResponse, user);
        return response;
      } catch (err) {
        return null;
      }
    },
    create: async () => {
      const { purify, mocSurveys } = get();
      const input = purify();
      console.log(input);
      if (!input) return;
      const mocSurvey = await gql.generateMocSurvey(input);
      if (!mocSurvey) return;
      return set({ mocSurveys: [...mocSurveys, mocSurvey] });
    }, // 생성
    update: async () => {
      const { purify, mocSurveys, id } = get();
      const input = purify();
      if (!input || !id) return;
      const sirvey = input && (await gql.updateMocSurvey(id, input));
      return set({ mocSurveys: [sirvey, ...mocSurveys.filter((a) => a.id !== sirvey.id)] });
    }, // 수정
    remove: async () => {
      const { id, mocSurveys } = get();
      const mocSurvey = id && (await gql.removeMocSurvey(id));
      return set({ mocSurveys: [...mocSurveys.filter((a) => a.id !== id)] });
    }, // 제거
    reset: (mocSurvey?: types.MocSurvey) => set({ ...types.defaultMocSurvey, mocSurvey }),

    findResponse: (mocSurveyId: string, userId: string) => {
      const { mocSurveys } = get();
      const mocSurvey = mocSurveys.find((mocSurvey) => mocSurvey.id === mocSurveyId);
      if (!mocSurvey) throw new Error("No MocSurvey");
      const response = mocSurvey.responses.find((response) => response.user.id === userId);
      // if (!response) throw new Error("No Response");
      return response;
    },

    filterMocSurveys: () => {
      //
    },

    responseMocSurvey: async (user: types.lib.User) => {
      const { mocSurveys, mocSurvey, purifyResponse } = get();
      const response = purifyResponse(user);
      if (!mocSurvey || !response) return;
      const newMocSurvey = await gql.respondMocSurvey(mocSurvey.id, response);
      set({
        mocSurveys: mocSurveys.map((sur) => (sur.id !== newMocSurvey.id ? sur : newMocSurvey)),
        mocSurvey: newMocSurvey,
      });
    },
    openMocSurvey: async (mocSurveyId) => {
      const { adminInit } = get();
      await gql.openMocSurvey(mocSurveyId);
      adminInit();
    },
  }))
);

export const mocSurveyStore = createSelectors(useMocSurvey);
