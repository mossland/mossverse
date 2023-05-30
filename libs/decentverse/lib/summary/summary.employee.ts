import * as Summary from "./summary.document";
import * as cnst from "../cnst";
import { AssetEmployee } from "../asset/asset.employee";
import { CharacterEmployee } from "../character/character.employee";
import { DialogEmployee } from "../dialog/dialog.employee";
import { GetObject, LoadService, Utils } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { MapEmployee } from "../map/map.employee";
import { RoleEmployee } from "../role/role.employee";
import { TeleportEmployee } from "../teleport/teleport.employee";
import { UserEmployee } from "../user/user.employee";
import { emp as shared } from "@shared/server";

import { CallRoomEmployee } from "../callRoom/callRoom.employee";
import { CollisionEmployee } from "../collision/collision.employee";
import { LiveEmployee } from "../live/live.employee";
import { PlacementEmployee } from "../placement/placement.employee";
import { TileEmployee } from "../tile/tile.employee";
import { WebviewEmployee } from "../webview/webview.employee";
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
    private readonly teleportEmployee: TeleportEmployee,
    private readonly assetEmployee: AssetEmployee,
    private readonly characterEmployee: CharacterEmployee,
    private readonly dialogEmployee: DialogEmployee,
    private readonly mapEmployee: MapEmployee,
    private readonly roleEmployee: RoleEmployee,
    private readonly userEmployee: UserEmployee,
    private readonly tileEmployee: TileEmployee,
    private readonly liveEmployee: LiveEmployee,
    private readonly collisionEmployee: CollisionEmployee,
    private readonly placementEmployee: PlacementEmployee,
    private readonly webviewEmployee: WebviewEmployee,
    private readonly callRoomEmployee: CallRoomEmployee
  ) {
    super(SummaryEmployee.name, Summary);
  }
  async getDecentverseSummary(): Promise<cnst.DecentverseSummary> {
    //!TELEPORT SERVICE undefined 뜸
    return {
      ...(await this.assetEmployee.summarize()),
      ...(await this.teleportEmployee.summarize()),
      ...(await this.tileEmployee.summarize()),
      ...(await this.liveEmployee.summarize()),
      ...(await this.collisionEmployee.summarize()),
      ...(await this.placementEmployee.summarize()),
      ...(await this.webviewEmployee.summarize()),
      ...(await this.callRoomEmployee.summarize()),
      ...(await this.characterEmployee.summarize()),
      ...(await this.dialogEmployee.summarize()),
      ...(await this.mapEmployee.summarize()),
      ...(await this.roleEmployee.summarize()),
      ...(await this.userEmployee.summarizeDecentverse()),
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
