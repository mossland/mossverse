import { Resolver, Query, Mutation, Args, ResolveField, Parent, ID } from "@nestjs/graphql";
import { UseGuards, Logger } from "@nestjs/common";
import { Allow, Account, BaseResolver, Id, Signature, Auth } from "@shared/util-server";
import { MocSurveyService } from "./mocSurvey.service";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.MocSurvey)
export class MocSurveyResolver extends BaseResolver(
  gql.MocSurvey,
  gql.MocSurveyInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly mocSurveyService: MocSurveyService,
    private readonly thingService: srv.shared.ThingService,
    private readonly userService: srv.UserService
  ) {
    super(mocSurveyService);
  }

  @Mutation(() => gql.MocSurvey)
  @UseGuards(Allow.User)
  async generateMocSurvey(
    @Args({ name: "data", type: () => gql.MocSurveyInput }) data: gql.MocSurveyInput,
    @Signature() address: string
  ) {
    return await this.mocSurveyService.generateMocSurvey(data);
  }

  @Mutation(() => gql.MocSurvey)
  @UseGuards(Allow.Admin)
  async openMocSurvey(@Args({ name: "mocSurveyId", type: () => ID }) mocSurveyId: string, @Auth() account: Account) {
    return await this.mocSurveyService.openMocSurvey(new Id(mocSurveyId), new Id(account.keyring));
  }
  @Mutation(() => gql.MocSurvey)
  async respondMocSurvey(
    @Args({ name: "mocSurveyId", type: () => ID }) mocSurveyId: string,
    @Args({ name: "response", type: () => gql.platform.UserSurveyResponseInput })
    response: gql.platform.UserSurveyResponseInput,
    @Auth() account: Account
  ) {
    return await this.mocSurveyService.respondMocSurvey(new Id(mocSurveyId), response, new Id(account.keyring));
  }

  @ResolveField(() => gql.shared.User)
  async creator(@Parent() mocSurvey: gql.MocSurvey) {
    return await this.userService.load(mocSurvey.creator);
  }

  @ResolveField(() => gql.shared.Thing)
  async thing(@Parent() mocSurvey: gql.MocSurvey) {
    return await this.thingService.load(mocSurvey.thing);
  }
}
