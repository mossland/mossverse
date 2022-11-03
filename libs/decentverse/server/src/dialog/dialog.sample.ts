import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const dialogInput = (characters: Id[]): gql.DialogInput => ({
  title: c.sentence(),
  characters,
  flows: [],
});
export const createDialog = async (app: TestingModule, charcters: Id[]) => {
  const dialogService = app.get<srv.DialogService>(srv.DialogService);
  const dialog = await dialogService.create(dialogInput(charcters));
  return dialog;
};
