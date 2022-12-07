import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, makeStore, SetGet } from "@shared/util-client";
import { surveyGraphQL, Survey, SurveyInput } from "./survey.gql";
import { cnst, Utils } from "@shared/util";

const state = {
  ...createState(surveyGraphQL),
  ...gql.defaultSurveyResponse,
  response: gql.defaultSurveyResponse as gql.SurveyResponse,
  filter: "all" as cnst.SurveyFilterType,
  isWriteMode: false,
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(surveyGraphQL, { get, set }),
  //! Purify는 더이상 action으로 사용하지 않음. gql 내부의 purify를 사용하거나, submit state, checkSubmit action을 사용하도록 변경
  // purifyResponse: () => {
  //   const state = get();
  //   try {
  //     const response = gql.purifySurveyResponse(state as gql.SurveyResponse);
  //   } catch (err) {
  //     return null;
  //   }
  // },

  //! set이 없는 순수함수는 별도로 분리
  // isVoted: (surveyId: string, walletId?: string) => {
  //   if (!walletId) return false;
  //   const { surveys } = get();
  //   const survey = surveys.find((survey) => survey.id === surveyId);
  //   if (!survey) return false;
  //   const response = survey.responses.find((response) => response.wallet.id === walletId);
  //   return response ? true : false;
  // },
  // findResponse: (surveyId: string, walletId: string) => {
  //   const { surveys } = get();
  //   const survey = surveys.find((survey) => survey.id === surveyId);
  //   if (!survey) throw new Error("No Survey");
  //   const response = survey.responses.find((response) => response.wallet.id === walletId);
  //   // if (!response) throw new Error("No Response");
  //   return response;
  // },

  respondSurvey: async () => {
    const { surveyList, survey, response } = get();
    if (surveyList === "loading" || survey === "loading" || !survey) return;
    const input = gql.purifySurveyResponse(response);
    if (!survey || !input) return;
    const newSurvey = await gql.respondSurvey(survey.id, input);
    set({ surveyList: surveyList.map((sur) => (sur.id !== newSurvey.id ? sur : newSurvey)), survey: newSurvey });
  },
});
export const survey = makeStore(surveyGraphQL.refName, state, actions);
