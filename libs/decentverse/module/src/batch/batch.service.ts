import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import * as srv from "../srv";
import { LogService } from "@shared/util-server";
import { MapService } from "../map/map.service";
@Injectable()
export class BatchService extends LogService {
  constructor(private readonly rtService: srv.RtService, private readonly mapService: MapService) {
    super(BatchService.name);
  }
  @Cron("*/2 * * * * *")
  async expirePlayers() {
    const maps = await this.mapService.list({});
    for (const map of maps) {
      const expireNum = await this.rtService.expirePlayers(map._id.toString());
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
