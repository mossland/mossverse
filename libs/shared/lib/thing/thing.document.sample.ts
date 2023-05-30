import * as cnst from "../cnst";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import { ThingEmployee } from "./thing.employee";
import Chance from "chance";
const c = new Chance();
export const thingInput = (fileId: Id, root: Id, rootType: string): cnst.ThingInput => ({
  name: c.word(),
  image: fileId,
  description: "desc",
  root,
  rootType,
});

export const createThing = async (app: TestingModule, fileId: Id, root: Id, rootType: string) => {
  const thingEmployee = app.get<ThingEmployee>(ThingEmployee);
  const thing = await thingEmployee.create(thingInput(fileId, root, rootType));
  return thing;
};
