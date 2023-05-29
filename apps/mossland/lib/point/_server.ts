import { Global, Module } from "@nestjs/common";
import { PointController, PointResolver } from "./point.endpoint";
import { PointEmployee } from "./point.employee";

@Global()
@Module({
  imports: [],
  providers: [PointEmployee, PointResolver],
  controllers: [PointController],
  exports: [PointEmployee],
})
export class PointModule {}
