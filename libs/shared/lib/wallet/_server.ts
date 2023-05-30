import * as Wallet from "./wallet.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WalletEmployee } from "./wallet.employee";
import { WalletResolver } from "./wallet.endpoint";
@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Wallet.name, useFactory: Wallet.middleware() }])],
  providers: [WalletEmployee, WalletResolver],
  exports: [WalletEmployee],
})
export class WalletModule {}
