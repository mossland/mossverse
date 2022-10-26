import { Resolver, Query, Mutation, Args, ResolveField, Parent, ID } from "@nestjs/graphql";
import { UseGuards, Logger } from "@nestjs/common";
import { Allow, Account, BaseResolver, Id, Signature } from "@shared/util-server";
import { SurveyService } from "./survey.service";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.Survey)
export class SurveyResolver extends BaseResolver(gql.Survey, gql.SurveyInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly contractService: srv.shared.ContractService,
    private readonly walletService: srv.shared.WalletService
  ) {
    super(surveyService);
  }

  @Mutation(() => gql.Survey)
  @UseGuards(Allow.User)
  async createAndOpenSurvey(@Args({ name: "data", type: () => gql.SurveyInput }) data: gql.SurveyInput) {
    return await this.surveyService.createAndOpenSurvey(data);
  }
  @Mutation(() => gql.Survey)
  @UseGuards(Allow.User)
  async generateSurvey(
    @Args({ name: "data", type: () => gql.SurveyInput }) data: gql.SurveyInput,
    @Signature() address: string
  ) {
    return await this.surveyService.generateSurvey(data, address);
  }

  @Mutation(() => gql.Survey)
  async openSurvey(@Args({ name: "surveyId", type: () => ID }) surveyId: string, @Signature() address: string) {
    return await this.surveyService.openSurvey(new Id(surveyId), address);
  }
  @Mutation(() => gql.Survey)
  async respondSurvey(
    @Args({ name: "surveyId", type: () => ID }) surveyId: string,
    @Args({ name: "response", type: () => gql.SurveyResponseInput }) response: gql.SurveyResponseInput,
    @Signature() address: string
  ) {
    return await this.surveyService.respondSurvey(new Id(surveyId), response, address);
  }
  @Query(() => [gql.shared.Ownership])
  async getSurveySnapshot(@Args({ type: () => ID, name: "surveyId" }) surveyId: string) {
    return await this.surveyService.getSnapshot(new Id(surveyId));
  }

  @ResolveField(() => gql.shared.Contract)
  async contract(@Parent() survey: gql.Survey) {
    return await this.contractService.load(survey.contract);
  }

  @ResolveField(() => gql.shared.Wallet)
  async creator(@Parent() survey: gql.Survey) {
    return await this.walletService.load(survey.creator);
  }
}
