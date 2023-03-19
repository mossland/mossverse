import { environment } from "../_environments/environment";
import { ThingService } from "./thing.service";
import { TestSystem } from "@shared/test-server";
import { ThingModule } from "./thing.module";
import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Thing Service", () => {
  const system = new TestSystem();
  let thingService: ThingService;
  let fileService: srv.FileService;
  let file: db.File.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    thingService = app.get<ThingService>(ThingService);
    fileService = app.get<srv.FileService>(srv.FileService);
    [file] = await fileService.addFiles([sample.fileStream()], "thing", "test");
  });
  afterAll(async () => await system.terminate());
  let thing: db.Thing.Doc;

  let input: gql.ThingInput;
  it("Create Thing", async () => {
    input = sample.thingInput(file._id);
    thing = await thingService.create(input);
    expect(thing.status).toEqual("active");
    expect(thing).toEqual(expect.objectContaining(input));
  });
  it("Update Thing", async () => {
    input = sample.thingInput(file._id);
    thing = await thingService.update(thing._id, input);
    expect(thing).toEqual(expect.objectContaining(input));
  });
  it("Remove Thing", async () => {
    thing = await thingService.remove(thing._id);
    expect(thing.status).toEqual("inactive");
  });
});
