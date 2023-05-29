import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id, LogService } from "@util/server";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SkinManagerEmployee extends LogService {
  constructor(
    private readonly characterEmployee: emp.decentverse.CharacterEmployee,
    private readonly tradeEmployee: emp.platform.TradeEmployee,
    private readonly userEmployee: emp.shared.UserEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly ownershipEmployee: emp.shared.OwnershipEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee
  ) {
    super(SkinManagerEmployee.name);
  }

  async tradeSkin(characterId: Id, tradeData: cnst.platform.TradeInput, keyring: Id, address?: string) {
    const user = await this.userEmployee.pick({ keyring });
    const character = await this.characterEmployee.get(characterId);
    if (!character) throw new Error("character not found");
    if (character.status !== "approved") throw new Error("not approved character");
    if (!character.creator) throw new Error("creator not found");
    const file = await this.fileEmployee.get(character.file);
    const trade = await this.tradeEmployee.create({
      ...tradeData,
      user: user._id,
      description: character.description,
    });

    // update로 퉁칠까?
    await character.merge({ status: "active" }).save();
    return trade;
  }
}
