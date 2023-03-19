import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Summary from "./summary.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { cnst, GetObject, Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import { srv as shared } from "@shared/module";
import { srv as platform } from "@platform/module";
import { srv as decentverse } from "@decentverse/module";
import { MocWalletService } from "../mocWallet/mocWallet.service";
import { AdvertiseService } from "../advertise/advertise.service";
import { MocSurveyService } from "../mocSurvey/mocSurvey.service";
import { UserService } from "../user/user.service";
import { StakePoolService } from "../stakePool/stakePool.service";
import { SkinManagerService } from "../skinManager/skinManager.service";
@Injectable()
export class SummaryService<
  Mdl extends Summary.Mdl = Summary.Mdl,
  Doc extends Summary.Doc = Summary.Doc,
  Input extends Summary.Input = Summary.Input
> extends LoadService<Mdl, Doc, Input>
  implements
    GetObject<shared.SummaryService<Mdl, Doc, Input>>,
    GetObject<platform.SummaryService<Mdl, Doc, Input>>,
    GetObject<decentverse.SummaryService<Mdl, Doc, Input>> {
  constructor(
    @InjectModel(Summary.name) Summary: Mdl,
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
    private readonly ownershipService: shared.OwnershipService,
    private readonly notificationService: shared.NotificationService,
    private readonly listingService: platform.ListingService,
    private readonly receiptService: platform.ReceiptService,
    private readonly surveyService: platform.SurveyService,
    private readonly tradeService: platform.TradeService,
    private readonly shipInfoService: platform.ShipInfoService,
    private readonly snapshotService: platform.SnapshotService,
    private readonly raffleService: platform.RaffleService,
    private readonly assetService: decentverse.AssetService,
    private readonly characterService: decentverse.CharacterService,
    private readonly dialogService: decentverse.DialogService,
    private readonly mapService: decentverse.MapService,
    private readonly roleService: decentverse.RoleService,
    private readonly tileService: decentverse.TileService,
    private readonly liveService: decentverse.LiveService,
    private readonly collisionService: decentverse.CollisionService,
    private readonly placementService: decentverse.PlacementService,
    private readonly webviewService: decentverse.WebviewService,
    private readonly callRoomService: decentverse.CallRoomService,
    // ================= Library Import Zone ================= //
    private readonly advertiseService: AdvertiseService,
    private readonly mocSurveyService: MocSurveyService,
    private readonly mocWalletService: MocWalletService,
    private readonly stakePoolService: StakePoolService,
    private readonly skinManagerService: SkinManagerService,
    private readonly userService: UserService
  ) {
    super(SummaryService.name, Summary);
  }
  async getMosslandSummary(): Promise<gql.MosslandSummary> {
    return {
      ...(await this.advertiseService.summarize()),
      ...(await this.mocSurveyService.summarize()),
      ...(await this.stakePoolService.summarize()),
      ...(await this.mocWalletService.summarize()),
      ...(await this.userService.summarizeMossland()),
    };
  }
  async getSummary(archiveType: "periodic" | "non-periodic" = "non-periodic"): Promise<Doc> {
    const summary = {
      ...(await this.getSharedSummary()),
      ...(await this.getDecentverseSummary()),
      ...(await this.getPlatformSummary()),
      ...(await this.getMosslandSummary()),
    };
    return ((await this.model.archive(archiveType, summary)) as unknown) as Doc;
  }
}

export interface SummaryService<
  Mdl extends Summary.Mdl = Summary.Mdl,
  Doc extends Summary.Doc = Summary.Doc,
  Input extends Summary.Input = Summary.Input
>
  extends GetObject<shared.SummaryService<Mdl, Doc, Input>>,
    GetObject<platform.SummaryService<Mdl, Doc, Input>>,
    GetObject<decentverse.SummaryService<Mdl, Doc, Input>> {}
Utils.applyMixins(SummaryService, [shared.SummaryService, platform.SummaryService, decentverse.SummaryService]);
