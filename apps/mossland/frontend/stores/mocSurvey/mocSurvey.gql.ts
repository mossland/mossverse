import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  Float,
  Int,
  InputOf,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { gql as platform } from "@platform/data-access";
import { MocOwnership, UserSurveyResponse, UserSurveyResponseInput } from "../_scalar/scalar.gql";

@InputType("MocSurveyInput")
export class MocSurveyInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => [String])
  selections: string[];

  @Field(() => platform.User)
  creator: platform.User;

  @Field(() => String, { default: "objective" })
  type: cnst.SurveyType;

  @Field(() => [String])
  policy: cnst.SurveyPolicy[];

  @Field(() => Date)
  closeAt: Date;

  @Field(() => Date)
  openAt: Date;
}

@ObjectType("MocSurvey", { _id: "id" })
export class MocSurvey extends BaseGql(MocSurveyInput) {
  @Field(() => [UserSurveyResponse])
  responses: UserSurveyResponse[];

  @Field(() => shared.Thing)
  thing: shared.Thing;

  @Field(() => Float)
  mocNum: number;

  @Field(() => Int)
  userNum: number;

  @Field(() => [Float])
  selectMocNum: number[];

  @Field(() => Int)
  selectUserNum: number[];

  @Field(() => Date)
  snapshotAt: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  status: cnst.SurveyStatus;
}

export const mocSurveyGraphQL = createGraphQL<"mocSurvey", MocSurvey, MocSurveyInput>(MocSurvey, MocSurveyInput);
export const {
  getMocSurvey,
  listMocSurvey,
  mocSurveyCount,
  mocSurveyExists,
  createMocSurvey,
  updateMocSurvey,
  removeMocSurvey,
  mocSurveyFragment,
  purifyMocSurvey,
  defaultMocSurvey,
} = mocSurveyGraphQL;

// * Generate MocSurvey Mutation
export type GenerateMocSurveyMutation = { generateMocSurvey: MocSurvey };
export const generateMocSurveyMutation = graphql`
  ${mocSurveyFragment}
  mutation generateMocSurvey($data: MocSurveyInput!) {
    generateMocSurvey(data: $data) {
      ...mocSurveyFragment
    }
  }
`;
export const generateMocSurvey = async (data: MocSurveyInput) =>
  (await mutate<GenerateMocSurveyMutation>(generateMocSurveyMutation, { data })).generateMocSurvey;

// * Open MocSurvey Mutation
export type OpenMocSurveyMutation = { openMocSurvey: MocSurvey };
export const openMocSurveyMutation = graphql`
  ${mocSurveyFragment}
  mutation openMocSurvey($mocSurveyId: ID!) {
    openMocSurvey(mocSurveyId: $mocSurveyId) {
      ...mocSurveyFragment
    }
  }
`;
export const openMocSurvey = async (mocSurveyId: string) =>
  (await mutate<OpenMocSurveyMutation>(openMocSurveyMutation, { mocSurveyId })).openMocSurvey;

// * Respond MocSurvey Mutation
export type RespondMocSurveyMutation = { respondMocSurvey: MocSurvey };
export const respondMocSurveyMutation = graphql`
  ${mocSurveyFragment}
  mutation respondMocSurvey($mocSurveyId: ID!, $response: UserSurveyResponseInput!) {
    respondMocSurvey(mocSurveyId: $mocSurveyId, response: $response) {
      ...mocSurveyFragment
    }
  }
`;
export const respondMocSurvey = async (mocSurveyId: string, response: InputOf<UserSurveyResponseInput>) =>
  (await mutate<RespondMocSurveyMutation>(respondMocSurveyMutation, { mocSurveyId, response })).respondMocSurvey;

// * Close MocSurvey Mutation
export type CloseMocSurveyMutation = { closeMocSurvey: MocSurvey };
export const closeMocSurveyMutation = graphql`
  ${mocSurveyFragment}
  mutation closeMocSurvey($mocSurveyId: ID!) {
    closeMocSurvey(mocSurveyId: $mocSurveyId) {
      ...mocSurveyFragment
    }
  }
`;

export const closeMocSurvey = async (mocSurveyId: string) =>
  (await mutate<CloseMocSurveyMutation>(closeMocSurveyMutation, { mocSurveyId })).closeMocSurvey;

export type GetMocSurveySnapshotQuery = { getMocSurveySnapshot: MocOwnership[] };
export const getMocSurveySnapshotQuery = graphql`
  ${shared.tokenFragment}
  ${shared.walletFragment}
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
export type CreateAndOpenMocSurveyMutation = { createAndOpenMocSurvey: MocSurvey };
export const createAndOpenMocSurveyMutation = graphql`
  ${mocSurveyFragment}
  mutation createAndOpenMocSurvey($data: MocSurveyInput!) {
    createAndOpenMocSurvey(data: $data) {
      ...mocSurveyFragment
    }
  }
`;
export const createAndOpenMocSurvey = async (data: MocSurveyInput) =>
  (await mutate<CreateAndOpenMocSurveyMutation>(createAndOpenMocSurveyMutation, { data })).createAndOpenMocSurvey;
