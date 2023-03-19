import * as gql from "../gql";
import { createActions, createState, SetGet, Slice, Get, createSlicer, SetPick } from "@shared/util-client";
import { cnst } from "@shared/util";

// ? Slice는 재사용가능한 상태와 액션을 정의합니다. 외부 상태를 가져다쓰지 않는 경우에만 사용하세요.
// * 1. State에 대한 내용을 정의하세요.
const state = (setget, suffix: string) => ({
  ...createState(gql.mocSurveyGraphQL),
  ...createActions(gql.mocSurveyGraphQL, setget, suffix),
  filter: "all" as cnst.SurveyFilterType,
  mocSurveyResponse: gql.defaultUserSurveyResponse,
  isWriteMode: false,
});

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, pick }: SetPick<typeof state>, suffix: string) => ({
  findResponse: (mocSurveyId: string, userId: string) => {
    const { mocSurveyList } = pick("mocSurveyList");
    const mocSurvey = mocSurveyList.find((mocSurvey) => mocSurvey.id === mocSurveyId);
    if (!mocSurvey) throw new Error("No MocSurvey");
    const response = mocSurvey.responses.find((response) => response.user.id === userId);
    // if (!response) throw new Error("No Response");
    // return response; //! void 강제
  },
  responseMocSurvey: async () => {
    const { mocSurveyList, mocSurvey, refreshMocSurvey, mocSurveyResponse } = pick(
      "mocSurveyList",
      "mocSurvey",
      "refreshMocSurvey",
      "mocSurveyResponse"
    );
    const purifyResponse = gql.purifyUserSurveyResponse(mocSurveyResponse);
    if (!mocSurvey || !purifyResponse) return;
    await gql.respondMocSurvey(mocSurvey.id, purifyResponse);
    await refreshMocSurvey();
    // set({
    //   mocSurveyList: await refresh(),
    //   mocSurvey: newMocSurvey,
    // });
  },
  openMocSurvey: async (mocSurveyId) => {
    await gql.openMocSurvey(mocSurveyId);
  },
});

export type MocSurveySliceState = Get<typeof state, typeof actions>;
export type MocSurveySlice = Slice<"mocSurvey", MocSurveySliceState>;
export const makeMocSurveySlice = createSlicer("mocSurvey" as const, state, actions);
