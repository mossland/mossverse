import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const keyringInput = (): gql.KeyringInput => ({});
export const createKeyring = async (app: TestingModule) => {
  const keyringService = app.get<srv.KeyringService>(srv.KeyringService);
  const keyring = await keyringService.create(keyringInput());
  return keyring;
};
