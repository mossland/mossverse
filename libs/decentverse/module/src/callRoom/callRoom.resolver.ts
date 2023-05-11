import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { CallRoomService } from "./callRoom.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.CallRoom)
export class CallRoomResolver extends BaseResolver(
  gql.CallRoom,
  gql.CallRoomInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly callRoomService: CallRoomService,
    private readonly fileService: srv.shared.FileService,
    private readonly mapService: srv.MapService
  ) {
    super(callRoomService);
  }
  @ResolveField(() => gql.Map)
  async map(@Parent() callRoom: gql.CallRoom) {
    return await this.mapService.load(callRoom.map);
  }
}
