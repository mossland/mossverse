import { Global, Module, DynamicModule } from "@nestjs/common";
import { IpfsService } from "./ipfs.service";
import { IpfsOptions } from "../../option";

@Module({})
export class IpfsModule {
  static register(options?: IpfsOptions): DynamicModule {
    return {
      module: IpfsModule,
      providers: [{ provide: "IPFS_OPTIONS", useValue: options }, IpfsService],
      exports: [IpfsService],
    };
  }
}
