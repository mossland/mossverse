import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PointService } from "./point.service";
import { PointResolver } from "./point.resolver";
import { PointController } from "./point.controller";

@Global()
@Module({
  imports: [],
  providers: [PointService, PointResolver],
  controllers: [PointController],
  exports: [PointService],
})
export class PointModule {}
