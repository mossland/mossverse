import { Injectable, Logger, Inject, forwardRef, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from "fs";
import { Id, LoadService, LogService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as srv from "../srv";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class SkinManagerService extends LogService {
  constructor(
    private readonly characterService: srv.decentverse.CharacterService,
    private readonly tradeService: srv.platform.TradeService,
    private readonly userService: srv.shared.UserService,
    private readonly fileService: srv.shared.FileService,
    private readonly ownershipService: srv.shared.OwnershipService,
    private readonly thingService: srv.shared.ThingService
  ) {
    super(SkinManagerService.name);
  }

  async tradeSkin(characterId: Id, tradeData: gql.platform.TradeInput, keyring: Id, address?: string) {
    const user = await this.userService.pick({ keyring });
    const character = await this.characterService.get(characterId);
    if (!character) throw new Error("character not found");
    if (character.status !== "approved") throw new Error("not approved character");
    if (!character.creator) throw new Error("creator not found");
    const file = await this.fileService.get(character.file);
    const trade = await this.tradeService.create({ ...tradeData, user: user._id, description: character.description });

    // update로 퉁칠까?
    await character.merge({ status: "active" }).save();
    return trade;
  }
}
