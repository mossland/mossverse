"use client";
import { AreaBox } from "../../client";
import { BiX } from "react-icons/bi";
import { DataItem } from "@shared/client";
import { ModelProps, logger } from "@util/client";
import { Vector3 } from "three";
import { fetch, st } from "@decentverse/client";
import { useMemo } from "react";

export const Admin = ({
  className,
  callRoom,
  sliceName = "callRoom",
  actions,
  columns,
}: ModelProps<"callRoom", fetch.LightCallRoom>) => {
  return (
    <DataItem
      className={className}
      title={`CallRoom`}
      model={callRoom}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    >
      <button onClick={() => st.do.selectCallRoom(callRoom, { remove: true })} className="absolute top-0 right-0 m-5">
        <BiX />
      </button>
      <AreaBox color="#36B3A0" wh={callRoom.wh} center={callRoom.center} />
      <div>Max Num: {callRoom.maxNum}</div>
      <div>Room Type: {callRoom.roomType}</div>
    </DataItem>
  );
};

export const World = ({ className, callRoom, actions, columns }: ModelProps<"callRoom", fetch.LightCallRoom>) => {
  const mapLayerView = st.use.mapLayerView();
  const position = useMemo(() => new Vector3(...callRoom.center, 0), []);
  logger.verbose("Callroom rerender");
  return (
    <mesh position={position} onClick={() => st.do.selectCallRoom(callRoom, { refresh: true })}>
      {mapLayerView.callRoom && <planeGeometry attach="geometry" args={[...callRoom.wh]} />}
      <meshPhongMaterial attach="material" color="#36B3A0" opacity={0.7} transparent={true} />
    </mesh>
  );
};
