import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { WebviewEmployee } from "./webview.employee";

@Resolver(() => cnst.Webview)
export class WebviewResolver extends BaseResolver(
  cnst.Webview,
  cnst.WebviewInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly webviewEmployee: WebviewEmployee, private readonly mapEmployee: emp.MapEmployee) {
    super(webviewEmployee);
  }
  @ResolveField(() => cnst.Map)
  async map(@Parent() webview: cnst.Webview) {
    return await this.mapEmployee.load(webview.map);
  }
}
