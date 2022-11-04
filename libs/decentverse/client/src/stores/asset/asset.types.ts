import { Nullable } from "@shared/util-client";
import gql from "graphql-tag";
import { collisionFragment, webviewFragment, liveFragment } from "../_scalar";
import { dialogueFragment } from "../dialog/dialog.types";
import * as types from "./../types";
import { cnst } from "@shared/util";

export type AssetFile = "top" | "bottom" | "lighting";

export type AssetInput = {
  name: string;
  top: string | null;
  bottom: string | null;
  lighting: string | null;
  collisions: types.CollisionInput[];
  webviews: types.WebviewInput[];
  lives: types.LiveInput[];
  dialogues: types.DialogueInput[];
};

export const purifyAsset = (asset: Asset): AssetInput => ({
  name: asset.name,
  top: asset.top?.id ?? null,
  bottom: asset.bottom?.id ?? null,
  lighting: asset.lighting?.id ?? null,
  collisions: asset.collisions.map((collision) => types.purifyCollision(collision)),
  webviews: asset.webviews.map((webview) => types.purifyWebview(webview)),
  lives: asset.lives.map((live) => types.purifyLive(live)),
  dialogues: asset.dialogues.map((dialogue) => types.purifyDialogue(dialogue)),
});

export const defaultAsset: Nullable<Asset> = {
  id: null,
  name: null,
  top: null,
  bottom: null,
  lighting: null,
  collisions: [],
  webviews: [],
  lives: [],
  dialogues: [],
  wh: [0, 0],
  status: null,
  createdAt: null,
  updatedAt: null,
};

export type Asset = {
  id: types.ID;
  name: string;
  top: types.shared.File | null;
  bottom: types.shared.File | null;
  lighting: types.shared.File | null;
  collisions: types.Collision[];
  webviews: types.Webview[];
  lives: types.Live[];
  dialogues: types.Dialogue[];
  wh: [number, number];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

// # ${dialogueFragment}
export const assetFragment = gql`
  ${types.shared.fileFragment}
  ${collisionFragment}
  ${webviewFragment}
  ${liveFragment}
  fragment assetFragment on Asset {
    id
    name
    top {
      ...fileFragment
    }
    bottom {
      ...fileFragment
    }
    lighting {
      ...fileFragment
    }
    collisions {
      ...collisionFragment
    }
    webviews {
      ...webviewFragment
    }
    lives {
      ...liveFragment
    }
    # dialogues {
    #   ...dialogueFragment
    # }
    wh
    status
    createdAt
    updatedAt
  }
`;

export type PlacementInput = {
  asset: types.ID;
  center: [number, number];
  wh: [number, number];
};
export type Placement = {
  id: types.ID;
  asset: Asset;
  center: [number, number];
  wh: [number, number];
};
export const purifyPlacement = (placement: Placement): PlacementInput => ({
  asset: placement.asset.id,
  center: placement.center,
  wh: placement.wh,
});
export const placementFragment = gql`
  ${assetFragment}
  fragment placementFragment on Placement {
    id
    asset {
      ...assetFragment
    }
    center
    wh
  }
`;
