import * as gql from "../gql";
import { createActions, createState, SetGet, Slice, Get, createSlicer, SetPick } from "@shared/util-client";
import { cnst } from "@shared/util";

// ? Slice는 재사용가능한 상태와 액션을 정의합니다. 외부 상태를 가져다쓰지 않는 경우에만 사용하세요.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget, suffix: string) => ({
  ...createState(gql.surveyGraphQL),
  ...createActions(gql.surveyGraphQL, setget, suffix),
  response: gql.defaultSurveyResponse as gql.SurveyResponse,
  filter: "all" as cnst.SurveyFilterType,
  isWriteMode: false,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, pick }: SetPick<typeof state>, suffix: string) => ({
  respondSurvey: async () => {
    const { surveyList, survey, response } = pick("surveyList", "survey", "response");
    const input = gql.purifySurveyResponse(response);
    if (!input) return;
    const newSurvey = await gql.respondSurvey(survey.id, input);
    set({ surveyList: surveyList.map((sur) => (sur.id !== newSurvey.id ? sur : newSurvey)), survey: newSurvey });
  },
});

export type SurveySliceState = Get<typeof state, typeof actions>;
export type SurveySlice = Slice<"survey", SurveySliceState>;
export const makeSurveySlice = createSlicer("survey" as const, state, actions);
