import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { thingFragment, tokenFragment, walletFragment } from "libs/shared/data-access/src/types";
import { userFragment } from "@platform/data-access";
export type MocSurveyInput = {
  title: string;
  description: string;
  selections: string[];
  creator: types.lib.ID;
  type: cnst.SurveyType;
  policy: cnst.SurveyPolicy[];
  closeAt: Date;
  openAt: Date;
};

export type MocSurvey = {
  id: types.lib.ID;
  title: string;
  creator: types.lib.User;
  description: string;
  selections: string[];
  closeAt: Date;
  openAt: Date;
  mocNum: number;
  userNum: number;
  selectMocNum: number[];
  selectUserNum: number[];
  snapshotAt: Date;
  createdAt: Date;
  updatedAt: Date;
  thing: types.shared.Thing;
  type: cnst.SurveyType;
  policy: cnst.SurveyPolicy[];
  status: cnst.SurveyStatus;
  responses: UserSurveyResponse[];
  // snapshot:
};

export const purifyMocSurvey = (survey: MocSurvey): MocSurveyInput => ({
  title: survey.title,
  description: survey.description,
  selections: survey.selections,
  creator: survey.creator.id,
  type: survey.type,
  policy: survey.policy,
  closeAt: survey.closeAt,
  openAt: survey.openAt,
});

export const purifyMocResponse = (response: UserSurveyResponse, user: types.lib.User): UserSurveyResponseInput => {
  return {
    answer: response.answer,
    reason: response.reason,
    selection: response.selection,
    user: user.id,
  };
};

export type UserSurveyResponseInput = {
  answer: string | null;
  selection: number | null;
  reason: string | null;
  user: types.lib.ID;
};

export type UserSurveyResponse = {
  id: types.lib.ID;
  user: types.lib.User;
  answer: string | null;
  selection: number | null;
  reason: string | null;
  num: number;
};
// ${tokenFragment}
export const userSurveyResponseFragment = gql`
  ${userFragment}
  fragment userSurveyResponseFragment on UserSurveyResponse {
    id
    answer
    selection
    reason
    num
    user {
      ...userFragment
    }
  }
`;

export const mocSurveyFragment = gql`
  ${userFragment}
  ${thingFragment}
  ${userSurveyResponseFragment}
  fragment mocSurveyFragment on MocSurvey {
    id
    title
    description
    selections
    closeAt
    openAt
    mocNum
    userNum
    selectMocNum
    selectUserNum
    snapshotAt
    createdAt
    updatedAt
    thing {
      ...thingFragment
    }
    type
    policy
    creator {
      ...userFragment
    }
    responses {
      ...userSurveyResponseFragment
    }
    status
  }
`;

export type MocOwnership = {
  user: types.lib.User;
  num: number;
};

export const defaultUserSurveyResponse: Nullable<UserSurveyResponse> = {
  id: null,
  user: null,
  answer: null,
  selection: null,
  reason: null,
  num: null,
};

export const defaultMocSurvey: Nullable<MocSurvey> = {
  id: null,
  title: null,
  description: "",
  selections: [],
  thing: null,
  creator: null,
  type: "objective",
  policy: null,
  closeAt: null,
  openAt: null,
  responses: null,
  snapshotAt: null,
  status: null,
  createdAt: null,
  updatedAt: null,
  mocNum: null,
  userNum: null,
  selectMocNum: null,
  selectUserNum: null,
};
