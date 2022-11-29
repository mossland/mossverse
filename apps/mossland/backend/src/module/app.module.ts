import { DynamicModule, Global, Module } from "@nestjs/common";
import * as option from "./option";
import * as module from "./module";
@Global()
@Module({})
export class AppModule {
  static register(options: option.ModulesOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [...module.registerModules(options)],
      controllers: [],
      providers: [],
    };
  }
}
