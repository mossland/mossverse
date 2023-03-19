import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import { OwnershipService } from "./ownership.service";
import * as Chance from "chance";
import * as gql from "../gql";
const c = new Chance();
export const ownershipInput = (userId: Id = new Id(), thingId: Id = new Id()): gql.OwnershipInput => ({
  type: "thing",
  user: userId,
  thing: thingId,
  value: 1,
});

export const createOwnership = async (app: TestingModule, userId: Id, thingId: Id) => {
  const ownershipService = app.get<OwnershipService>(OwnershipService);
  const ownership = await ownershipService.create(ownershipInput(userId, thingId));
  return ownership;
};
