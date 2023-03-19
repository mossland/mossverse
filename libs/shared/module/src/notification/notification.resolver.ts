import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { NotificationService } from "./notification.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { FileService } from "../file/file.service";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Notification)
export class NotificationResolver extends BaseResolver(
  gql.Notification,
  gql.NotificationInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly notificationService: NotificationService, private readonly fileService: FileService) {
    super(notificationService);
  }
}
