import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Character from "./character.model";
import { Id, LoadService } from "@shared/util-server";
import { UserService } from "../user/user.service";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";

@Injectable()
export class CharacterService extends LoadService<Character.Mdl, Character.Doc, Character.Input> {
  constructor(
    @InjectModel(Character.name)
    private readonly Character: Character.Mdl,
    private readonly userService: UserService,
    private readonly keyringService: srv.shared.KeyringService,
    private readonly walletService: srv.shared.WalletService,
    private readonly tokenService: srv.shared.TokenService,
    private readonly thingService: srv.shared.ThingService
  ) {
    super(CharacterService.name, Character);
  }
  async myCharacters(keyringId: Id) {
    const [user, keyring] = await Promise.all([
      this.userService.pick({ keyring: keyringId }),
      this.keyringService.get(keyringId),
    ]);
    const wallets = await this.walletService.loadMany(keyring.wallets);
    const tokenIds: Id[] = wallets.reduce(
      (acc, wallet) => [...acc, ...wallet.items.filter((item) => item.num > 0).map((item) => item.token)],
      []
    );
    const thingIds = user.items.filter((item) => item.num > 0).map((item) => item.thing);
    return await this.Character.find({
      $or: [{ token: { $in: tokenIds } }, { thing: { $in: thingIds } }, { token: null, thing: null }],
    });
  }
}
