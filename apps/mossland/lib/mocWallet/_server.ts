import * as MocWallet from "./mocWallet.document";
import { Global, Module } from "@nestjs/common";
import { MocWalletResolver } from "./mocWallet.endpoint";
import { MocWalletEmployee } from "./mocWallet.employee";
import { MongooseModule } from "@nestjs/mongoose";
@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: MocWallet.name, useFactory: MocWallet.middleware() }])],
  providers: [MocWalletEmployee, MocWalletResolver],
  exports: [MocWalletEmployee],
})
export class MocWalletModule {}
