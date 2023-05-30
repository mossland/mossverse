import * as Webview from "./webview.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WebviewResolver } from "./webview.endpoint";
import { WebviewEmployee } from "./webview.employee";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Webview.name, useFactory: Webview.middleware() }])],
  providers: [WebviewEmployee, WebviewResolver],
  exports: [WebviewEmployee],
})
export class WebviewModule {}
