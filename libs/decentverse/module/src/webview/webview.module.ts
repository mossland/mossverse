import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Webview from "./webview.model";
import { WebviewService } from "./webview.service";
import { WebviewResolver } from "./webview.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Webview.name, useFactory: Webview.middleware() }])],
  providers: [WebviewService, WebviewResolver],
  exports: [WebviewService],
})
export class WebviewModule {}
