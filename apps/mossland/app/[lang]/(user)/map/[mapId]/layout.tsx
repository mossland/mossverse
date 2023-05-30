import { Common, fetch } from "@mossland/client";
import { Scene } from "@decentverse/client";

export default async function Layout({ children, params: { mapId } }) {
  const [
    { mapView },
    { tileInit },
    { collisionInit },
    { webviewInit },
    { liveInit },
    { placementInit },
    { teleportInit },
    { callRoomInit },
  ] = await Promise.all([
    fetch.decentverse.viewMap(mapId),
    fetch.decentverse.initTile({ query: { map: mapId }, limit: 0 }),
    fetch.decentverse.initCollision({ query: { map: mapId }, limit: 0 }),
    fetch.decentverse.initWebview({ query: { map: mapId }, limit: 0 }),
    fetch.decentverse.initLive({ query: { map: mapId }, limit: 0 }),
    fetch.decentverse.initPlacement({ query: { map: mapId }, limit: 0 }),
    fetch.decentverse.initTeleport({ query: { map: mapId }, limit: 0 }),
    fetch.decentverse.initCallRoom({ query: { map: mapId }, limit: 0 }),
  ]);
  return (
    <div className="w-full h-screen">
      {children}
      <Scene className="h-screen pointer-events-none -z-50 bg-slate-100">
        <Common.MosslandMapView
          mapView={mapView}
          tileInit={tileInit}
          collisionInit={collisionInit}
          webviewInit={webviewInit}
          liveInit={liveInit}
          placementInit={placementInit}
          teleportInit={teleportInit}
          callRoomInit={callRoomInit}
        />
      </Scene>
    </div>
  );
}
