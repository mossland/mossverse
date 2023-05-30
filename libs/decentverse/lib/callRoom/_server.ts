import * as CallRoom from "./callRoom.document";
import { CallRoomResolver } from "./callRoom.endpoint";
import { CallRoomEmployee } from "./callRoom.employee";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: CallRoom.name, useFactory: CallRoom.middleware() }])],
  providers: [CallRoomEmployee, CallRoomResolver],
  exports: [CallRoomEmployee],
})
export class CallRoomModule {}
