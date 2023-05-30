import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const stakePoolInput = (thing: Id): cnst.StakePoolInput => ({
  thing,
  type: "staking",
  name: c.name(),
});

export const createStakePool = async (app: TestingModule, thing: Id) => {
  const stakePoolEmployee = app.get<emp.StakePoolEmployee>(emp.StakePoolEmployee);
  const stakePool = await stakePoolEmployee.create(stakePoolInput(thing));
  return stakePool;
};
