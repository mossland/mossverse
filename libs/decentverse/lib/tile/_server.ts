import * as Tile from "./tile.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TileResolver } from "./tile.endpoint";
import { TileEmployee } from "./tile.employee";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Tile.name, useFactory: Tile.middleware() }])],
  providers: [TileEmployee, TileResolver],
  exports: [TileEmployee],
})
export class TileModule {}
