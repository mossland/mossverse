import * as Asset from "./asset.document";
import { AssetResolver } from "./asset.endpoint";
import { AssetEmployee } from "./asset.employee";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Asset.name, useFactory: Asset.middleware() }])],
  providers: [AssetEmployee, AssetResolver],
  exports: [AssetEmployee],
})
export class AssetModule {}
