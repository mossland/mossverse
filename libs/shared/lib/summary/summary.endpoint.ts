import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { Query, Resolver } from "@nestjs/graphql";
import { SummaryEmployee } from "./summary.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Summary)
export class SummaryResolver extends BaseResolver(
  cnst.Summary,
  cnst.SummaryInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly summaryEmployee: SummaryEmployee) {
    super(summaryEmployee);
  }
  @Query(() => cnst.Summary)
  @UseGuards(Allow.Public)
  async getActiveSummary() {
    return await this.summaryEmployee.getActiveSummary();
  }
}
