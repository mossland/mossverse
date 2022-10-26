import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Survey from "./survey.model";
import { SurveyService } from "./survey.service";
import { SurveyResolver } from "./survey.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Survey.name, useFactory: Survey.middleware() }])],
  providers: [SurveyService, SurveyResolver],
  exports: [SurveyService],
})
export class SurveyModule {}
