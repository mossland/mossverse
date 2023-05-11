import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Ownership from "./ownership.model";
import { OwnershipService } from "./ownership.service";
import { OwnershipResolver } from "./ownership.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Ownership.name, useFactory: Ownership.middleware() }])],
  providers: [OwnershipService, OwnershipResolver],
  exports: [OwnershipService],
})
export class OwnershipModule {}
