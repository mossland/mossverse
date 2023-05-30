import * as MocSurvey from "./mocSurvey.document";
import { Global, Module } from "@nestjs/common";
import { MocSurveyEmployee } from "./mocSurvey.employee";
import { MocSurveyResolver } from "./mocSurvey.endpoint";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: MocSurvey.name, useFactory: MocSurvey.middleware() }])],
  providers: [MocSurveyEmployee, MocSurveyResolver],
  exports: [MocSurveyEmployee],
})
export class MocSurveyModule {}
