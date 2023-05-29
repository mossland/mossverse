import * as Character from "./character.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import { DataLoader, Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { UserEmployee } from "../user/user.employee";
import { emp as shared } from "@shared/server";

@Injectable()
export class CharacterEmployee extends LoadService<Character.Mdl, Character.Doc, Character.Input> {
  rootLoader: DataLoader<Id, doc.shared.Thing.Doc>;

  constructor(
    @InjectModel(Character.name)
    private readonly Character: Character.Mdl,
    private readonly userEmployee: UserEmployee,
    private readonly keyringEmployee: shared.KeyringEmployee,
    private readonly ownershipEmployee: shared.OwnershipEmployee,
    private readonly walletEmployee: shared.WalletEmployee,
    private readonly tokenEmployee: shared.TokenEmployee,
    private readonly thingEmployee: shared.ThingEmployee
  ) {
    super(CharacterEmployee.name, Character);
  }

  async rejectCharacter(characterId: Id) {
    const character = await this.get(characterId);
    return await character.merge({ status: "rejected" }).save();
  }

  async approveCharacter(characterId: Id) {
    const character = await this.get(characterId);
    //approve 할 때 thing 생성
    // if (!character.creator) throw new Error("Creator is not exist");
    const thing = await this.thingEmployee.create({
      name: character.name,
      description: character.description,
      image: character.file._id,
      root: character._id,
      rootType: "character",
    });
    //!trade로 변경
    // const ownership = await this.ownershipEmployee.create({
    //   thing: thing._id,
    //   user: character.creator,
    //   type: "thing",
    // });

    return await character.merge({ status: "approved" }).save();
  }

  async reapplyCharacter(keyringId: Id, characterId: Id, data: cnst.CharacterInput) {
    const character = await this.get(characterId);
    const user = await this.userEmployee.pick({ keyring: keyringId });
    if (!character.creator?.equals(user._id)) throw new Error("You are not the owner of this character");
    if (character.status !== "rejected") throw new Error("This character is not rejected");
    return await character.merge({ ...data, status: "applied" }).save();

    // return await this.create({ ...data, creator: user._id });
  }

  async myCharacters(keyringId: Id) {
    const [user, keyring] = await Promise.all([
      this.userEmployee.pick({ keyring: keyringId }),
      this.keyringEmployee.get(keyringId),
    ]);
    const wallets = await this.walletEmployee.loadMany(keyring.wallets);
    const ownerships = await this.ownershipEmployee.myOwnerships(user._id);

    const tokenIds = ownerships.filter((item) => item.value > 0).map((item) => item.token && item.token.id);
    const thingIds = ownerships.filter((item) => item.value > 0).map((item) => item.thing && item.thing.id);

    return await this.Character.find({
      $or: [{ token: { $in: tokenIds } }, { thing: { $in: thingIds } }, { token: null, thing: null }],
    });
  }
  async summarize(): Promise<cnst.CharacterSummary> {
    return {
      totalCharacter: await this.Character.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
