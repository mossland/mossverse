import * as Admin from "./admin.document";
import { AdminEmployee } from "./admin.employee";
import { AdminResolver } from "./admin.endpoint";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { option } from "@shared/server";

@Global()
@Module({})
export class AdminModule {
  static register(options: option.SecurityOptions): DynamicModule {
    return {
      module: AdminModule,
      imports: [MongooseModule.forFeatureAsync([{ name: Admin.name, useFactory: Admin.middleware(options) }])],
      providers: [{ provide: "SECURITY_OPTIONS", useValue: options }, AdminEmployee, AdminResolver],
      exports: [AdminEmployee],
    };
  }
}
