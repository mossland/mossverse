import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Summary from "./summary.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { cnst, GetObject, Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import { srv as shared } from "@shared/module";
import { ListingService } from "../listing/listing.service";
import { ReceiptService } from "../receipt/receipt.service";
import { SurveyService } from "../survey/survey.service";
import { TradeService } from "../trade/trade.service";
import { SnapshotService } from "../snapshot/snapshot.service";
import { UserService } from "../user/user.service";
import { RaffleService } from "../raffle/raffle.service";
import { ShipInfoService } from "../shipInfo/shipInfo.service";
@Injectable()
export class SummaryService<
    Mdl extends Summary.Mdl = Summary.Mdl,
    Doc extends Summary.Doc = Summary.Doc,
    Input extends Summary.Input = Summary.Input
  >
  extends LoadService<Mdl, Doc, Input>
  implements GetObject<shared.SummaryService<Mdl, Doc, Input>>
{
  constructor(
    @InjectModel(Summary.name) Summary: Mdl,
    private readonly shipInfoService: ShipInfoService,
    private readonly raffleService: RaffleService,
    // ================= Library Import Zone ================= //
    private readonly adminService: shared.AdminService,
    private readonly contractService: shared.ContractService,
    private readonly currencyService: shared.CurrencyService,
    private readonly fileService: shared.FileService,
    private readonly keyringService: shared.KeyringService,
    private readonly networkService: shared.NetworkService,
    private readonly productService: shared.ProductService,
    private readonly thingService: shared.ThingService,
    private readonly tokenService: shared.TokenService,
    private readonly walletService: shared.WalletService,
    private readonly notificationService: shared.NotificationService,
    // ================= Library Import Zone ================= //
    private readonly listingService: ListingService,
    private readonly receiptService: ReceiptService,
    private readonly surveyService: SurveyService,
    private readonly tradeService: TradeService,
    private readonly snapshotService: SnapshotService,
    private readonly userService: UserService
  ) {
    super(SummaryService.name, Summary);
  }
  async getPlatformSummary(): Promise<gql.PlatformSummary> {
    return {
      ...(await this.listingService.summarize()),
      ...(await this.shipInfoService.summarize()),
      ...(await this.raffleService.summarize()),
      ...(await this.snapshotService.summarize()),
      ...(await this.receiptService.summarize()),
      ...(await this.surveyService.summarize()),
      ...(await this.tradeService.summarize()),
      ...(await this.userService.summarizePlatform()),
    };
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SummaryService<
  Mdl extends Summary.Mdl = Summary.Mdl,
  Doc extends Summary.Doc = Summary.Doc,
  Input extends Summary.Input = Summary.Input
> extends GetObject<shared.SummaryService<Mdl, Doc, Input>> {}
Utils.applyMixins(SummaryService, [shared.SummaryService]);
