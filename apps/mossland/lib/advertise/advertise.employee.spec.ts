import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { AdvertiseEmployee } from "./Advertise.service";
import { TestSystem } from "@shared/test-server";
import { environment } from "../../environments/environment";
import { registerModules } from "../server";

describe("Advertise Service", () => {
  const system = new TestSystem();
  let advertiseEmployee: AdvertiseEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    advertiseEmployee = app.get<AdvertiseEmployee>(AdvertiseEmployee);
  });
  afterAll(async () => await system.terminate());
  let advertise: db.Advertise.Doc;
  let input: cnst.AdvertiseInput;
  it("Create Advertise", async () => {
    input = sample.advertiseInput();
    advertise = await advertiseEmployee.create(input);
    expect(advertise.status).toEqual("active");
  });
  it("Update Advertise", async () => {
    input = sample.advertiseInput();
    advertise = await advertiseEmployee.update(advertise._id, input);
  });
  it("Remove Advertise", async () => {
    advertise = await advertiseEmployee.remove(advertise._id);
    expect(advertise.status).toEqual("inactive");
  });
});
