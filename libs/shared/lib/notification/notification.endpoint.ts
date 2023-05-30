import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { FileEmployee } from "../file/file.employee";
import { NotificationEmployee } from "./notification.employee";
import { Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.Notification)
export class NotificationResolver extends BaseResolver(
  cnst.Notification,
  cnst.NotificationInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly notificationEmployee: NotificationEmployee,
    private readonly fileEmployee: FileEmployee
  ) {
    super(notificationEmployee);
  }
}
