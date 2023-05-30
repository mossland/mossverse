import * as cnst from "../cnst";
import { KeyringEmployee } from "./keyring.employee";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const keyringInput = (): cnst.KeyringInput => ({});
export const createKeyring = async (app: TestingModule) => {
  const keyringEmployee = app.get<KeyringEmployee>(KeyringEmployee);
  const keyring = await keyringEmployee.create(keyringInput());
  return keyring;
};
