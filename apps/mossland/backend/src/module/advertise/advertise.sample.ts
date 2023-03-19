import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { Id } from "@shared/util-server";
import { Utils } from "@shared/util";
const c = new Chance();
export const advertiseInput = (): gql.AdvertiseInput => ({
  openAt: new Date(),
  closeAt: Utils.getLastMonths(-3),
});

export const createAdvertise = async (app: TestingModule) => {
  const advertiseService = app.get<srv.AdvertiseService>(srv.AdvertiseService);
  const advertise = await advertiseService.create(advertiseInput());
  return advertise;
};
