import * as Ownership from "./ownership.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OwnershipEmployee } from "./ownership.employee";
import { OwnershipResolver } from "./ownership.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Ownership.name, useFactory: Ownership.middleware() }])],
  providers: [OwnershipEmployee, OwnershipResolver],
  exports: [OwnershipEmployee],
})
export class OwnershipModule {}
