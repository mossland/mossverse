import * as cnst from "../cnst";
import * as emp from "../emp";
import { Account, Allow, Auth, BaseResolver, Id, Signature } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { MocSurveyEmployee } from "./mocSurvey.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.MocSurvey)
export class MocSurveyResolver extends BaseResolver(
  cnst.MocSurvey,
  cnst.MocSurveyInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly mocSurveyEmployee: MocSurveyEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee,
    private readonly userEmployee: emp.UserEmployee
  ) {
    super(mocSurveyEmployee);
  }

  @Mutation(() => cnst.MocSurvey)
  @UseGuards(Allow.User)
  async createMocSurvey(
    @Args({ name: "data", type: () => cnst.MocSurveyInput })
    data: cnst.MocSurveyInput,
    @Signature() address: string
  ) {
    return await this.mocSurveyEmployee.generateMocSurvey(data);
  }
  @Mutation(() => cnst.MocSurvey)
  @UseGuards(Allow.User)
  async generateMocSurvey(
    @Args({ name: "data", type: () => cnst.MocSurveyInput })
    data: cnst.MocSurveyInput,
    @Signature() address: string
  ) {
    return await this.mocSurveyEmployee.generateMocSurvey(data);
  }

  @Mutation(() => cnst.MocSurvey)
  @UseGuards(Allow.Admin)
  async openMocSurvey(@Args({ name: "mocSurveyId", type: () => ID }) mocSurveyId: string, @Auth() account: Account) {
    return await this.mocSurveyEmployee.openMocSurvey(new Id(mocSurveyId), new Id(account.keyring));
  }
  @Mutation(() => cnst.MocSurvey)
  async respondMocSurvey(
    @Args({ name: "mocSurveyId", type: () => ID }) mocSurveyId: string,
    @Args({
      name: "response",
      type: () => cnst.platform.UserSurveyResponseInput,
    })
    response: cnst.platform.UserSurveyResponseInput,
    @Auth() account: Account
  ) {
    return await this.mocSurveyEmployee.respondMocSurvey(new Id(mocSurveyId), response, new Id(account.keyring));
  }

  @ResolveField(() => cnst.shared.User)
  async creator(@Parent() mocSurvey: cnst.MocSurvey) {
    return await this.userEmployee.load(mocSurvey.creator);
  }

  @ResolveField(() => cnst.shared.Thing)
  async thing(@Parent() mocSurvey: cnst.MocSurvey) {
    return await this.thingEmployee.load(mocSurvey.thing);
  }
}
