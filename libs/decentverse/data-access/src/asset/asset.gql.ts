import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  Int,
  BaseArrayFieldGql,
  createFragment,
  PickType,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Collision } from "../collision/collision.gql";
import { Webview } from "../webview/webview.gql";
import { Dialogue } from "../dialog/dialog.gql";
import { Live } from "../live/live.gql";

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
