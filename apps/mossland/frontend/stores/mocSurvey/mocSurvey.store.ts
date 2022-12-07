import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, Get, makeStore, SetGet } from "@shared/util-client";
import { cnst } from "@shared/util";
import { mocSurveyGraphQL } from "../gql";

const state = {
  ...createState(mocSurveyGraphQL),
  ...gql.defaultUserSurveyResponse,
  filter: "all" as cnst.SurveyFilterType,
  response: null as gql.UserSurveyResponse | null,
  isWriteMode: false,
  adminOperation: "sleep" as "sleep" | "idle" | "loading",
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  // ...createActions(mocSurveyGraphQL, { get, set }),
  createMocSurvey: async () => {
    const { mocSurveyForm, mocSurveyList } = get(); // as Get<typeof state, typeof actions>;
    if (mocSurveyList === "loading") return;
    const input = mocSurveyGraphQL.purifyMocSurvey(mocSurveyForm);
    if (!input) throw new Error("Invalid Input");
    const mocSurvey = await gql.generateMocSurvey(input);
    set({ mocSurveyList: [...mocSurveyList, mocSurvey] });
    // return mocSurvey;
  }, // 생성
  findResponse: (mocSurveyId: string, userId: string) => {
    const { mocSurveyList } = get();
    if (mocSurveyList === "loading") return;
    const mocSurvey = mocSurveyList.find((mocSurvey) => mocSurvey.id === mocSurveyId);
    if (!mocSurvey) throw new Error("No MocSurvey");
    const response = mocSurvey.responses.find((response) => response.user.id === userId);
    // if (!response) throw new Error("No Response");
    // return response; //! void 강제
  },

  filtermocSurveyList: () => {
    //
  },

  responseMocSurvey: async () => {
    const { mocSurveyList, mocSurvey, mocSurveyForm } = get();
    if (mocSurvey === "loading" || mocSurveyList === "loading") return;
    const response = gql.purifyUserSurveyResponse(get());
    if (!mocSurvey || !response) return;
    const newMocSurvey = await gql.respondMocSurvey(mocSurvey.id, response);
    set({
      mocSurveyList: mocSurveyList.map((sur) => (sur.id !== newMocSurvey.id ? sur : newMocSurvey)),
      mocSurvey: newMocSurvey,
    });
  },
  openMocSurvey: async (mocSurveyId) => {
    await gql.openMocSurvey(mocSurveyId);
  },
});
export const mocSurvey = makeStore(mocSurveyGraphQL.refName, state, actions);
