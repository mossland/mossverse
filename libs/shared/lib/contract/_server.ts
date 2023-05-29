import * as Contract from "./contract.document";
import { ContractEmployee } from "./contract.employee";
import { ContractResolver } from "./contract.endpoint";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Contract.name, useFactory: Contract.middleware() }])],
  providers: [ContractEmployee, ContractResolver],
  exports: [ContractEmployee],
})
export class ContractModule {}
