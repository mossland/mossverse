import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Teleport from "./teleport.model";
import { TeleportService } from "./teleport.service";
import { TeleportResolver } from "./teleport.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Teleport.name, useFactory: Teleport.middleware() }])],
  providers: [TeleportService, TeleportResolver],
  exports: [TeleportService],
})
export class TeleportModule {}
