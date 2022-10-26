import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Admin from "./admin.model";
import { AdminService } from "./admin.service";
import { AdminResolver } from "./admin.resolver";
import { options } from "@shared/module";

@Global()
@Module({})
export class AdminModule {
  static register(options: options.SecurityOptions): DynamicModule {
    return {
      module: AdminModule,
      imports: [MongooseModule.forFeatureAsync([{ name: Admin.name, useFactory: Admin.middleware(options) }])],
      providers: [{ provide: "SECURITY_OPTIONS", useValue: options }, AdminService, AdminResolver],
      exports: [AdminService],
    };
  }
}
