import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const thingInput = (fileId: Id): gql.ThingInput => ({
  name: c.word(),
  image: fileId,
  description: "desc",
});

export const createThing = async (app: TestingModule, fileId: Id) => {
  const thingService = app.get<srv.ThingService>(srv.ThingService);
  const thing = await thingService.create(thingInput(fileId));
  return thing;
};
