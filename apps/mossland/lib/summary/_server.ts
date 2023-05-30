import * as Summary from "./summary.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SummaryResolver } from "./summary.endpoint";
import { SummaryEmployee } from "./summary.employee";

@Global()
@Module({})
export class SummaryModule {
  static register(isRoot?: boolean) {
    return {
      module: SummaryModule,
      imports: [MongooseModule.forFeatureAsync([{ name: Summary.name, useFactory: Summary.middleware() }])],
      providers: [SummaryEmployee, SummaryResolver],
      exports: isRoot ? [SummaryEmployee] : [SummaryEmployee],
    };
  }
}
