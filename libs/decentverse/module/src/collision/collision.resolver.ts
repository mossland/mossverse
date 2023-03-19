import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { CollisionService } from "./collision.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Collision)
export class CollisionResolver extends BaseResolver(
  gql.Collision,
  gql.CollisionInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly collisionService: CollisionService,
    private readonly fileService: srv.shared.FileService,
    private readonly mapService: srv.MapService
  ) {
    super(collisionService);
  }
  @ResolveField(() => gql.Map)
  async map(@Parent() collision: gql.Collision) {
    return await this.mapService.load(collision.map);
  }
}
