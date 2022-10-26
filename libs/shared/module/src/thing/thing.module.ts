import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Thing from "./thing.model";
import { ThingService } from "./thing.service";
import { ThingResolver } from "./thing.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Thing.name, useFactory: Thing.middleware() }])],
  providers: [ThingService, ThingResolver],
  exports: [ThingService],
})
export class ThingModule {}
