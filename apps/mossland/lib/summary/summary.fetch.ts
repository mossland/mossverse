import {
  BaseGql,
  Field,
  InputType,
  IntersectionType,
  ObjectType,
  cnst,
  createGraphQL,
  graphql,
  query,
} from "@util/client";
import { MocSurveySummary } from "../mocSurvey/mocSurvey.fetch";
import { UserSummary } from "../user/user.fetch";
import { fetch as decentverse } from "@decentverse/client";
import { fetch as platform } from "@platform/client";
import { fetch as shared } from "@shared/client";

export const summaries = [
  MocSurveySummary,
  ...decentverse.summaries,
  // ...social.summaries,
  ...platform.summaries,
  UserSummary,
] as any;
export interface SummaryInput
  extends shared.Summary,
    decentverse.Summary,
    // social.Summary,
    platform.Summary,
    MocSurveySummary {}

@InputType("SummaryInput")
export class SummaryInput extends summaries.reduce((acc, cur) => IntersectionType(acc, cur)) {}

@ObjectType("Summary", { _id: "id" })
export class Summary extends BaseGql(SummaryInput) {
  @Field(() => String)
  status: cnst.SummaryStatus;
}

@ObjectType("LightSummary", { _id: "id", gqlRef: "Summary" })
export class LightSummary extends Summary {}

export const summaryGraphQL = createGraphQL("summary" as const, Summary, SummaryInput, LightSummary);
export const {
  getSummary,
  listSummary,
  summaryCount,
  summaryExists,
  createSummary,
  updateSummary,
  removeSummary,
  summaryFragment,
  lightSummaryFragment,
  purifySummary,
  crystalizeSummary,
  lightCrystalizeSummary,
  defaultSummary,
  mergeSummary,
} = summaryGraphQL;

export type GetActiveSummaryQuery = { getActiveSummary: Summary };
export const getActiveSummaryQuery = graphql`
  ${summaryFragment}
  query getActiveSummary {
    getActiveSummary {
      ...summaryFragment
    }
  }
`;
export const getActiveSummary = async () =>
  (await query<GetActiveSummaryQuery>(getActiveSummaryQuery)).getActiveSummary;
