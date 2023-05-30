import * as Webview from "./webview.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class WebviewEmployee extends LoadService<Webview.Mdl, Webview.Doc, Webview.Input> {
  constructor(
    @InjectModel(Webview.name)
    private readonly Webview: Webview.Mdl
  ) {
    super(WebviewEmployee.name, Webview);
  }
  async summarize(): Promise<cnst.WebviewSummary> {
    return {
      totalWebview: await this.Webview.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
