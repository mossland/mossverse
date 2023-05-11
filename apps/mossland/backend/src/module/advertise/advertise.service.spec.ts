import { AdvertiseService } from "./Advertise.service";
import { TestSystem } from "@shared/test-server";
import { environment } from "../../environments/environment";
import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";

describe("Advertise Service", () => {
  const system = new TestSystem();
  let advertiseService: AdvertiseService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    advertiseService = app.get<AdvertiseService>(AdvertiseService);
  });
  afterAll(async () => await system.terminate());
  let advertise: db.Advertise.Doc;
  let input: gql.AdvertiseInput;
  it("Create Advertise", async () => {
    input = sample.advertiseInput();
    advertise = await advertiseService.create(input);
    expect(advertise.status).toEqual("active");
  });
  it("Update Advertise", async () => {
    input = sample.advertiseInput();
    advertise = await advertiseService.update(advertise._id, input);
  });
  it("Remove Advertise", async () => {
    advertise = await advertiseService.remove(advertise._id);
    expect(advertise.status).toEqual("inactive");
  });
});
