import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const userInput = (): cnst.UserInput => ({
  nickname: c.word(),
  requestRoles: [],
});
export const createUser = async (
  app: TestingModule,
  network: Id,
  address: string
): Promise<[doc.shared.User.Doc, doc.shared.Keyring.Doc, doc.shared.Wallet.Doc]> => {
  const walletEmployee = app.get<emp.shared.WalletEmployee>(emp.shared.WalletEmployee);
  const keyringEmployee = app.get<emp.shared.KeyringEmployee>(emp.shared.KeyringEmployee);
  await keyringEmployee.signinWallet(network, address);
  const wallet = await walletEmployee.pick({
    network,
    address: address.toLowerCase(),
  });
  const keyring = await keyringEmployee.pick({ wallets: wallet._id });
  const user = await keyringEmployee.whoAmI(keyring._id);
  return [user, keyring, wallet];
};

export const getHasThingUser = async (app: TestingModule, network: Id, address: string, thingId: Id) => {
  const thingEmployee = app.get<emp.shared.ThingEmployee>(emp.shared.ThingEmployee);
  const walletEmployee = app.get<emp.shared.WalletEmployee>(emp.shared.WalletEmployee);
  const keyringEmployee = app.get<emp.shared.KeyringEmployee>(emp.shared.KeyringEmployee);
  await keyringEmployee.signinWallet(network, address);
  const wallet = await walletEmployee.pick({ network, address });
  const keyring = await keyringEmployee.pick({ wallets: wallet._id });
  const user = await keyringEmployee.whoAmI(keyring._id);
  const thing = await thingEmployee.get(thingId);
  const num = c.integer({ min: 0, max: 100 });
  return await user.save();
  // return await userEmployee.update(._id, {
  //   items: [{ contract: token.contract._id._id, num, bn: num * (10 ^ 18), token: token._id }],
  // });
};
