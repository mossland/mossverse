import * as Dialog from "./dialog.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class DialogEmployee extends LoadService<Dialog.Mdl, Dialog.Doc, Dialog.Input> {
  constructor(@InjectModel(Dialog.name) private readonly Dialog: Dialog.Mdl) {
    super(DialogEmployee.name, Dialog);
  }
  async summarize(): Promise<cnst.DialogSummary> {
    return {
      totalDialog: await this.Dialog.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
