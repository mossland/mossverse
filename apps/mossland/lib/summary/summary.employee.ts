import * as Summary from "./summary.document";
import * as cnst from "../cnst";
import { AdvertiseEmployee } from "../advertise/advertise.employee";
import { GetObject, LoadService, Utils } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { MocSurveyEmployee } from "../mocSurvey/mocSurvey.employee";
import { MocWalletEmployee } from "../mocWallet/mocWallet.employee";
import { SkinManagerEmployee } from "../skinManager/skinManager.employee";
import { StakePoolEmployee } from "../stakePool/stakePool.employee";
import { UserEmployee } from "../user/user.employee";
import { emp as decentverse } from "@decentverse/server";
import { emp as platform } from "@platform/server";
import { emp as shared } from "@shared/server";
@Injectable()
export class SummaryEmployee<
    Mdl extends Summary.Mdl = Summary.Mdl,
    Doc extends Summary.Doc = Summary.Doc,
    Input extends Summary.Input = Summary.Input
  >
  extends LoadService<Mdl, Doc, Input>
  implements
    GetObject<shared.SummaryEmployee<Mdl, Doc, Input>>,
    GetObject<platform.SummaryEmployee<Mdl, Doc, Input>>,
    GetObject<decentverse.SummaryEmployee<Mdl, Doc, Input>>
{
  constructor(
    @InjectModel(Summary.name) Summary: Mdl,
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
    private readonly ownershipEmployee: shared.OwnershipEmployee,
    private readonly notificationEmployee: shared.NotificationEmployee,
    private readonly listingEmployee: platform.ListingEmployee,
    private readonly receiptEmployee: platform.ReceiptEmployee,
    private readonly surveyEmployee: platform.SurveyEmployee,
    private readonly tradeEmployee: platform.TradeEmployee,
    private readonly shipInfoEmployee: platform.ShipInfoEmployee,
    private readonly snapshotEmployee: platform.SnapshotEmployee,
    private readonly raffleEmployee: platform.RaffleEmployee,
    private readonly assetEmployee: decentverse.AssetEmployee,
    private readonly characterEmployee: decentverse.CharacterEmployee,
    private readonly dialogEmployee: decentverse.DialogEmployee,
    private readonly mapEmployee: decentverse.MapEmployee,
    private readonly roleEmployee: decentverse.RoleEmployee,
    private readonly tileEmployee: decentverse.TileEmployee,
    private readonly liveEmployee: decentverse.LiveEmployee,
    private readonly collisionEmployee: decentverse.CollisionEmployee,
    private readonly placementEmployee: decentverse.PlacementEmployee,
    private readonly webviewEmployee: decentverse.WebviewEmployee,
    private readonly callRoomEmployee: decentverse.CallRoomEmployee,
    private readonly teleportEmployee: decentverse.TeleportEmployee,
    // ================= Library Import Zone ================= //
    private readonly advertiseEmployee: AdvertiseEmployee,
    private readonly mocSurveyEmployee: MocSurveyEmployee,
    private readonly mocWalletEmployee: MocWalletEmployee,
    private readonly stakePoolEmployee: StakePoolEmployee,
    private readonly skinManagerEmployee: SkinManagerEmployee,
    private readonly userEmployee: UserEmployee
  ) {
    super(SummaryEmployee.name, Summary);
  }
  async getMosslandSummary(): Promise<cnst.MosslandSummary> {
    return {
      ...(await this.advertiseEmployee.summarize()),
      ...(await this.mocSurveyEmployee.summarize()),
      ...(await this.stakePoolEmployee.summarize()),
      ...(await this.mocWalletEmployee.summarize()),
      ...(await this.userEmployee.summarizeMossland()),
    };
  }
  async getSummary(archiveType: "periodic" | "non-periodic" = "non-periodic"): Promise<Doc> {
    const summary = {
      ...(await this.getSharedSummary()),
      ...(await this.getDecentverseSummary()),
      ...(await this.getPlatformSummary()),
      ...(await this.getMosslandSummary()),
    };
    return (await this.model.archive(archiveType, summary)) as unknown as Doc;
  }
}

export interface SummaryEmployee<
  Mdl extends Summary.Mdl = Summary.Mdl,
  Doc extends Summary.Doc = Summary.Doc,
  Input extends Summary.Input = Summary.Input
> extends GetObject<shared.SummaryEmployee<Mdl, Doc, Input>>,
    GetObject<platform.SummaryEmployee<Mdl, Doc, Input>>,
    GetObject<decentverse.SummaryEmployee<Mdl, Doc, Input>> {}
Utils.applyMixins(SummaryEmployee, [shared.SummaryEmployee, platform.SummaryEmployee, decentverse.SummaryEmployee]);
