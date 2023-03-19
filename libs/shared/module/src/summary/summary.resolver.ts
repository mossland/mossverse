import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { SummaryService } from "./summary.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Summary)
export class SummaryResolver extends BaseResolver(
  gql.Summary,
  gql.SummaryInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly summaryService: SummaryService) {
    super(summaryService);
  }
  @Query(() => gql.Summary)
  @UseGuards(Allow.Public)
  async getActiveSummary() {
    return await this.summaryService.getActiveSummary();
  }
}
