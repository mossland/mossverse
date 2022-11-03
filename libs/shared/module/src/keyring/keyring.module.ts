import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Keyring from "./keyring.model";
import { KeyringService } from "./keyring.service";
import { KeyringResolver } from "./keyring.resolver";
import { options } from "@shared/module";

@Global()
@Module({})
export class KeyringModule {
  static register(options: options.SecurityOptions): DynamicModule {
    return {
      module: KeyringModule,
      imports: [MongooseModule.forFeatureAsync([{ name: Keyring.name, useFactory: Keyring.middleware(options) }])],
      providers: [{ provide: "SECURITY_OPTIONS", useValue: options }, KeyringService, KeyringResolver],
      exports: [KeyringService],
    };
  }
}
