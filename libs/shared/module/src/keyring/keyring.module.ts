import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Keyring from "./keyring.model";
import { KeyringService } from "./keyring.service";
import { KeyringResolver } from "./keyring.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Keyring.name, useFactory: Keyring.middleware() }])],
  providers: [KeyringService, KeyringResolver],
  exports: [KeyringService],
})
export class KeyringModule {}
