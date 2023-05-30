import { PointEmployee } from "./point.employee";
import { TestSystem } from "@shared/test-server";

import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
import { v4 as uuidv4 } from "uuid";

describe("Point Service", () => {
  const system = new TestSystem();
  let pointEmployee: PointEmployee;

  let networkEmployee: emp.shared.NetworkEmployee;
  let network: db.shared.Network.Doc;
  let point: db.shared.Thing.Doc;
  let user: db.lib.User.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    pointEmployee = app.get<PointEmployee>(PointEmployee);
    network = await sample.shared.createNetwork(app, "klaytn");
    networkEmployee = app.get<emp.shared.NetworkEmployee>(emp.shared.NetworkEmployee);
    point = pointEmployee.point;
    [user] = await sample.lib.createUser(app, network._id, system.env.network.klaytn.root.address);
  });
  afterAll(async () => await system.terminate());
  it("Get Point", async () => {
    const val = await pointEmployee.getPoint(user._id);
    expect(val).toEqual(0);
  });
  it("Add Point", async () => {
    await pointEmployee.updatePoint(user._id, {
      type: "thing",
      hash: uuidv4(),
      num: 10,
    });
    const val = await pointEmployee.getPoint(user._id);
    expect(val).toEqual(10);
  });
  it("Sub Point", async () => {
    await pointEmployee.updatePoint(user._id, {
      type: "thing",
      hash: uuidv4(),
      num: -5,
    });
    const val = await pointEmployee.getPoint(user._id);
    expect(val).toEqual(5);
  });
  it("Error When Point is Negative", async () => {
    await expect(
      pointEmployee.updatePoint(user._id, {
        type: "thing",
        hash: uuidv4(),
        num: -50,
      })
    ).rejects.toThrow();
  });
});
