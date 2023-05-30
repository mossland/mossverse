import * as Notification from "./notification.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationEmployee } from "./notification.employee";
import { NotificationResolver } from "./notification.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Notification.name, useFactory: Notification.middleware() }])],
  providers: [NotificationEmployee, NotificationResolver],
  exports: [NotificationEmployee],
})
export class NotificationModule {}
