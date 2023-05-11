import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataItem } from "@shared/ui-web";
import { logger, ModelProps } from "@shared/util-client";
import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Vector3 } from "three";
import { AreaBox } from "../common";

export const CallRoomItem = ({
  className,
  callRoom,
  slice = st.slice.callRoom,
  actions,
  columns,
}: ModelProps<slice.CallRoomSlice, gql.LightCallRoom>) => {
  return (
    <DataItem
      className={className}
      title={`CallRoom`}
      model={callRoom}
      slice={slice}
      actions={actions}
      columns={columns}
    >
      <AreaBox color="#36B3A0" wh={callRoom.wh} center={callRoom.center} />
      <div>Max Num: {callRoom.maxNum}</div>
      <div>Room Type: {callRoom.roomType}</div>
    </DataItem>
  );
};

const CallRoomItemWorld = memo(
  ({
    className,
    callRoom,
    slice = st.slice.callRoom,
    actions,
    columns,
  }: ModelProps<slice.CallRoomSlice, gql.LightCallRoom>) => {
    const mapLayerView = st.use.mapLayerView();
    const position = useMemo(() => new Vector3(...callRoom.center, 0), []);
    logger.verbose("Callroom rerender");
    return (
      <mesh position={position} onClick={() => slice.do.selectCallRoom(callRoom, { refresh: true })}>
        {mapLayerView.callRoom && <planeGeometry attach="geometry" args={[...callRoom.wh]} />}
        <meshPhongMaterial attach="material" color="#36B3A0" opacity={0.7} transparent={true} />
      </mesh>
    );
  }
);
CallRoomItem.World = CallRoomItemWorld;
