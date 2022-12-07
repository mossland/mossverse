import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import { AssetService } from "../asset/asset.service";
@Resolver(() => gql.Placement)
export class PlacementResolver {
  constructor(private readonly assetService: AssetService) {}

  @ResolveField(() => gql.Asset)
  async asset(@Parent() placement: gql.Placement) {
    return await this.assetService.load(placement.asset);
  }
}
