import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { LogService } from "@shared/util-server";
import { ListingService } from "../listing/listing.service";

@Injectable()
export class PlatBatchService extends LogService {
  constructor(private readonly listingService: ListingService) {
    super(PlatBatchService.name);
  }
  @Cron("*/5 * * * *")
  async checkHoldUsers() {
    await this.listingService.expireListingsAll();
  }
}
