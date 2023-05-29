import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const receiptInput = (from: Id): cnst.ReceiptInput => ({
  name: c.name(),
  type: "purchase",
  from,
  inputs: [],
  outputs: [],
});
export const createReceipt = async (app: TestingModule, userId: Id) => {
  const receiptEmployee = app.get<emp.ReceiptEmployee>(emp.ReceiptEmployee);
  const receipt = await receiptEmployee.create(receiptInput(userId));
  return receipt;
};
