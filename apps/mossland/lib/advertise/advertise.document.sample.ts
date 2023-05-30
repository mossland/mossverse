import Chance from "chance";
import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import { Utils } from "@util/server";
const c = new Chance();
export const advertiseInput = (): cnst.AdvertiseInput => ({
  openAt: new Date(),
  closeAt: Utils.getLastMonths(-3),
});

export const createAdvertise = async (app: TestingModule) => {
  const advertiseEmployee = app.get<emp.AdvertiseEmployee>(emp.AdvertiseEmployee);
  const advertise = await advertiseEmployee.create(advertiseInput());
  return advertise;
};
