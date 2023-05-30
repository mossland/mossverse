import * as fetch from "../fetch";
import { Get, SetGet, Slice, cnst, createActions, createSlicer , createState } from "@util/client";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.surveyGraphQL),
  response: fetch.defaultSurveyResponse as fetch.SurveyResponse,
  filter: "all" as cnst.SurveyFilterType,
  isWriteMode: false,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.surveyGraphQL, { set, get, pick }),
  respondSurvey: async () => {
    const { surveyMap, survey, response } = pick("surveyMap", "survey", "response");
    const input = fetch.purifySurveyResponse(response);
    if (!input) return;
    const newSurvey = await fetch.respondSurvey(survey.id, input);
    surveyMap.set(survey.id, newSurvey);
    set({ surveyMap: new Map(surveyMap), survey: newSurvey });
  },
});

export type SurveyState = Get<typeof state, typeof actions>;
export type SurveySlice = Slice<"survey", SurveyState>;
export const makeSurveySlice = createSlicer("survey" as const, state, actions);
