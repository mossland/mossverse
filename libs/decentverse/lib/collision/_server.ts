import * as Collision from "./collision.document";
import { CollisionResolver } from "./collision.endpoint";
import { CollisionEmployee } from "./collision.employee";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Collision.name, useFactory: Collision.middleware() }])],
  providers: [CollisionEmployee, CollisionResolver],
  exports: [CollisionEmployee],
})
export class CollisionModule {}
