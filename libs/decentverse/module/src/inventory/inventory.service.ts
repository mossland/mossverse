import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import fetch, { Response } from "node-fetch";
import * as fs from "fs";
import { LoadService, LogService } from "@shared/util-server";
import { Utils } from "@shared/util";
import { ItemOptions } from "../option";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
@Injectable()
export class InventoryService extends LogService {
  // private allService: srv.AllService;
  constructor() // private readonly contractService: srv.shared.ContractService, // private readonly assetService: srv.AssetService, // private readonly tokenService: srv.shared.TokenService,
  // private readonly adminService: srv.shared.AdminService,
  // private readonly characterService: srv.CharacterService,
  // private readonly dialogService: srv.DialogService,
  // private readonly mapService: srv.MapService,
  // private readonly rtService: srv.RtService,
  // private readonly fileService: srv.shared.FileService,
  // private readonly roleService: srv.RoleService,
  // @Inject(forwardRef(() => srv.UserService))
  // private readonly userSerivce: srv.UserService,

  // @Inject("ITEM_OPTIONS")
  // private options: ItemOptions
  {
    super(InventoryService.name);
    // this.allService = {
    //   // adminService: this.adminService,
    //   assetService: this.assetService,
    //   characterService: this.characterService,
    //   contractService: this.contractService,
    //   dialogService: this.dialogService,
    //   fileService: this.fileService,
    //   mapService: this.mapService,
    //   roleService: this.roleService,
    //   rtService: this.rtService,
    //   userService: this.userSerivce,
    //   tokenService: this.tokenService,
    // };
  }
  // async useItem(userId: string, itemId: string) {
  //   const itemCallback = this.options.itemCallbacks[itemId];
  //   if (!itemCallback) return false;
  //   itemCallback(userId, this.allService);
  //   return true;
  // }
}
