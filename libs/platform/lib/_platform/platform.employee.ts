import { Cron } from "@nestjs/schedule";
import { Injectable } from "@nestjs/common";
import { ListingEmployee } from "../listing/listing.employee";
import { LogService } from "@util/server";

@Injectable()
export class PlatformEmployee extends LogService {
  constructor(private readonly listingEmployee: ListingEmployee) {
    super(PlatformEmployee.name);
  }
  @Cron("*/5 * * * *")
  async checkHoldUsers() {
    await this.listingEmployee.expireListingsAll();
  }
}
