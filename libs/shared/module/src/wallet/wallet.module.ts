import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Wallet from "./wallet.model";
import { WalletService } from "./wallet.service";
import { WalletResolver } from "./wallet.resolver";
@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Wallet.name, useFactory: Wallet.middleware() }])],
  providers: [WalletService, WalletResolver],
  exports: [WalletService],
})
export class WalletModule {}
