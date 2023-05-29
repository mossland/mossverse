"use client";
import { CallRoom, Character, Collision, Live, Map, Placement, Teleport, Tile, Webview } from "@decentverse/client";
import { ServerInit, ServerView, cnst } from "@util/client";
import { fetch, st } from "@mossland/client";

interface MosslandMapViewProps {
  mapView: ServerView<"map", fetch.decentverse.Map>;
  tileInit: ServerInit<"tile", fetch.decentverse.LightTile>;
  collisionInit: ServerInit<"collision", fetch.decentverse.LightCollision>;
  webviewInit: ServerInit<"webview", fetch.decentverse.LightWebview>;
  liveInit: ServerInit<"live", fetch.decentverse.LightLive>;
  placementInit: ServerInit<"placement", fetch.decentverse.LightPlacement>;
  teleportInit: ServerInit<"teleport", fetch.decentverse.LightTeleport>;
  callRoomInit: ServerInit<"callRoom", fetch.decentverse.LightCallRoom>;
  spawnKey?: string;
}
export const MosslandMapView = ({
  mapView,
  tileInit,
  collisionInit,
  webviewInit,
  liveInit,
  placementInit,
  teleportInit,
  callRoomInit,
  spawnKey,
}: MosslandMapViewProps) => {
  const playerCharacter = st.use.playerCharacter();
  const me = st.use.me();
  return (
    <>
      <Tile.Zone.World init={tileInit} />
      <Collision.Zone.World init={collisionInit} />
      <Webview.Zone.World init={webviewInit} />
      <Live.Zone.World init={liveInit} />
      <Placement.Zone.World init={placementInit} />
      <Teleport.Zone.World init={teleportInit} />
      <CallRoom.Zone.World
        init={callRoomInit}
        onJoin={(callRoom) => st.do.joinGroupCall(callRoom.id, callRoom.roomType as cnst.GroupCallType)}
        onLeave={() => st.do.leaveGroupCall()}
      />
      <Map.Zone.WorldEnvironments view={mapView} />
      {playerCharacter.id && <Character.Zone.Player spawnKey={spawnKey ?? ""} />}
      <Character.Util.OtherPlayers />
      {me.roles.includes("admin") && <Map.Edit.World map={mapView.mapObj} />}
    </>
  );
};
