import * as emp from "../emp";
import { Cron } from "@nestjs/schedule";
import { Injectable } from "@nestjs/common";
import { LogService } from "@util/server";
import { MapEmployee } from "../map/map.employee";
@Injectable()
export class BatchEmployee extends LogService {
  constructor(private readonly rtEmployee: emp.RtEmployee, private readonly mapEmployee: MapEmployee) {
    super(BatchEmployee.name);
  }
  @Cron("*/2 * * * * *")
  async expirePlayers() {
    const maps = await this.mapEmployee.list({});
    for (const map of maps) {
      const expireNum = await this.rtEmployee.expirePlayers(map._id.toString());
      if (expireNum) this.logger.log(`${map.name}: ${expireNum} Players Expired`);
    }
  }
  //   @Interval(10000)
  //   handleInterval() {
  //     this.logger.debug("Called every 10 seconds");
  //   }

  //   @Timeout(5000)
  //   handleTimeout() {
  //     this.logger.debug("Called once after 5 seconds");
  //   }
}
