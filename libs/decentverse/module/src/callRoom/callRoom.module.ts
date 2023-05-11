import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as CallRoom from "./callRoom.model";
import { CallRoomService } from "./callRoom.service";
import { CallRoomResolver } from "./callRoom.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: CallRoom.name, useFactory: CallRoom.middleware() }])],
  providers: [CallRoomService, CallRoomResolver],
  exports: [CallRoomService],
})
export class CallRoomModule {}
