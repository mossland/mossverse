import * as Receipt from "./receipt.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class ReceiptEmployee extends LoadService<Receipt.Mdl, Receipt.Doc, Receipt.Input> {
  constructor(
    @InjectModel(Receipt.name)
    private readonly Receipt: Receipt.Mdl
  ) {
    super(ReceiptEmployee.name, Receipt);
  }
  // async myReceipts(userId: Id, type: cnst.ReceiptType) {
  //   return await this.Receipt.find({ $or: [{ from: userId }, { to: userId }], type, status: "success" });
  // }
  async summarize(): Promise<cnst.ReceiptSummary> {
    return {
      totalReceipt: await this.Receipt.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
