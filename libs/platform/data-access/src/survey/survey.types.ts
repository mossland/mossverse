import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";
import { contractFragment, tokenFragment, walletFragment } from "libs/shared/data-access/src/types";
export type SurveyInput = {
  title: string;
  description: string;
  selections: string[];
  contract: types.ID;
  creator: types.ID;
  type: cnst.SurveyType;
  policy: cnst.SurveyPolicy[];
  closeAt: Date;
  openAt: Date;
};

export type Survey = {
  id: types.ID;
  title: string;
  description: string;
  selections: string[];
  type: cnst.SurveyType;
  policy: cnst.SurveyPolicy[];
  closeAt: Date;
  openAt: Date;
  walletNum: number;
  tokenNum: number;
  selectTokenNum: number[];
  selectWalletNum: number[];
  snapshotAt: Date;
  createdAt: Date;
  updatedAt: Date;
  status: cnst.SurveyStatus;
  contract: types.shared.Contract;
  creator: types.shared.Wallet;
  responses: types.SurveyResponse[];
};

export const purifySurvey = (survey: Survey): SurveyInput => ({
  title: survey.title,
  description: survey.description,
  selections: survey.selections,
  contract: survey.contract.id,
  creator: survey.creator.id,
  type: survey.type,
  policy: survey.policy,
  closeAt: survey.closeAt,
  openAt: survey.openAt,
});

export const purifyResponse = (response: SurveyResponse, wallet: types.shared.Wallet): SurveyResponseInput => {
  return {
    answer: response.answer,
    reason: response.reason,
    selection: response.selection,
    wallet: wallet.id,
  };
};

export type SurveyResponseInput = {
  wallet: types.ID;
  answer: string | null;
  selection: number | null;
  reason: string | null;
};
export type SurveyResponse = {
  id: types.ID;
  wallet: types.shared.Wallet;
  answer: string | null;
  selection: number | null;
  reason: string | null;
  tokenNum: number;
  tokens: types.ID[];
};
// ${tokenFragment}
export const surveyResponseFragment = gql`
  ${walletFragment}
  fragment surveyResponseFragment on SurveyResponse {
    id
    answer
    selection
    reason
    tokenNum
    wallet {
      ...walletFragment
    }
    tokens {
      ...tokenFragment
    }
  }
`;

export const surveyFragment = gql`
  ${surveyResponseFragment}
  ${contractFragment}
  ${walletFragment}
  fragment surveyFragment on Survey {
    id
    title
    description
    selections
    type
    policy
    closeAt
    openAt
    walletNum
    tokenNum
    selectTokenNum
    selectWalletNum
    snapshotAt
    status
    createdAt
    updatedAt
    responses {
      ...surveyResponseFragment
    }
    contract {
      ...contractFragment
    }
    creator {
      ...walletFragment
    }
  }
`;

export type Ownership = {
  token: types.ID | null;
  wallet: types.shared.Wallet;
  address: string;
  tokenId: number | null;
  num: number;
  bn: number;
};

export const defaultSurveyResponse: Nullable<SurveyResponse> = {
  id: null,
  wallet: null,
  answer: null,
  selection: null,
  reason: null,
  tokenNum: null,
  tokens: null,
};

export const defaultSurvey: Nullable<Survey> = {
  id: null,
  title: null,
  description: "",
  selections: [],
  contract: null,
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
  walletNum: null,
  tokenNum: null,
  selectTokenNum: null,
  selectWalletNum: null,
};
