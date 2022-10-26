import { Global, Module, DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Contract from "./contract.model";
import { ContractService } from "./contract.service";
import { ContractResolver } from "./contract.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Contract.name, useFactory: Contract.middleware() }])],
  providers: [ContractService, ContractResolver],
  exports: [ContractService],
})
export class ContractModule {}
