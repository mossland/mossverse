import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { SnapshotService } from "./snapshot.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Snapshot)
export class SnapshotResolver extends BaseResolver(gql.Snapshot, gql.SnapshotInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(private readonly snapshotService: SnapshotService, private readonly fileService: srv.shared.FileService) {
    super(snapshotService);
  }
}
