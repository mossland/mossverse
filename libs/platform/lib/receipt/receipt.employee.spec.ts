import { ReceiptEmployee } from "./receipt.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Receipt Service", () => {
  const system = new TestSystem();
  let receiptEmployee: ReceiptEmployee;
  let network: db.shared.Network.Doc;
  let user: db.User.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    receiptEmployee = app.get<ReceiptEmployee>(ReceiptEmployee);
    network = await sample.shared.createNetwork(app, "klaytn");
    [user] = await sample.createUser(app, network._id, environment.klaytn.root.address);
  });
  afterAll(async () => await system.terminate());
  let receipt: db.Receipt.Doc;
  let input: cnst.ReceiptInput;
  it("Create Receipt", async () => {
    input = sample.receiptInput(user._id);
    receipt = await receiptEmployee.create(input);
    expect(receipt.status).toEqual("active");
  });
  it("Update Receipt", async () => {
    input = sample.receiptInput(user._id);
    receipt = await receiptEmployee.update(receipt._id, input);
  });
  it("Remove Receipt", async () => {
    receipt = await receiptEmployee.remove(receipt._id);
    expect(receipt.status).toEqual("inactive");
  });
});
