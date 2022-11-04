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
import { surveyGraphQL, Survey, SurveyInput } from "./survey.gql";
import { cnst } from "@shared/util";

type State = DefaultState<"survey", gql.Survey> &
  DefaultOf<gql.SurveyResponse> & {
    response: gql.SurveyResponse | null;
    filter: cnst.SurveyFilterType;
    isWriteMode: boolean;
  };
const initialState: State = {
  ...createState<"survey", gql.Survey, gql.SurveyInput>(surveyGraphQL),
  ...gql.defaultSurveyResponse,
  response: null,
  filter: "all",
  isWriteMode: false,
};
type Actions = DefaultActions<"survey", gql.Survey, gql.SurveyInput> & {
  purifyResponse: () => InputOf<gql.SurveyResponseInput> | null; // 유효성검사 및 Map => MapInput 변환
  isVoted: (surveyId: string, walletId?: string) => boolean;
  findResponse: (surveyId: string, walletId: string) => gql.SurveyResponse | undefined;
  filterSurveys: (filter: cnst.SurveyFilterType) => void;
  respondSurvey: (wallet: gql.shared.Wallet) => Promise<void>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"survey", gql.Survey, gql.SurveyInput>(surveyGraphQL, { get, set }),
  createSurvey: async () => {
    const { purify, surveys } = get();
    const input = purify();
    if (!input) throw new Error("Invalid Input");
    const survey = await gql.createAndOpenSurvey(input);
    set({ surveys: [...surveys, survey] });
    return survey;
  }, // 생성
  purifyResponse: () => {
    const state = get();
    try {
      const response = gql.purifySurveyResponse(state as gql.SurveyResponse);
      return response;
    } catch (err) {
      return null;
    }
  },
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
  respondSurvey: async () => {
    const { surveys, survey, purifyResponse } = get();
    const response = purifyResponse();
    if (!survey || !response) return;
    const newSurvey = await gql.respondSurvey(survey.id, response);
    set({ surveys: surveys.map((sur) => (sur.id !== newSurvey.id ? sur : newSurvey)), survey: newSurvey });
  },
}));
export const survey = generateStore(store);
