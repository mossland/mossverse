import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import { ThingService } from "./thing.service";
import * as Chance from "chance";
import * as gql from "../gql";
import { cnst } from "@shared/util";
const c = new Chance();
export const thingInput = (fileId: Id, root: Id, rootType: string): gql.ThingInput => ({
  name: c.word(),
  image: fileId,
  description: "desc",
  root,
  rootType,
});

export const createThing = async (app: TestingModule, fileId: Id, root: Id, rootType: string) => {
  const thingService = app.get<ThingService>(ThingService);
  const thing = await thingService.create(thingInput(fileId, root, rootType));
  return thing;
};
