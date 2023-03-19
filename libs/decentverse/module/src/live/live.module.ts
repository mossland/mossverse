import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Live from "./live.model";
import { LiveService } from "./live.service";
import { LiveResolver } from "./live.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Live.name, useFactory: Live.middleware() }])],
  providers: [LiveService, LiveResolver],
  exports: [LiveService],
})
export class LiveModule {}
