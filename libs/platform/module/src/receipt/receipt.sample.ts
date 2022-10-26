import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
import { Id } from "@shared/util-server";
const c = new Chance();
export const receiptInput = (from: Id): gql.ReceiptInput => ({
  type: "purchase",
  from,
  inputs: [],
  outputs: [],
});
export const createReceipt = async (app: TestingModule, userId: Id) => {
  const receiptService = app.get<srv.ReceiptService>(srv.ReceiptService);
  const receipt = await receiptService.create(receiptInput(userId));
  return receipt;
};
