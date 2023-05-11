import { DynamicModule, Global, Module } from "@nestjs/common";
import * as option from "./option";
import { registerModules, registerBatches } from "./module";

@Global()
@Module({})
export class AppModule {
  static register(options: option.ModulesOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [...registerModules(options)],
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
      imports: [...registerModules(options), ...registerBatches(options)],
      controllers: [],
      providers: [],
    };
  }
}
