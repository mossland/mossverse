import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { Physics } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { LoadItems, RecentTime, Card } from "@shared/ui-web";
import { logger, useInterval } from "@shared/util-client";
import dayjs from "dayjs";
import Router from "next/router";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { CallRoom, Collision, Live, Map, Placement, Teleport, Tile, Webview } from "..";
import { useKeyboard } from "../../../data-access/src/_hooks";

interface MapViewProps {
  className?: string;
  map: gql.Map;
  slice?: slice.MapSlice;
}
export const MapView = ({ className, map, slice = st.slice.map }: MapViewProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <Card title={`Map: ${map?.name}`} className="mb-[20px]">
        <div>
          <div className="border border-gray-100 rounded-lg sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="p-2 text-sm text-gray-500 bg-gray-50">tiles</dt>
            <dd className="p-2 text-sm text-gray-900 sm:col-span-2">
              {map.wh[0]} X {map.wh[1]}
            </dd>
          </div>
        </div>
      </Card>
    </div>
  );
};
interface MapViewWorldProps {
  className?: string;
  map: gql.Map;
  slice?: slice.MapSlice;
  onCallRoomJoin?: (callRoom: gql.CallRoom) => void;
  onCallRoomLeave?: (callRoom: gql.CallRoom) => void;
}
const MapViewWorld = ({ className, map, slice = st.slice.map, onCallRoomJoin, onCallRoomLeave }: MapViewWorldProps) => {
  logger.verbose("Map render");
  return (
    <>
      <Tile.List.World init={{ query: { map: map.id }, default: { map }, limit: 0 }} />
      <Collision.List.World init={{ query: { map: map.id }, default: { map }, limit: 0 }} />
      <Webview.List.World init={{ query: { map: map.id }, default: { map }, limit: 0 }} />
      <Live.List.World init={{ query: { map: map.id }, default: { map }, limit: 0 }} />
      <Placement.List.World init={{ query: { map: map.id }, default: { map }, limit: 0 }} />
      <Teleport.List.World init={{ query: { map: map.id }, default: { map }, limit: 0 }} />
      <CallRoom.List.World
        init={{ query: { map: map.id }, default: { map }, limit: 0 }}
        onJoin={onCallRoomJoin}
        onLeave={onCallRoomLeave}
      />
      <Map.Action.Daylight map={map} />
    </>
  );
};
MapView.World = MapViewWorld;
