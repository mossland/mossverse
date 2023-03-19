import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Character from "./character.model";
import { Account, DataLoader, Id, LoadConfig, LoadService } from "@shared/util-server";
import { UserService } from "../user/user.service";
import * as db from "../db";
import * as gql from "../gql";
import { srv as shared } from "@shared/module";

@Injectable()
export class CharacterService extends LoadService<Character.Mdl, Character.Doc, Character.Input> {
  rootLoader: DataLoader<Id, db.shared.Thing.Doc>;

  constructor(
    @InjectModel(Character.name)
    private readonly Character: Character.Mdl,
    private readonly userService: UserService,
    private readonly keyringService: shared.KeyringService,
    private readonly ownershipService: shared.OwnershipService,
    private readonly walletService: shared.WalletService,
    private readonly tokenService: shared.TokenService,
    private readonly thingService: shared.ThingService
  ) {
    super(CharacterService.name, Character);
  }

  async rejectCharacter(characterId: Id) {
    const character = await this.get(characterId);
    return await character.merge({ status: "rejected" }).save();
  }

  async approveCharacter(characterId: Id) {
    const character = await this.get(characterId);
    //approve 할 때 thing 생성
    // if (!character.creator) throw new Error("Creator is not exist");
    const thing = await this.thingService.create({
      name: character.name,
      description: character.description,
      image: character.file._id,
      root: character._id,
      rootType: "character",
    });
    //!trade로 변경
    // const ownership = await this.ownershipService.create({
    //   thing: thing._id,
    //   user: character.creator,
    //   type: "thing",
    // });

    return await character.merge({ status: "approved" }).save();
  }

  async reapplyCharacter(keyringId: Id, characterId: Id, data: gql.CharacterInput) {
    const character = await this.get(characterId);
    const user = await this.userService.pick({ keyring: keyringId });
    if (!character.creator?.equals(user._id)) throw new Error("You are not the owner of this character");
    if (character.status !== "rejected") throw new Error("This character is not rejected");
    return await character.merge({ ...data, status: "applied" }).save();

    // return await this.create({ ...data, creator: user._id });
  }

  async myCharacters(keyringId: Id) {
    const [user, keyring] = await Promise.all([
      this.userService.pick({ keyring: keyringId }),
      this.keyringService.get(keyringId),
    ]);
    const wallets = await this.walletService.loadMany(keyring.wallets);
    const ownerships = await this.ownershipService.myOwnership(user._id);

    const tokenIds = ownerships.filter((item) => item.value > 0).map((item) => item.token && item.token.id);
    const thingIds = ownerships.filter((item) => item.value > 0).map((item) => item.thing && item.thing.id);

    return await this.Character.find({
      $or: [{ token: { $in: tokenIds } }, { thing: { $in: thingIds } }, { token: null, thing: null }],
    });
  }
  async summarize(): Promise<gql.CharacterSummary> {
    return {
      totalCharacter: await this.Character.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
