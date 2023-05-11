import { Resolver, Query, Mutation, Args, Parent, ResolveField, ID } from "@nestjs/graphql";
import { SummaryService } from "./summary.service";
import { Allow, Account, BaseResolver, Auth } from "@shared/util-server";

import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.shared.Summary)
export class SummaryResolver {
  constructor(private readonly summaryService: SummaryService) {}
}
