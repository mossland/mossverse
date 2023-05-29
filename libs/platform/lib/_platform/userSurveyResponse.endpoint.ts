import * as cnst from "../cnst";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UserEmployee } from "../user/user.employee";
@Resolver(() => cnst.UserSurveyResponse)
export class UserSurveyResponseResolver {
  constructor(private readonly userEmployee: UserEmployee) {}
  @Query(() => cnst.UserSurveyResponse)
  async tempUserSurveyResponseQuery() {
    return null;
  }
  @ResolveField(() => cnst.shared.User)
  async user(@Parent() response: cnst.UserSurveyResponse) {
    return await this.userEmployee.load(response.user);
  }
}
