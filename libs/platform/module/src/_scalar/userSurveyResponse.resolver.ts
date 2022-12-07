import { Resolver, ResolveField, Parent, Int, Query } from "@nestjs/graphql";
import { UserService } from "../user/user.service";
import * as gql from "../gql";
@Resolver(() => gql.UserSurveyResponse)
export class UserSurveyResponseResolver {
  constructor(private readonly userService: UserService) {}
  @Query(()=> gql.UserSurveyResponse)
  async tempUserSurveyResponseQuery(){
    return null;
  }
  @ResolveField(() => gql.shared.User)
  async user(@Parent() response: gql.UserSurveyResponse) {
    return await this.userService.load(response.user);
  }
}
