import * as Notification from "./notification.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class NotificationEmployee extends LoadService<Notification.Mdl, Notification.Doc, Notification.Input> {
  constructor(
    @InjectModel(Notification.name)
    private readonly Notification: Notification.Mdl
  ) {
    super(NotificationEmployee.name, Notification);
  }
  async summarize(): Promise<cnst.NotificationSummary> {
    return {
      totalNotification: await this.Notification.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
