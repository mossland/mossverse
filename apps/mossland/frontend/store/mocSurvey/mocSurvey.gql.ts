import { query, mutate } from "@platform/data-access";

import * as types from "../types";
import gql from "graphql-tag";

// * MocSurvey Query
export type MocSurveyQuery = { mocSurvey: types.MocSurvey };
export const mocSurveyQuery = gql`
  ${types.mocSurveyFragment}
  query mocSurvey($mocSurveyId: ID!) {
    mocSurveys(mocSurveyId: $mocSurveyId) {
      ...mocSurveyFragment
    }
  }
`;

export const mocSurvey = async (mocSurveyId: string) =>
  (await query<MocSurveyQuery>(mocSurveysQuery, { mocSurveyId })).mocSurvey;

// * MocSurveys Query
export type MocSurveysQuery = { mocSurveys: types.MocSurvey[] };
export const mocSurveysQuery = gql`
  ${types.mocSurveyFragment}
  query mocSurveys($query: JSON!, $skip: Int, $limit: Int) {
    mocSurveys(query: $query, skip: $skip, limit: $limit) {
      ...mocSurveyFragment
    }
  }
`;
export const mocSurveys = async (qry: any, skip = 0, limit = 0) =>
  (await query<MocSurveysQuery>(mocSurveysQuery, { query: qry, skip, limit })).mocSurveys;

// * Create MocSurvey Mutation
export type CreateMocSurveyMutation = { createMocSurvey: types.MocSurvey };
export const createMocSurveyMutation = gql`
  ${types.mocSurveyFragment}
  mutation createMocSurvey($data: MocSurveyInput!) {
    createMocSurvey(data: $data) {
      ...mocSurveyFragment
    }
  }
`;
export const createMocSurvey = async (data: types.MocSurveyInput) =>
  (await mutate<CreateMocSurveyMutation>(createMocSurveyMutation, { data })).createMocSurvey;

// * Generate MocSurvey Mutation
export type GenerateMocSurveyMutation = { generateMocSurvey: types.MocSurvey };
export const generateMocSurveyMutation = gql`
  ${types.mocSurveyFragment}
  mutation generateMocSurvey($data: MocSurveyInput!) {
    generateMocSurvey(data: $data) {
      ...mocSurveyFragment
    }
  }
`;
export const generateMocSurvey = async (data: types.MocSurveyInput) =>
  (await mutate<GenerateMocSurveyMutation>(generateMocSurveyMutation, { data })).generateMocSurvey;

// * Update MocSurvey Mutation
export type UpdateMocSurveyMutation = { updateMocSurvey: types.MocSurvey };
export const updateMocSurveyMutation = gql`
  ${types.mocSurveyFragment}
  mutation updateMocSurvey($mocSurveyId: ID!, $data: MocSurveyInput!) {
    updateMocSurvey(mocSurveyId: $mocSurveyId, data: $data) {
      ...mocSurveyFragment
    }
  }
`;
export const updateMocSurvey = async (mocSurveyId: string, data: types.MocSurveyInput) =>
  (await mutate<UpdateMocSurveyMutation>(updateMocSurveyMutation, { mocSurveyId, data })).updateMocSurvey;

// * Remove MocSurvey Mutation
export type RemoveMocSurveyMutation = { removeMocSurvey: types.MocSurvey };
export const removeMocSurveyMutation = gql`
  ${types.mocSurveyFragment}
  mutation removeMocSurvey($mocSurveyId: ID!, $data: MocSurveyInput!) {
    removeMocSurvey(mocSurveyId: $mocSurveyId, data: $data) {
      ...mocSurveyFragment
    }
  }
`;
export const removeMocSurvey = async (mocSurveyId: string) =>
  (await mutate<RemoveMocSurveyMutation>(removeMocSurveyMutation, { mocSurveyId })).removeMocSurvey;

// * Open MocSurvey Mutation
export type OpenMocSurveyMutation = { openMocSurvey: types.MocSurvey };
export const openMocSurveyMutation = gql`
  ${types.mocSurveyFragment}
  mutation openMocSurvey($mocSurveyId: ID!) {
    openMocSurvey(mocSurveyId: $mocSurveyId) {
      ...mocSurveyFragment
    }
  }
`;
export const openMocSurvey = async (mocSurveyId: string) =>
  (await mutate<OpenMocSurveyMutation>(openMocSurveyMutation, { mocSurveyId })).openMocSurvey;

// * Respond MocSurvey Mutation
export type RespondMocSurveyMutation = { respondMocSurvey: types.MocSurvey };
export const respondMocSurveyMutation = gql`
  ${types.mocSurveyFragment}
  mutation respondMocSurvey($mocSurveyId: ID!, $response: UserSurveyResponseInput!) {
    respondMocSurvey(mocSurveyId: $mocSurveyId, response: $response) {
      ...mocSurveyFragment
    }
  }
`;
export const respondMocSurvey = async (mocSurveyId: string, response: types.UserSurveyResponseInput) =>
  (await mutate<RespondMocSurveyMutation>(respondMocSurveyMutation, { mocSurveyId, response })).respondMocSurvey;

// * Close MocSurvey Mutation
export type CloseMocSurveyMutation = { closeMocSurvey: types.MocSurvey };
export const closeMocSurveyMutation = gql`
  ${types.mocSurveyFragment}
  mutation closeMocSurvey($mocSurveyId: ID!) {
    closeMocSurvey(mocSurveyId: $mocSurveyId) {
      ...mocSurveyFragment
    }
  }
`;
export const closeMocSurvey = async (mocSurveyId: string) =>
  (await mutate<CloseMocSurveyMutation>(closeMocSurveyMutation, { mocSurveyId })).closeMocSurvey;

export type GetMocSurveySnapshotQuery = { getMocSurveySnapshot: types.MocOwnership[] };
export const getMocSurveySnapshotQuery = gql`
  ${types.shared.tokenFragment}
  ${types.shared.walletFragment}
  query getMocSurveySnapshot($mocSurveyId: ID!) {
    getMocSurveySnapshot(mocSurveyId: $mocSurveyId) {
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
export const getMocSurveySnapshot = async (mocSurveyId: string) =>
  (await mutate<GetMocSurveySnapshotQuery>(getMocSurveySnapshotQuery, { mocSurveyId })).getMocSurveySnapshot;

// * CreateAnd MocSurvey Mutation
export type CreateAndOpenMocSurveyMutation = { createAndOpenMocSurvey: types.MocSurvey };
export const createAndOpenMocSurveyMutation = gql`
  ${types.mocSurveyFragment}
  mutation createAndOpenMocSurvey($data: MocSurveyInput!) {
    createAndOpenMocSurvey(data: $data) {
      ...mocSurveyFragment
    }
  }
`;
export const createAndOpenMocSurvey = async (data: types.MocSurveyInput) =>
  (await mutate<CreateAndOpenMocSurveyMutation>(createAndOpenMocSurveyMutation, { data })).createAndOpenMocSurvey;
