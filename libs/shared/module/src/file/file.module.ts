import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StorageOptions } from "../options";
import * as File from "./file.model";
import { FileService } from "./file.service";
import { S3Module } from "./s3/s3.module";
import { IpfsModule } from "./ipfs/ipfs.module";

@Global()
@Module({})
export class FileModule {
  static register(options: StorageOptions): DynamicModule {
    return {
      module: FileModule,
      imports: [
        MongooseModule.forFeatureAsync([{ name: File.name, useFactory: File.middleware() }]),
        options.objectStorage && S3Module.register(options.objectStorage),
        options.ipfs && IpfsModule.register(options.ipfs),
      ].filter((module) => !!module) as DynamicModule[],
      providers: [
        {
          provide: "STORAGE_OPTIONS",
          useValue: options,
        },
        FileService,
      ],
      exports: [FileService],
    };
  }
}
