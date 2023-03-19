import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Notification from "./notification.model";
import { NotificationService } from "./notification.service";
import { NotificationResolver } from "./notification.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Notification.name, useFactory: Notification.middleware() }])],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
