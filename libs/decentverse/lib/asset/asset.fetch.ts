import { BaseGql, Field, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";
import { fetch as shared } from "@shared/client";

@InputType("AssetInput")
export class AssetInput {
  @Field(() => String)
  name: string;

  @Field(() => shared.File, { nullable: true })
  top: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  wall: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  bottom: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  lighting: shared.File | null;

  //   @Field(() => [Collision])
  //   collisions: Collision[];

  //   @Field(() => [Webview])
  //   webviews: Webview[];

  //   @Field(() => [Live])
  //   lives: Live[];

  //   @Field(() => [Dialogue])
  //   dialogues: Dialogue[];
}

@ObjectType("Asset", { _id: "id" })
export class Asset extends BaseGql(AssetInput) {
  @Field(() => [Int])
  wh: [number, number];

  @Field(() => String)
  status: cnst.AssetStatus;
}

@ObjectType("LightAsset", { _id: "id", gqlRef: "Asset" })
export class LightAsset extends PickType(Asset, ["name", "bottom", "wall", "top", "lighting", "wh"] as const) {}

@ObjectType("AssetSummary")
export class AssetSummary {
  @Field(() => Int)
  totalAsset: number;
}

export const assetQueryMap = {
  totalAsset: { status: { $ne: "inactive" } },
};

export const assetGraphQL = createGraphQL("asset" as const, Asset, AssetInput, LightAsset);
export const {
  getAsset,
  listAsset,
  assetCount,
  assetExists,
  createAsset,
  updateAsset,
  removeAsset,
  assetFragment,
  purifyAsset,
  crystalizeAsset,
  lightCrystalizeAsset,
  defaultAsset,
  addAssetFiles,
  mergeAsset,
} = assetGraphQL;

export type AssetFile = "top" | "wall" | "bottom" | "lighting";
