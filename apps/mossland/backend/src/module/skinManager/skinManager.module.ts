import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SkinManagerService } from "./skinManager.service";
import { SkinManagerResolver } from "./skinManager.resolver";

@Global()
@Module({
  imports: [],
  providers: [SkinManagerService, SkinManagerResolver],
  exports: [SkinManagerService],
})
export class SkinManagerModule {}
