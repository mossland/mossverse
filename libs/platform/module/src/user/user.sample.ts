import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
import * as db from "../db";
const c = new Chance();
export const userInput = (): gql.UserInput => ({
  nickname: c.word(),
});
export const createUser = async (
  app: TestingModule,
  network: Id,
  address: string
): Promise<[db.User.Doc, db.shared.Keyring.Doc, db.shared.Wallet.Doc]> => {
  const walletService = app.get<srv.shared.WalletService>(srv.shared.WalletService);
  const keyringService = app.get<srv.shared.KeyringService>(srv.shared.KeyringService);
  const userService = app.get<srv.UserService>(srv.UserService);
  await keyringService.signinWithAddress(network, address);
  const wallet = await walletService.pick({ network, address });
  const keyring = await keyringService.pick({ wallets: wallet._id });
  const user = await userService.whoAmI(keyring._id);
  return [user, keyring, wallet];
};

export const getHasThingUser = async (app: TestingModule, network: Id, address: string, thingId: Id) => {
  const thingService = app.get<srv.shared.ThingService>(srv.shared.ThingService);
  const walletService = app.get<srv.shared.WalletService>(srv.shared.WalletService);
  const keyringService = app.get<srv.shared.KeyringService>(srv.shared.KeyringService);
  const userService = app.get<srv.UserService>(srv.UserService);

  await keyringService.signinWithAddress(network, address);
  const wallet = await walletService.pick({ network, address });
  const keyring = await keyringService.pick({ wallets: wallet._id });
  const user = await userService.whoAmI(keyring._id);
  const thing = await thingService.get(thingId);
  const num = c.integer({ min: 0, max: 100 });
  return await user.merge({ items: [{ thing: thing._id, num: num }] }).save();
  // return await userService.update(._id, {
  //   items: [{ contract: token.contract._id._id, num, bn: num * (10 ^ 18), token: token._id }],
  // });
};
