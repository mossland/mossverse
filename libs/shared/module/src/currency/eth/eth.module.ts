import { DynamicModule, Global, Module } from "@nestjs/common";
import * as option from "../../option";
import { EthService } from "./eth.service";

@Global()
@Module({})
export class EthModule {
  static register(options: option.EtherOptions): DynamicModule {
    return {
      module: EthModule,
      providers: [
        {
          provide: "ETHER_OPTIONS",
          useValue: options,
        },
        EthService,
      ],
      exports: [EthService],
    };
  }
}
