import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { LogService } from "@shared/util-server";
import { ContractService } from "../contract/contract.service";
import { srv as external } from "@external/module";
@Injectable()
export class SharedBatchService extends LogService implements OnModuleInit {
  constructor(
    private readonly contractService: ContractService,
    private readonly pubsubService: external.PubsubService
  ) {
    super(SharedBatchService.name);
  }
  async onModuleInit() {
    await this.contractService.listenAllContracts();
  }
  @Interval(10000)
  pubPing() {
    this.logger.verbose("Ping Published");
    this.pubsubService.ping();
  }
}
