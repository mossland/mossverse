import { DynamicModule, Global, Module } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { SecurityResolver } from "./security.resolver";
import { SecurityOptions } from "../option";

@Global()
@Module({})
export class SecurityModule {
  static register(options?: SecurityOptions): DynamicModule {
    return {
      module: SecurityModule,
      providers: [{ provide: "SECURITY_OPTIONS", useValue: options }, SecurityService, SecurityResolver],
      exports: [SecurityService],
    };
  }
}
