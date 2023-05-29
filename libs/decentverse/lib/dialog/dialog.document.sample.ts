import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const dialogInput = (characters: Id[]): cnst.DialogInput => ({
  title: c.sentence(),
  characters,
  flows: [],
});
export const createDialog = async (app: TestingModule, charcters: Id[]) => {
  const dialogEmployee = app.get<emp.DialogEmployee>(emp.DialogEmployee);
  const dialog = await dialogEmployee.create(dialogInput(charcters));
  return dialog;
};
