import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { WebviewService } from "./webview.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Webview)
export class WebviewResolver extends BaseResolver(
  gql.Webview,
  gql.WebviewInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly webviewService: WebviewService, private readonly mapService: srv.MapService) {
    super(webviewService);
  }
  @ResolveField(() => gql.Map)
  async map(@Parent() webview: gql.Webview) {
    return await this.mapService.load(webview.map);
  }
}
