import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService } from "@shared/util-server";
import * as Receipt from "./receipt.model";
import * as gql from "../gql";
import * as db from "../db";
import * as srv from "../srv";
import { cnst } from "@shared/util";

@Injectable()
export class ReceiptService extends LoadService<Receipt.Mdl, Receipt.Doc, Receipt.Input> {
  constructor(
    @InjectModel(Receipt.name)
    private readonly Receipt: Receipt.Mdl
  ) {
    super(ReceiptService.name, Receipt);
  }

  async myReceipts(userId: Id, type: cnst.ReceiptType) {
    return await this.Receipt.find({ $or: [{ from: userId }, { to: userId }], type, status: "success" });
  }
}
