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

@Global()
@Module({})
export class BatchAppModule {
  static register(options: option.ModulesOptions): DynamicModule {
    return {
      module: BatchAppModule,
      imports: [...module.registerModules(options), ...module.registerBatches(options)],
      controllers: [],
      providers: [],
    };
  }
}
