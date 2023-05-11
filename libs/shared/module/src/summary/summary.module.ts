import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Summary from "./summary.model";
import { SummaryService } from "./summary.service";
import { SummaryResolver } from "./summary.resolver";

@Global()
@Module({})
export class SummaryModule {
  static register(isRoot?: boolean) {
    return {
      module: SummaryModule,
      imports: [MongooseModule.forFeatureAsync([{ name: Summary.name, useFactory: Summary.middleware() }])],
      providers: [SummaryService, SummaryResolver],
      exports: isRoot ? [SummaryService] : [SummaryService],
    };
  }
}
