import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Dialog from "./dialog.model";
import * as db from "../db";
import * as gql from "../gql";
import { srv as shared } from "@shared/module";
import { LoadService } from "@shared/util-server";

@Injectable()
export class DialogService extends LoadService<Dialog.Mdl, Dialog.Doc, Dialog.Input> {
  constructor(@InjectModel(Dialog.name) private readonly Dialog: Dialog.Mdl) {
    super(DialogService.name, Dialog);
  }
  async summarize(): Promise<gql.DialogSummary> {
    return {
      totalDialog: await this.Dialog.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
