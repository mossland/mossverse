import { PointService } from "./point.service";
import { TestSystem } from "@shared/test-server";
import { PointModule } from "./point.module";

import * as sample from "../sample";
import * as db from "../db";
import * as gql from "../gql";
import { registerModules } from "../modules";
import { v4 as uuidv4 } from "uuid";
import * as srv from "../srv";

describe("Point Service", () => {
  const system = new TestSystem();
  let pointService: PointService;

  let networkService: srv.shared.NetworkService;
  let network: db.shared.Network.Doc;
  let point: db.shared.Thing.Doc;
  let user: db.lib.User.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    pointService = app.get<PointService>(PointService);
    network = await sample.shared.createNetwork(app, "klaytn");
    networkService = app.get<srv.shared.NetworkService>(srv.shared.NetworkService);
    point = pointService.point;
    [user] = await sample.lib.createUser(app, network._id, system.env.network.klaytn.root.address);
  });
  afterAll(async () => await system.terminate());
  it("Get Point", async () => {
    const val = await pointService.getPoint(user._id);
    expect(val).toEqual(0);
  });
  it("Add Point", async () => {
    await pointService.updatePoint(user._id, { type: "thing", hash: uuidv4(), num: 10 });
    const val = await pointService.getPoint(user._id);
    expect(val).toEqual(10);
  });
  it("Sub Point", async () => {
    await pointService.updatePoint(user._id, { type: "thing", hash: uuidv4(), num: -5 });
    const val = await pointService.getPoint(user._id);
    expect(val).toEqual(5);
  });
  it("Error When Point is Negative", async () => {
    await expect(pointService.updatePoint(user._id, { type: "thing", hash: uuidv4(), num: -50 })).rejects.toThrow();
  });
});
