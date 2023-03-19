import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Tile from "./tile.model";
import { TileService } from "./tile.service";
import { TileResolver } from "./tile.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Tile.name, useFactory: Tile.middleware() }])],
  providers: [TileService, TileResolver],
  exports: [TileService],
})
export class TileModule {}
