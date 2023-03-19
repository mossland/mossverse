import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const collisionInput = (): gql.CollisionInput => ({} as any);

export const createCollision = async (app: TestingModule) => {
  const collisionService = app.get<srv.CollisionService>(srv.CollisionService);
  const collision = await collisionService.create(collisionInput());
  return collision;
};
