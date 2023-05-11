import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { LogService } from "@shared/util-server";
import { PointService } from "../point/point.service";
import { MocSurveyService } from "../mocSurvey/mocSurvey.service";
import { MocWalletService } from "../mocWallet/mocWallet.service";
import { SummaryService } from "../summary/summary.service";
import { srv as platform } from "@platform/module";

@Injectable()
export class BatchService extends LogService {
  constructor(
    private readonly pointService: PointService,
    private readonly raffleService: platform.RaffleService,
    private readonly mocServeyService: MocSurveyService,
    private readonly mocWalletService: MocWalletService,
    private readonly summaryService: SummaryService
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
  async checkExpiredSurveys() {
    // await this.mocServeyService.checkExpiredSurveyAll();
  }
  @Cron("* * * * * *")
  async checkClosedRaffles() {
    await this.raffleService.checkClosedRaffles();
    await this.raffleService.checkRafflePlcksUser();
  }
  @Cron("0 * * * *")
  async takePeriodicSnapshot() {
    this.logger.verbose(`Taking summary of database...`);
    await this.summaryService.getSummary();
    this.logger.verbose(`Taking summary of database finished`);
  }
}
