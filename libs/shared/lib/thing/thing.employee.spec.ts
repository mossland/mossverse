import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { TestSystem } from "@shared/test-server";
import { ThingEmployee } from "./thing.employee";
import { environment } from "../env/environment";
import { registerModules } from "../server";
describe("Thing Service", () => {
  const system = new TestSystem();
  let thingEmployee: ThingEmployee;
  let fileEmployee: emp.FileEmployee;
  let file: db.File.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    thingEmployee = app.get<ThingEmployee>(ThingEmployee);
    fileEmployee = app.get<emp.FileEmployee>(emp.FileEmployee);
    [file] = await fileEmployee.addFiles([sample.fileStream()], "thing", "test");
  });
  afterAll(async () => await system.terminate());
  let thing: db.Thing.Doc;

  let input: cnst.ThingInput;
  it("Create Thing", async () => {
    input = sample.thingInput(file._id);
    thing = await thingEmployee.create(input);
    expect(thing.status).toEqual("active");
    expect(thing).toEqual(expect.objectContaining(input));
  });
  it("Update Thing", async () => {
    input = sample.thingInput(file._id);
    thing = await thingEmployee.update(thing._id, input);
    expect(thing).toEqual(expect.objectContaining(input));
  });
  it("Remove Thing", async () => {
    thing = await thingEmployee.remove(thing._id);
    expect(thing.status).toEqual("inactive");
  });
});
