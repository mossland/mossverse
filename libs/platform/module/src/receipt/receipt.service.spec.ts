import { environment } from "../_environments/environment";
import { ReceiptService } from "./receipt.service";
import { TestSystem } from "@shared/test-server";
import { ReceiptModule } from "./receipt.module";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Receipt Service", () => {
  const system = new TestSystem();
  let receiptService: ReceiptService;
  let network: db.shared.Network.Doc;
  let user: db.User.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    receiptService = app.get<ReceiptService>(ReceiptService);
    network = await sample.shared.createNetwork(app, "klaytn");
    [user] = await sample.createUser(app, network._id, environment.klaytn.root.address);
  });
  afterAll(async () => await system.terminate());
  let receipt: db.Receipt.Doc;
  let input: gql.ReceiptInput;
  it("Create Receipt", async () => {
    input = sample.receiptInput(user._id);
    receipt = await receiptService.create(input);
    expect(receipt.status).toEqual("active");
  });
  it("Update Receipt", async () => {
    input = sample.receiptInput(user._id);
    receipt = await receiptService.update(receipt._id, input);
  });
  it("Remove Receipt", async () => {
    receipt = await receiptService.remove(receipt._id);
    expect(receipt.status).toEqual("inactive");
  });
});
