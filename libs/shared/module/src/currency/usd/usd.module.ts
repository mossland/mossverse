import { DynamicModule, Global, Module } from "@nestjs/common";
import * as option from "../../option";
import { UsdService } from "./usd.service";

@Global()
@Module({})
export class UsdModule {
  static register(options: option.EtherOptions): DynamicModule {
    return {
      module: UsdModule,
      providers: [
        {
          provide: "ETHER_OPTIONS",
          useValue: options,
        },
        UsdService,
      ],
      exports: [UsdService],
    };
  }
}
