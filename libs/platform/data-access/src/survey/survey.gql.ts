import { query, mutate } from "../index";
import * as types from "../types";
import gql from "graphql-tag";

// * Survey Query
export type SurveyQuery = { survey: types.Survey };
export const surveyQuery = gql`
  ${types.surveyFragment}
  query survey($surveyId: ID!) {
    surveys(surveyId: $surveyId) {
      ...surveyFragment
    }
  }
`;

export const survey = async (surveyId: string) => (await query<SurveyQuery>(surveysQuery, { surveyId })).survey;

// * Surveys Query
export type SurveysQuery = { surveys: types.Survey[] };
export const surveysQuery = gql`
  ${types.surveyFragment}
  query surveys($query: JSON!, $skip: Int, $limit: Int) {
    surveys(query: $query, skip: $skip, limit: $limit) {
      ...surveyFragment
    }
  }
`;
export const surveys = async (qry: any, skip = 0, limit = 0) =>
  (await query<SurveysQuery>(surveysQuery, { query: qry, skip, limit })).surveys;

// * Create Survey Mutation
export type CreateSurveyMutation = { createSurvey: types.Survey };
export const createSurveyMutation = gql`
  ${types.surveyFragment}
  mutation createSurvey($data: SurveyInput!) {
    createSurvey(data: $data) {
      ...surveyFragment
    }
  }
`;
export const createSurvey = async (data: types.SurveyInput) =>
  (await mutate<CreateSurveyMutation>(createSurveyMutation, { data })).createSurvey;

// * Generate Survey Mutation
export type GenerateSurveyMutation = { generateSurvey: types.Survey };
export const generateSurveyMutation = gql`
  ${types.surveyFragment}
  mutation generateSurvey($data: SurveyInput!) {
    generateSurvey(data: $data) {
      ...surveyFragment
    }
  }
`;
export const generateSurvey = async (data: types.SurveyInput) =>
  (await mutate<GenerateSurveyMutation>(generateSurveyMutation, { data })).generateSurvey;

// * Update Survey Mutation
export type UpdateSurveyMutation = { updateSurvey: types.Survey };
export const updateSurveyMutation = gql`
  ${types.surveyFragment}
  mutation updateSurvey($surveyId: ID!, $data: SurveyInput!) {
    updateSurvey(surveyId: $surveyId, data: $data) {
      ...surveyFragment
    }
  }
`;
export const updateSurvey = async (surveyId: string, data: types.SurveyInput) =>
  (await mutate<UpdateSurveyMutation>(updateSurveyMutation, { surveyId, data })).updateSurvey;

// * Remove Survey Mutation
export type RemoveSurveyMutation = { removeSurvey: types.Survey };
export const removeSurveyMutation = gql`
  ${types.surveyFragment}
  mutation removeSurvey($surveyId: ID!, $data: SurveyInput!) {
    removeSurvey(surveyId: $surveyId, data: $data) {
      ...surveyFragment
    }
  }
`;
export const removeSurvey = async (surveyId: string) =>
  (await mutate<RemoveSurveyMutation>(removeSurveyMutation, { surveyId })).removeSurvey;

// * Open Survey Mutation
export type OpenSurveyMutation = { openSurvey: types.Survey };
export const openSurveyMutation = gql`
  ${types.surveyFragment}
  mutation openSurvey($surveyId: ID!, $data: SurveyInput!) {
    openSurvey(surveyId: $surveyId, data: $data) {
      ...surveyFragment
    }
  }
`;
export const openSurvey = async (surveyId: string) =>
  (await mutate<OpenSurveyMutation>(openSurveyMutation, { surveyId })).openSurvey;

// * Respond Survey Mutation
export type RespondSurveyMutation = { respondSurvey: types.Survey };
export const respondSurveyMutation = gql`
  ${types.surveyFragment}
  mutation respondSurvey($surveyId: ID!, $response: SurveyResponseInput!) {
    respondSurvey(surveyId: $surveyId, response: $response) {
      ...surveyFragment
    }
  }
`;
export const respondSurvey = async (surveyId: string, response: types.SurveyResponseInput) =>
  (await mutate<RespondSurveyMutation>(respondSurveyMutation, { surveyId, response })).respondSurvey;

// * Close Survey Mutation
export type CloseSurveyMutation = { closeSurvey: types.Survey };
export const closeSurveyMutation = gql`
  ${types.surveyFragment}
  mutation closeSurvey($surveyId: ID!) {
    closeSurvey(surveyId: $surveyId) {
      ...surveyFragment
    }
  }
`;
export const closeSurvey = async (surveyId: string) =>
  (await mutate<CloseSurveyMutation>(closeSurveyMutation, { surveyId })).closeSurvey;

export type GetSurveySnapshotQuery = { getSurveySnapshot: types.Ownership[] };
export const getSurveySnapshotQuery = gql`
  ${types.shared.tokenFragment}
  ${types.shared.walletFragment}
  query getSurveySnapshot($surveyId: ID!) {
    getSurveySnapshot(surveyId: $surveyId) {
      id
      token {
        ...tokenFragment
      }
      wallet {
        ...walletFragment
      }
      address
      tokenId
      num
      bn
    }
  }
`;
export const getSurveySnapshot = async (surveyId: string) =>
  (await mutate<GetSurveySnapshotQuery>(getSurveySnapshotQuery, { surveyId })).getSurveySnapshot;

// * CreateAnd Survey Mutation
export type CreateAndOpenSurveyMutation = { createAndOpenSurvey: types.Survey };
export const createAndOpenSurveyMutation = gql`
  ${types.surveyFragment}
  mutation createAndOpenSurvey($data: SurveyInput!) {
    createAndOpenSurvey(data: $data) {
      ...surveyFragment
    }
  }
`;
export const createAndOpenSurvey = async (data: types.SurveyInput) =>
  (await mutate<CreateAndOpenSurveyMutation>(createAndOpenSurveyMutation, { data })).createAndOpenSurvey;
