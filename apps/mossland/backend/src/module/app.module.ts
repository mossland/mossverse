import { DynamicModule, Global, Module } from "@nestjs/common";
import * as options from "./options";
import * as modules from "./modules";
@Global()
@Module({})
export class AppModule {
  static register(options: options.ModulesOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [...modules.registerModules(options)],
      controllers: [],
      providers: [],
    };
  }
}
