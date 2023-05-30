import { RaffleEmployee } from "./raffle.employee";
import { TestSystem } from "@shared/test-server";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Raffle Service", () => {
  const system = new TestSystem();
  let raffleEmployee: RaffleEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    raffleEmployee = app.get<RaffleEmployee>(RaffleEmployee);
  });
  afterAll(async () => await system.terminate());
  let raffle: db.Raffle.Doc;

  let input: cnst.RaffleInput;
  it("Create Raffle", async () => {
    input = sample.raffleInput();
    raffle = await raffleEmployee.create(input);
    expect(raffle.status).toEqual("active");
  });
  it("Update Raffle", async () => {
    input = sample.raffleInput();
    raffle = await raffleEmployee.update(raffle._id, input);
  });
  it("Remove Raffle", async () => {
    raffle = await raffleEmployee.remove(raffle._id);
    expect(raffle.status).toEqual("inactive");
  });
});
