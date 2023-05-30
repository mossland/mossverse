import * as cnst from "../cnst";
import * as emp from "../emp";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.Entry)
export class EntryResolver {
  constructor(private readonly userEmployee: emp.shared.UserEmployee) {}

  @ResolveField(() => cnst.shared.User)
  async user(@Parent() entry: cnst.Entry) {
    return await this.userEmployee.load(entry.user);
  }
}
