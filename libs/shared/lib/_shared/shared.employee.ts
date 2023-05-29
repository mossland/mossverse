import { ContractEmployee } from "../contract/contract.employee";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { LogService } from "@util/server";
import { emp as external } from "@external/server";
@Injectable()
export class SharedBatchService extends LogService implements OnModuleInit {
  constructor(
    private readonly contractEmployee: ContractEmployee,
    private readonly pubsubEmployee: external.PubsubEmployee
  ) {
    super(SharedBatchService.name);
  }
  async onModuleInit() {
    await this.contractEmployee.listenAllContracts();
  }
  @Interval(10000)
  pubPing() {
    this.logger.verbose("Ping Published");
    this.pubsubEmployee.ping();
  }
}
