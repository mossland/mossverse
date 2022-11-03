import { CallRoom, Collision, Dialogue, Webview } from "../gql";

export type InteractionState = {
  collision: Collision | null;
  webview: Webview | null;
  callRoom: CallRoom | null;
  dialogue: Dialogue | null;
};
export const defaultInteractionState: InteractionState = {
  collision: null,
  webview: null,
  callRoom: null,
  dialogue: null,
};

export const mapViews = [
  "collision",
  "webview",
  "callRoom",
  "live",
  "live.iframe",
  "asset.top",
  "asset.bottom",
  "asset.lighting",
  "dialogue",
] as const;
export type MapView = typeof mapViews[number];
export const defaultEditorMapView: MapView[] = [
  "collision",
  "webview",
  "callRoom",
  "live",
  "asset.top",
  "asset.bottom",
  "asset.lighting",
  "dialogue",
];
export const defaultGameMapView: MapView[] = ["live.iframe", "asset.top", "asset.bottom", "asset.lighting"];
export const interactionViews: MapView[] = ["collision", "webview", "callRoom", "live", "dialogue"];
export const assetViews: MapView[] = ["asset.top", "asset.bottom", "asset.lighting"];

export const layerTypes = ["top", "bottom", "lighting"] as const;
export type LayerType = typeof layerTypes[number];

export const mapStatuses = ["active", "inactive"] as const;
export type MapStatus = typeof mapStatuses[number];
