import * as Summary from "./summary.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SummaryEmployee } from "./summary.employee";
import { SummaryResolver } from "./summary.endpoint";

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
