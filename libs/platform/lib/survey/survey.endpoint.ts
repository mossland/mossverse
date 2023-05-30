import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver, Id, Signature } from "@util/server";
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { SurveyEmployee } from "./survey.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Survey)
export class SurveyResolver extends BaseResolver(cnst.Survey, cnst.SurveyInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(
    private readonly surveyEmployee: SurveyEmployee,
    private readonly contractEmployee: emp.shared.ContractEmployee,
    private readonly walletEmployee: emp.shared.WalletEmployee,
    private readonly snapshotEmployee: emp.SnapshotEmployee
  ) {
    super(surveyEmployee);
  }

  @Mutation(() => cnst.Survey)
  @UseGuards(Allow.User)
  async createAndOpenSurvey(@Args({ name: "data", type: () => cnst.SurveyInput }) data: cnst.SurveyInput) {
    return await this.surveyEmployee.createAndOpenSurvey(data);
  }
  @Mutation(() => cnst.Survey)
  @UseGuards(Allow.User)
  async generateSurvey(
    @Args({ name: "data", type: () => cnst.SurveyInput }) data: cnst.SurveyInput,
    @Signature() address: string
  ) {
    return await this.surveyEmployee.generateSurvey(data, address);
  }

  @Mutation(() => cnst.Survey)
  async openSurvey(@Args({ name: "surveyId", type: () => ID }) surveyId: string, @Signature() address: string) {
    return await this.surveyEmployee.openSurvey(new Id(surveyId), address);
  }
  @Mutation(() => cnst.Survey)
  async respondSurvey(
    @Args({ name: "surveyId", type: () => ID }) surveyId: string,
    @Args({ name: "response", type: () => cnst.SurveyResponseInput })
    response: cnst.SurveyResponseInput,
    @Signature() address: string
  ) {
    return await this.surveyEmployee.respondSurvey(new Id(surveyId), response, address);
  }
  @Query(() => cnst.Snapshot)
  async getSurveySnapshot(@Args({ type: () => ID, name: "surveyId" }) surveyId: string) {
    const survey = await this.surveyEmployee.get(new Id(surveyId));
    return await this.snapshotEmployee.load(survey.snapshot);
  }

  @ResolveField(() => cnst.shared.Contract)
  async contract(@Parent() survey: cnst.Survey) {
    return await this.contractEmployee.load(survey.contract);
  }

  @ResolveField(() => cnst.shared.Wallet)
  async creator(@Parent() survey: cnst.Survey) {
    return await this.walletEmployee.load(survey.creator);
  }
}
