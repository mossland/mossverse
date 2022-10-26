import { Global, Module, DynamicModule } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { ObjectStorageOptions } from "../../options";

@Module({})
export class S3Module {
  static register(options?: ObjectStorageOptions): DynamicModule {
    return {
      module: S3Module,
      providers: [
        {
          provide: "OBJECT_STORAGE_OPTIONS",
          useValue: options,
        },
        S3Service,
      ],
      exports: [S3Service],
    };
  }
}
