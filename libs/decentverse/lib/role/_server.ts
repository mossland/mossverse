import * as Role from "./role.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleResolver } from "./role.endpoint";
import { RoleEmployee } from "./role.employee";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Role.name, useFactory: Role.middleware() }])],
  providers: [RoleEmployee, RoleResolver],
  exports: [RoleEmployee],
})
export class RoleModule {}
