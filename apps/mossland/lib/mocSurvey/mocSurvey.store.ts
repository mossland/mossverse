import * as fetch from "../fetch";
import { Get, SetGet, Slice, createActions, createSlicer, createState } from "@util/client";
import { RootState } from "../store";
import { cnst } from "@util/client";

// ? Store는 다른 store 내 상태와 상호작용을 정의합니다. 재사용성이 필요하지 않은 단일 기능을 구현할 때 사용합니다.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget) => ({
  ...createState(fetch.mocSurveyGraphQL),
  filter: "all" as cnst.SurveyFilterType,
  mocSurveyResponse: fetch.defaultUserSurveyResponse,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(fetch.mocSurveyGraphQL, { set, get, pick }),
  findResponse: (mocSurveyId: string, userId: string) => {
    const { mocSurveyMap } = pick("mocSurveyMap");
    const mocSurvey = mocSurveyMap.get(mocSurveyId);
    if (!mocSurvey) throw new Error("No MocSurvey");
    const response = mocSurvey.responses.find((response) => response.user.id === userId);
    // if (!response) throw new Error("No Response");
    // return response; //! void 강제
  },
  responseMocSurvey: async () => {
    const { queryOfMocSurvey, refreshMocSurvey } = get() as RootState;
    const { mocSurvey, mocSurveyResponse } = pick("mocSurvey", "mocSurveyResponse");
    const purifyResponse = fetch.purifyUserSurveyResponse(mocSurveyResponse);
    if (!mocSurvey || !purifyResponse) return;
    const newMocSurvey = await fetch.respondMocSurvey(mocSurvey.id, purifyResponse);
    refreshMocSurvey({ query: queryOfMocSurvey, invalidate: true });
    set({
      mocSurvey: newMocSurvey,
    });
  },
  openMocSurvey: async (mocSurveyId) => {
    const { refreshMocSurvey } = get() as MocSurveyState;
    await fetch.openMocSurvey(mocSurveyId);
    await refreshMocSurvey({ invalidate: true });
  },
  applyMocSurvey: async () => {
    const { refreshMocSurvey } = get() as MocSurveyState;
    const { mocSurveyForm } = pick("mocSurveyForm");
    const purifyForm = fetch.purifyMocSurvey(mocSurveyForm);
    if (!purifyForm) return;
    await fetch.createMocSurvey(purifyForm);
    await refreshMocSurvey({ invalidate: true });
  },
  //
});

export type MocSurveyState = Get<typeof state, typeof actions>;
export type MocSurveySlice = Slice<"mocSurvey", MocSurveyState>;
export const makeMocSurveySlice = createSlicer("mocSurvey" as const, state, actions);
