import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { createSelectors, Nullable } from "@shared/util-client";
import { update } from "libs/shared/util/src/utils";
import { cnst } from "@shared/util";

type State = Nullable<types.Survey & types.SurveyResponse> & {
  survey: types.Survey | null;
  response: types.SurveyResponse | null;
  surveys: types.Survey[];
  filter: cnst.SurveyFilterTypes;
  isWriteMode: boolean;
  operation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...types.defaultSurvey,
  ...types.defaultSurveyResponse,
  filter: "all",
  survey: null,
  response: null,
  surveys: [],
  isWriteMode: false,
  operation: "sleep", // init여부 확인
};

type Action = {
  init: () => Promise<void>; // 초기화
  purify: () => types.SurveyInput | null; // 유효성검사 및 Map => MapInput 변환
  purifyResponse: (wallet: types.shared.Wallet) => types.SurveyResponseInput | null; // 유효성검사 및 Map => MapInput 변환
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (survey?: types.Survey) => void; // 수정필드 리셋
  isVoted: (surveyId: string, walletId?: string) => boolean;
  findResponse: (surveyId: string, walletId: string) => types.SurveyResponse | undefined;
  filterSurveys: (filter: cnst.SurveyFilterTypes) => void;
  responseSurvey: (wallet: types.shared.Wallet) => Promise<void>;
};

export const useSurvey = create<State & Action>()(
  devtools((set, get) => ({
    ...initialState,
    init: async () => {
      const surveys = await gql.surveys({ status: { $ne: "inactive" } });
      set({ surveys, operation: "idle" });
    },
    purify: () => {
      const state = get();
      try {
        const survey = types.purifySurvey(state as types.Survey);
        return survey;
      } catch (err) {
        return null;
      }
    },
    purifyResponse: (wallet: types.shared.Wallet) => {
      const state = get();
      try {
        const response = types.purifyResponse(state as types.SurveyResponse, wallet);
        return response;
      } catch (err) {
        return null;
      }
    },
    create: async () => {
      const { purify, surveys } = get();
      const input = purify();
      if (!input) return;
      const survey = await gql.createAndOpenSurvey(input);
      if (!survey) return;
      return set({ surveys: [...surveys, survey] });
    }, // 생성
    update: async () => {
      const { purify, surveys, id } = get();
      const input = purify();
      if (!input || !id) return;
      const sirvey = input && (await gql.updateSurvey(id, input));
      return set({ surveys: [sirvey, ...surveys.filter((a) => a.id !== sirvey.id)] });
    }, // 수정
    remove: async () => {
      const { id, surveys } = get();
      const survey = id && (await gql.removeSurvey(id));
      return set({ surveys: [...surveys.filter((a) => a.id !== id)] });
    }, // 제거
    reset: (survey?: types.Survey) => set({ ...types.defaultSurvey, survey }),
    isVoted: (surveyId: string, walletId?: string) => {
      if (!walletId) return false;
      const { surveys } = get();
      const survey = surveys.find((survey) => survey.id === surveyId);
      if (!survey) return false;
      const response = survey.responses.find((response) => response.wallet.id === walletId);
      return response ? true : false;
    },
    findResponse: (surveyId: string, walletId: string) => {
      const { surveys } = get();
      const survey = surveys.find((survey) => survey.id === surveyId);
      if (!survey) throw new Error("No Survey");
      const response = survey.responses.find((response) => response.wallet.id === walletId);
      // if (!response) throw new Error("No Response");
      return response;
    },

    filterSurveys: () => {
      //
    },

    responseSurvey: async (wallet: types.shared.Wallet) => {
      const { surveys, survey, purifyResponse } = get();
      const response = purifyResponse(wallet);
      if (!survey || !response) return;
      const newSurvey = await gql.respondSurvey(survey.id, response);
      set({ surveys: surveys.map((sur) => (sur.id !== newSurvey.id ? sur : newSurvey)), survey: newSurvey });
    },
  }))
);

export const surveyStore = createSelectors(useSurvey);
