import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Role from "./role.model";
import { RoleService } from "./role.service";
import { RoleResolver } from "./role.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Role.name, useFactory: Role.middleware() }])],
  providers: [RoleService, RoleResolver],
  exports: [RoleService],
})
export class RoleModule {}
