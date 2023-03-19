import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Summary from "./summary.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { cnst, GetObject, Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import { srv as shared } from "@shared/module";
import { AssetService } from "../asset/asset.service";
import { CharacterService } from "../character/character.service";
import { DialogService } from "../dialog/dialog.service";
import { MapService } from "../map/map.service";
import { RoleService } from "../role/role.service";
import { UserService } from "../user/user.service";

import { CallRoomService } from "../callRoom/callRoom.service";
import { WebviewService } from "../webview/webview.service";
import { PlacementService } from "../placement/placement.service";
import { CollisionService } from "../collision/collision.service";
import { LiveService } from "../live/live.service";
import { TileService } from "../tile/tile.service";
import { TeleportService } from "../teleport/teleport.service";
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
    private readonly teleportService: TeleportService,
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
    private readonly assetService: AssetService,
    private readonly characterService: CharacterService,
    private readonly dialogService: DialogService,
    private readonly mapService: MapService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly tileService: TileService,
    private readonly liveService: LiveService,
    private readonly collisionService: CollisionService,
    private readonly placementService: PlacementService,
    private readonly webviewService: WebviewService,
    private readonly callRoomService: CallRoomService
  ) {
    super(SummaryService.name, Summary);
  }
  async getDecentverseSummary(): Promise<gql.DecentverseSummary> {
    return {
      ...(await this.assetService.summarize()),
      ...(await this.teleportService.summarize()),
      ...(await this.tileService.summarize()),
      ...(await this.liveService.summarize()),
      ...(await this.collisionService.summarize()),
      ...(await this.placementService.summarize()),
      ...(await this.webviewService.summarize()),
      ...(await this.callRoomService.summarize()),
      ...(await this.characterService.summarize()),
      ...(await this.dialogService.summarize()),
      ...(await this.mapService.summarize()),
      ...(await this.roleService.summarize()),
      ...(await this.userService.summarizeDecentverse()),
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
