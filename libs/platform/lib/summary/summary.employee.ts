import * as Summary from "./summary.document";
import * as cnst from "../cnst";
import { GetObject, LoadService, Utils } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { ListingEmployee } from "../listing/listing.employee";
import { RaffleEmployee } from "../raffle/raffle.employee";
import { ReceiptEmployee } from "../receipt/receipt.employee";
import { ShipInfoEmployee } from "../shipInfo/shipInfo.employee";
import { SnapshotEmployee } from "../snapshot/snapshot.employee";
import { SurveyEmployee } from "../survey/survey.employee";
import { TradeEmployee } from "../trade/trade.employee";
import { UserEmployee } from "../user/user.employee";
import { emp as shared } from "@shared/server";
@Injectable()
export class SummaryEmployee<
    Mdl extends Summary.Mdl = Summary.Mdl,
    Doc extends Summary.Doc = Summary.Doc,
    Input extends Summary.Input = Summary.Input
  >
  extends LoadService<Mdl, Doc, Input>
  implements GetObject<shared.SummaryEmployee<Mdl, Doc, Input>>
{
  constructor(
    @InjectModel(Summary.name) Summary: Mdl,
    private readonly shipInfoEmployee: ShipInfoEmployee,
    private readonly raffleEmployee: RaffleEmployee,
    // ================= Library Import Zone ================= //
    private readonly adminEmployee: shared.AdminEmployee,
    private readonly contractEmployee: shared.ContractEmployee,
    private readonly currencyEmployee: shared.CurrencyEmployee,
    private readonly fileEmployee: shared.FileEmployee,
    private readonly keyringEmployee: shared.KeyringEmployee,
    private readonly networkEmployee: shared.NetworkEmployee,
    private readonly productEmployee: shared.ProductEmployee,
    private readonly thingEmployee: shared.ThingEmployee,
    private readonly tokenEmployee: shared.TokenEmployee,
    private readonly walletEmployee: shared.WalletEmployee,
    private readonly notificationEmployee: shared.NotificationEmployee,
    // ================= Library Import Zone ================= //
    private readonly listingEmployee: ListingEmployee,
    private readonly receiptEmployee: ReceiptEmployee,
    private readonly surveyEmployee: SurveyEmployee,
    private readonly tradeEmployee: TradeEmployee,
    private readonly snapshotEmployee: SnapshotEmployee,
    private readonly userEmployee: UserEmployee
  ) {
    super(SummaryEmployee.name, Summary);
  }
  async getPlatformSummary(): Promise<cnst.PlatformSummary> {
    return {
      ...(await this.listingEmployee.summarize()),
      ...(await this.shipInfoEmployee.summarize()),
      ...(await this.raffleEmployee.summarize()),
      ...(await this.snapshotEmployee.summarize()),
      ...(await this.receiptEmployee.summarize()),
      ...(await this.surveyEmployee.summarize()),
      ...(await this.tradeEmployee.summarize()),
      ...(await this.userEmployee.summarizePlatform()),
    };
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SummaryEmployee<
  Mdl extends Summary.Mdl = Summary.Mdl,
  Doc extends Summary.Doc = Summary.Doc,
  Input extends Summary.Input = Summary.Input
> extends GetObject<shared.SummaryEmployee<Mdl, Doc, Input>> {}
Utils.applyMixins(SummaryEmployee, [shared.SummaryEmployee]);
