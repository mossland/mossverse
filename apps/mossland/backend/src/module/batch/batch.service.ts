import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { LogService } from "@shared/util-server";
// import * as srv from "../srv";
import { PointService } from "../point/point.service";
import { MocWalletService } from "../mocWallet/mocWallet.service";
import { SurveyService } from "libs/platform/module/src/srv";

@Injectable()
export class BatchService extends LogService {
  constructor(
    private readonly pointService: PointService,
    private readonly surveyService: SurveyService,
    private readonly mocWalletService: MocWalletService
  ) {
    super(BatchService.name);
  }
  @Cron("0 0 * * *")
  async resetPoints() {
    await this.pointService.resetPointsAll();
  }
  @Cron("0 */1 * * * *")
  async confirmDeposit() {
    await this.mocWalletService.confirmDepositAll();
  }

  @Cron("30 */1 * * * *")
  async checkReservedAll() {
    await this.mocWalletService.checkReservedAll();
  }

  @Cron("0 */5 * * * *")
  async checkExpiredSurveyAll() {
    await this.surveyService.checkExpiredSurveyAll();
  }
}
