import { RaffleService } from "./raffle.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Raffle Service", () => {
  const system = new TestSystem();
  let raffleService: RaffleService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    raffleService = app.get<RaffleService>(RaffleService);
  });
  afterAll(async () => await system.terminate());
  let raffle: db.Raffle.Doc;

  let input: gql.RaffleInput;
  it("Create Raffle", async () => {
    input = sample.raffleInput();
    raffle = await raffleService.create(input);
    expect(raffle.status).toEqual("active");
  });
  it("Update Raffle", async () => {
    input = sample.raffleInput();
    raffle = await raffleService.update(raffle._id, input);
  });
  it("Remove Raffle", async () => {
    raffle = await raffleService.remove(raffle._id);
    expect(raffle.status).toEqual("inactive");
  });
});
