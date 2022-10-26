import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PointService } from "./point.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
// import * as db from "../db";
// import * as gql from "../gql";
// import * as srv from "../srv";

@Resolver()
export class PointResolver {
  constructor(private readonly pointService: PointService) {}
}
