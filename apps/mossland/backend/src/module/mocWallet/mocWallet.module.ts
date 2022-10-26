import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as MocWallet from "./mocWallet.model";
import { MocWalletService } from "./mocWallet.service";
import { MocWalletResolver } from "./mocWallet.resolver";
@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: MocWallet.name, useFactory: MocWallet.middleware() }])],
  providers: [MocWalletService, MocWalletResolver],
  exports: [MocWalletService],
})
export class MocWalletModule {}
