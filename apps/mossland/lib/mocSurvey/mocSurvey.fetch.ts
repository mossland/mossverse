import {
  BaseGql,
  Field,
  Float,
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
import { MocOwnership, UserSurveyResponse, UserSurveyResponseInput } from "../_mossland/mossland.fetch";
import { fetch as shared } from "@shared/client";
import dayjs, { Dayjs } from "dayjs";

@InputType("MocSurveyInput")
export class MocSurveyInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => [String])
  selections: string[];

  @Field(() => shared.User)
  creator: shared.User;

  @Field(() => String, { default: "objective" })
  type: cnst.SurveyType;

  @Field(() => [String])
  policy: cnst.SurveyPolicy[];

  @Field(() => Date)
  closeAt: Dayjs;

  @Field(() => Date)
  openAt: Dayjs;
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
  snapshotAt: Dayjs;

  @Field(() => String)
  status: cnst.SurveyStatus;

  isActive(self: shared.User) {
    return this.status === "surveying" && !this.isVoted(self) && this.isExpired();
  }

  isVoted(self: shared.User) {
    return this.responses.some((response) => response.user.id === self.id);
  }

  isExpired() {
    return this.closeAt.isBefore(dayjs());
  }

  static creatable(mocSurvey: MocSurvey) {
    return !!(
      mocSurvey.title.length > 0 &&
      mocSurvey.openAt &&
      mocSurvey.closeAt &&
      ((mocSurvey.type === "objective" &&
        mocSurvey.selections.length > 1 &&
        mocSurvey.selections.every((selection) => selection.length > 2)) ||
        (mocSurvey.type === "subjective" && mocSurvey.description.length > 2))
    );
  }
}

@ObjectType("LightMocSurvey", { _id: "id", gqlRef: "MocSurvey" })
export class LightMocSurvey extends PickType(MocSurvey, [
  "title",
  "type",
  "responses",
  "status",
  "openAt",
  "closeAt",
] as const) {}

@ObjectType("MocSurveySummary")
export class MocSurveySummary {
  @Field(() => Int)
  totalMocSurvey: number;

  @Field(() => Int)
  appliedMocSurvey: number;

  @Field(() => Int)
  surveyingMocSurvey: number;

  @Field(() => Int)
  closedMocSurvey: number;
}

export const mocSurveyQueryMap = {
  totalMocSurvey: { status: { $ne: "inactive" } },
  appliedMocSurvey: { status: "applied" },
  surveyingMocSurvey: { status: "surveying" },
  closedMocSurvey: { status: "closed" },
};

export const mocSurveyGraphQL = createGraphQL("mocSurvey" as const, MocSurvey, MocSurveyInput, LightMocSurvey);
export const {
  getMocSurvey,
  listMocSurvey,
  mocSurveyCount,
  mocSurveyExists,
  createMocSurvey,
  updateMocSurvey,
  removeMocSurvey,
  mocSurveyFragment,
  lightMocSurveyFragment,
  purifyMocSurvey,
  crystalizeMocSurvey,
  lightCrystalizeMocSurvey,
  defaultMocSurvey,
  mergeMocSurvey,
  initMocSurvey,
  viewMocSurvey,
  editMocSurvey,
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
export const generateMocSurvey = async (data: InputOf<MocSurveyInput>) =>
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
  crystalizeMocSurvey(
    (
      await mutate<RespondMocSurveyMutation>(respondMocSurveyMutation, {
        mocSurveyId,
        response,
      })
    ).respondMocSurvey
  );

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
  (
    await mutate<CloseMocSurveyMutation>(closeMocSurveyMutation, {
      mocSurveyId,
    })
  ).closeMocSurvey;

export type GetMocSurveySnapshotQuery = {
  getMocSurveySnapshot: MocOwnership[];
};
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
  (
    await mutate<GetMocSurveySnapshotQuery>(getMocSurveySnapshotQuery, {
      mocSurveyId,
    })
  ).getMocSurveySnapshot;

// * CreateAnd MocSurvey Mutation
export type CreateAndOpenMocSurveyMutation = {
  createAndOpenMocSurvey: MocSurvey;
};
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
