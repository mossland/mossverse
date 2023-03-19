import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Notification from "./notification.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class NotificationService extends LoadService<Notification.Mdl, Notification.Doc, Notification.Input> {
  constructor(
    @InjectModel(Notification.name)
    private readonly Notification: Notification.Mdl
  ) {
    super(NotificationService.name, Notification);
  }
  async summarize(): Promise<gql.NotificationSummary> {
    return {
      totalNotification: await this.Notification.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
