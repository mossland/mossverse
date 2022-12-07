import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { LogService } from "@shared/util-server";
import { ContractService } from "../contract/contract.service";

@Injectable()
export class SharedBatchService extends LogService implements OnModuleInit {
  constructor(private readonly contractService: ContractService) {
    super(SharedBatchService.name);
  }
  async onModuleInit() {
    await this.contractService.listenAllContracts();
  }
}
