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
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Collision } from "../_scalar/scalar.gql";
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
  bottom: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  lighting: shared.File | null;

  @Field(() => [Collision])
  collisions: Collision[];

  @Field(() => [Webview])
  webviews: Webview[];

  @Field(() => [Live])
  lives: Live[];

  @Field(() => [Dialogue])
  dialogues: Dialogue[];
}

@ObjectType("Asset", { _id: "id" })
export class Asset extends BaseGql(AssetInput) {
  @Field(() => [Int])
  wh: [number, number];

  @Field(() => String)
  status: cnst.AssetStatus;
}

export const assetGraphQL = createGraphQL<"asset", Asset, AssetInput>(Asset, AssetInput);
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
  defaultAsset,
} = assetGraphQL;

@InputType("PlacementInput")
export class PlacementInput {
  @Field(() => Asset)
  asset: Asset;

  @Field(() => [Int])
  center: [number, number];

  @Field(() => [Int])
  wh: [number, number];
}

@ObjectType("Placement")
export class Placement extends BaseArrayFieldGql(PlacementInput) {}
export const placementFragment = createFragment(Placement);

export type AssetFile = "top" | "bottom" | "lighting";

// * Add AssetFiles Mutation
export type AddAssetFilesMutation = { addAssetFiles: shared.File[] };
export const addAssetFilesMutation = graphql`
  ${shared.fileFragment}
  mutation addAssetFiles($files: [Upload!]!, $assetId: String) {
    addAssetFiles(files: $files, assetId: $assetId) {
      ...fileFragment
    }
  }
`;
export const addAssetFiles = async (files: FileList, assetId?: string) =>
  (await mutate<AddAssetFilesMutation>(addAssetFilesMutation, { files, assetId })).addAssetFiles;
