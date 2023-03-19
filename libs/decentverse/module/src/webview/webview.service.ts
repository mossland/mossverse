import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Webview from "./webview.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class WebviewService extends LoadService<Webview.Mdl, Webview.Doc, Webview.Input> {
  constructor(
    @InjectModel(Webview.name)
    private readonly Webview: Webview.Mdl
  ) {
    super(WebviewService.name, Webview);
  }
  async summarize(): Promise<gql.WebviewSummary> {
    return {
      totalWebview: await this.Webview.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
