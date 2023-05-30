import { DynamicModule, Global, Module } from "@nestjs/common";
import { SecurityEmployee } from "./security.employee";
import { SecurityOptions } from "../option";
import { SecurityResolver } from "./security.endpoint";

@Global()
@Module({})
export class SecurityModule {
  static register(options?: SecurityOptions): DynamicModule {
    return {
      module: SecurityModule,
      providers: [{ provide: "SECURITY_OPTIONS", useValue: options }, SecurityEmployee, SecurityResolver],
      exports: [SecurityEmployee],
    };
  }
}
