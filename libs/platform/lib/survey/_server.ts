import * as Survey from "./survey.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SurveyEmployee } from "./survey.employee";
import { SurveyResolver } from "./survey.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Survey.name, useFactory: Survey.middleware() }])],
  providers: [SurveyEmployee, SurveyResolver],
  exports: [SurveyEmployee],
})
export class SurveyModule {}
