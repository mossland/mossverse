import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Collision from "./collision.model";
import { CollisionService } from "./collision.service";
import { CollisionResolver } from "./collision.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Collision.name, useFactory: Collision.middleware() }])],
  providers: [CollisionService, CollisionResolver],
  exports: [CollisionService],
})
export class CollisionModule {}
