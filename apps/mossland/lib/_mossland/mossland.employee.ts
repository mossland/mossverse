import { Cron } from "@nestjs/schedule";
import { Injectable } from "@nestjs/common";
import { LogService } from "@util/server";
import { MocSurveyEmployee } from "../mocSurvey/mocSurvey.employee";
import { MocWalletEmployee } from "../mocWallet/mocWallet.employee";
import { PointEmployee } from "../point/point.employee";
import { SummaryEmployee } from "../summary/summary.employee";
import { emp as platform } from "@platform/server";

@Injectable()
export class BatchEmployee extends LogService {
  constructor(
    private readonly pointEmployee: PointEmployee,
    private readonly raffleEmployee: platform.RaffleEmployee,
    private readonly mocServeyEmployee: MocSurveyEmployee,
    private readonly mocWalletEmployee: MocWalletEmployee,
    private readonly summaryEmployee: SummaryEmployee
  ) {
    super(BatchEmployee.name);
  }
  @Cron("0 0 * * *")
  async resetPoints() {
    await this.pointEmployee.resetPointsAll();
  }
  @Cron("0 */1 * * * *")
  async confirmDeposit() {
    await this.mocWalletEmployee.confirmDepositAll();
  }

  @Cron("30 */1 * * * *")
  async checkReservedAll() {
    await this.mocWalletEmployee.checkReservedAll();
  }

  @Cron("0 */5 * * * *")
  async checkExpiredSurveys() {
    await this.mocServeyEmployee.checkExpiredSurveyAll();
  }
  @Cron("* * * * * *")
  async checkClosedRaffles() {
    await this.raffleEmployee.checkClosedRaffles();
    await this.raffleEmployee.checkRafflePlcksUser();
  }
  @Cron("*/30 * * * * *")
  async takePeriodicSnapshot() {
    this.logger.verbose(`Taking summary of database...`);
    await this.summaryEmployee.getSummary();
    this.logger.verbose(`Taking summary of database finished`);
  }
}
