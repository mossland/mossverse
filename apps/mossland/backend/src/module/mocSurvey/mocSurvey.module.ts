import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as MocSurvey from "./mocSurvey.model";
import { MocSurveyService } from "./mocSurvey.service";
import { MocSurveyResolver } from "./mocSurvey.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: MocSurvey.name, useFactory: MocSurvey.middleware() }])],
  providers: [MocSurveyService, MocSurveyResolver],
  exports: [MocSurveyService],
})
export class MocSurveyModule {}
