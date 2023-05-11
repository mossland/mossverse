import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const placementInput = (): gql.PlacementInput => ({} as any);

export const createPlacement = async (app: TestingModule) => {
  const placementService = app.get<srv.PlacementService>(srv.PlacementService);
  const placement = await placementService.create(placementInput());
  return placement;
};
