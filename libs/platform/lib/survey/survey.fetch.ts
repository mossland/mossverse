import {
  BaseGql,
  Field,
  InputOf,
  InputType,
  Int,
  ObjectType,
  PickType,
  cnst,
  createGraphQL,
  graphql,
  mutate,
} from "@util/client";
import { Ownership, SurveyResponse, SurveyResponseInput } from "../_platform/platform.fetch";
import { fetch as shared } from "@shared/client";
import dayjs, { Dayjs } from "dayjs";

@InputType("SurveyInput")
export class SurveyInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => [String])
  selections: string[];

  @Field(() => shared.Contract)
  contract: shared.Contract;

  @Field(() => shared.Wallet)
  creator: shared.Wallet;

  @Field(() => String)
  type: cnst.SurveyType;

  @Field(() => [String])
  policy: cnst.SurveyPolicy[];

  @Field(() => Date)
  closeAt: Dayjs;

  @Field(() => Date)
  openAt: Dayjs;
}

@ObjectType("Survey", { _id: "id" })
export class Survey extends BaseGql(SurveyInput) {
  @Field(() => [SurveyResponse])
  responses: SurveyResponse[];

  @Field(() => Int)
  walletNum: number;

  @Field(() => Int)
  tokenNum: number;

  @Field(() => [Int])
  selectTokenNum: number[];

  @Field(() => [Int])
  selectWalletNum: number[];

  @Field(() => Date)
  snapshotAt: Dayjs;

  @Field(() => String)
  status: cnst.SurveyStatus;

  isActive() {
    return this.status === "surveying" && this.closeAt.isAfter(dayjs());
  }
}

@ObjectType("LightSurvey", { _id: "id", gqlRef: "Survey" })
export class LightSurvey extends PickType(Survey, ["status"] as const) {}

@ObjectType("SurveySummary")
export class SurveySummary {
  @Field(() => Int)
  totalSurvey: number;
}

export const surveyGraphQL = createGraphQL("survey" as const, Survey, SurveyInput, LightSurvey);
export const {
  getSurvey,
  listSurvey,
  surveyCount,
  surveyExists,
  createSurvey,
  updateSurvey,
  removeSurvey,
  surveyFragment,
  purifySurvey,
  crystalizeSurvey,
  lightCrystalizeSurvey,
  defaultSurvey,
  mergeSurvey,
} = surveyGraphQL;

// * Generate Survey Mutation
export type GenerateSurveyMutation = { generateSurvey: Survey };
export const generateSurveyMutation = graphql`
  ${surveyFragment}
  mutation generateSurvey($data: SurveyInput!) {
    generateSurvey(data: $data) {
      ...surveyFragment
    }
  }
`;
export const generateSurvey = async (data: SurveyInput) =>
  (await mutate<GenerateSurveyMutation>(generateSurveyMutation, { data })).generateSurvey;

// * Update Survey Mutation
export type UpdateSurveyMutation = { updateSurvey: Survey };
export const updateSurveyMutation = graphql`
  ${surveyFragment}
  mutation updateSurvey($surveyId: ID!, $data: SurveyInput!) {
    updateSurvey(surveyId: $surveyId, data: $data) {
      ...surveyFragment
    }
  }
`;

// * Open Survey Mutation
export type OpenSurveyMutation = { openSurvey: Survey };
export const openSurveyMutation = graphql`
  ${surveyFragment}
  mutation openSurvey($surveyId: ID!, $data: SurveyInput!) {
    openSurvey(surveyId: $surveyId, data: $data) {
      ...surveyFragment
    }
  }
`;
export const openSurvey = async (surveyId: string) =>
  (await mutate<OpenSurveyMutation>(openSurveyMutation, { surveyId })).openSurvey;

// * Respond Survey Mutation
export type RespondSurveyMutation = { respondSurvey: Survey };
export const respondSurveyMutation = graphql`
  ${surveyFragment}
  mutation respondSurvey($surveyId: ID!, $response: SurveyResponseInput!) {
    respondSurvey(surveyId: $surveyId, response: $response) {
      ...surveyFragment
    }
  }
`;
export const respondSurvey = async (surveyId: string, response: InputOf<SurveyResponseInput>) =>
  (
    await mutate<RespondSurveyMutation>(respondSurveyMutation, {
      surveyId,
      response,
    })
  ).respondSurvey;

// * Close Survey Mutation
export type CloseSurveyMutation = { closeSurvey: Survey };
export const closeSurveyMutation = graphql`
  ${surveyFragment}
  mutation closeSurvey($surveyId: ID!) {
    closeSurvey(surveyId: $surveyId) {
      ...surveyFragment
    }
  }
`;
export const closeSurvey = async (surveyId: string) =>
  (await mutate<CloseSurveyMutation>(closeSurveyMutation, { surveyId })).closeSurvey;

export type GetSurveySnapshotQuery = { getSurveySnapshot: Ownership[] };
export const getSurveySnapshotQuery = graphql`
  ${shared.tokenFragment}
  ${shared.walletFragment}
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
export type CreateAndOpenSurveyMutation = { createAndOpenSurvey: Survey };
export const createAndOpenSurveyMutation = graphql`
  ${surveyFragment}
  mutation createAndOpenSurvey($data: SurveyInput!) {
    createAndOpenSurvey(data: $data) {
      ...surveyFragment
    }
  }
`;
export const createAndOpenSurvey = async (data: SurveyInput) =>
  (
    await mutate<CreateAndOpenSurveyMutation>(createAndOpenSurveyMutation, {
      data,
    })
  ).createAndOpenSurvey;
