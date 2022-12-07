import React, { Suspense, MutableRefObject, useRef, useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import { useInterval } from "@shared/util-client";
import { Socket } from "socket.io-client";
import { Utils } from "@shared/util";
import { Field } from "@shared/ui-web";
import { Button, Card } from "antd";
import { AreaBox } from "../common";
import { EditCallRoom } from "./";
import { DeleteOutlined } from "@ant-design/icons";
import { Mesh, PlaneGeometry } from "three";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { cnst } from "@shared/util";
import { roomTypes } from "libs/shared/util/src/constants";
export interface CallRoomsProp {
  callRooms?: gql.CallRoom[] | null;
  interaction?: MutableRefObject<gql.InteractionState>;
  player?: MutableRefObject<gql.RenderCharacter>;
  socket?: Socket;
}
export const CallRooms = ({
  interaction,
  player,
  socket,
  callRooms = store.map((state) => state.mapForm.callRooms),
}: CallRoomsProp) => {
  const joinCallRoom = store.callRoom.use.joinCallRoom();
  const leaveCallRoom = store.callRoom.use.leaveCallRoom();
  const receiveChat = store.gossip.use.receiveChat();
  // test
  useInterval(() => {
    if (!player || !callRooms || !socket || !interaction) return;
    if (interaction.current.callRoom) {
      if (Utils.isInside(player.current.position, interaction.current.callRoom)) return;
      store.callRoom.setState({ CALLROOM: null });
      leaveCallRoom();
      socket.off(`chat:${interaction.current.callRoom.id}`);
      interaction.current.callRoom = null;
    } else {
      for (const callRoom of callRooms) {
        if (!Utils.isInside(player.current.position, callRoom)) continue;
        interaction.current.callRoom = callRoom;
        store.callRoom.setState({ CALLROOM: callRoom });
        callRoom.roomType && joinCallRoom(callRoom.id, callRoom.roomType);
        socket.on(`chat:${interaction.current.callRoom.id}`, (c: gql.Chat) => receiveChat("callRoom", c));
      }
    }
  }, 500);
  if (!callRooms) return <></>;
  return (
    <>
      {callRooms.map((callRoom, idx) => (
        <CallRoom key={callRoom.id} callRoom={callRoom} />
      ))}
      <CallRoomOverlay />
    </>
  );
};

export interface CallRoomProp {
  callRoom: gql.CallRoom;
}
export const CallRoom = React.memo(({ callRoom }: CallRoomProp) => {
  const views = store.map.use.views();
  return (
    <Suspense fallback={null}>
      {views.includes("callRoom") && (
        <mesh position={[...callRoom.center, 0]}>
          <planeBufferGeometry attach="geometry" args={[...callRoom.wh]} />
          {/* <meshPhongMaterial attach="material" color="#36B3A0" opacity={0.7} transparent={true} /> */}
          <meshPhongMaterial attach="material" color="#36B3A0" opacity={0.7} transparent={true} />
        </mesh>
      )}
    </Suspense>
  );
});

export const CallRoomEdit = () => {
  const maxNum = store.callRoom.use.maxNum();
  const roomType = store.callRoom.use.roomType();

  return (
    <Field.Container>
      <Field.Number label="maxNum" value={maxNum} onChange={(maxNum) => store.callRoom.setState({ maxNum })} />
      <Field.SwitchItem
        label="videoRoom"
        checked={roomType === "video"}
        onChange={(value) => store.callRoom.setState({ roomType: value ? "video" : "call" })}
      />
    </Field.Container>
  );
};

interface CallRoomPreviewProps {
  mouse: MutableRefObject<gql.Mouse>;
}
export const CallRoomPreview = ({ mouse }: CallRoomPreviewProps) => {
  const edit = store.map.use.edit();
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const point = useRef<[number, number] | null>();
  const callRooms = store.map((state) => state.mapForm.callRooms);
  const updateMap = store.map.use.updateMap();
  const get = store.callRoom.use.get();
  const maxNum = store.callRoom.use.maxNum();
  const roomType = store.callRoom.use.roomType();
  useEffect(() => {
    const cancel = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      point.current = null;
      plane.current?.copy(new PlaneGeometry(5, 5));
    };
    window.addEventListener("keydown", cancel);
    return () => {
      window.removeEventListener("keydown", cancel);
    };
  }, []);
  useFrame(() => {
    if (edit !== "callRoom" || !mesh.current || !plane.current) return;
    if (!point.current) {
      mesh.current.position.set(mouse.current.x, mouse.current.y, 1);
    } else {
      const { center, wh } = Utils.getBox(mouse.current, point.current);
      mesh.current.position.set(...center, 0.1);
      plane.current.copy(new PlaneGeometry(...wh));
    }
  });
  if (edit !== "callRoom" || !callRooms) return <></>;

  const handleClick = async (e: ThreeEvent<PointerEvent> | any) => {
    if (!point.current) point.current = [e.point.x, e.point.y];
    else {
      const center = [
        Math.floor((e.point.x + point.current[0]) / 2),
        Math.floor((e.point.y + point.current[1]) / 2),
      ] as [number, number];
      const wh = [
        Math.abs(Math.floor(e.point.x - point.current[0])),
        Math.abs(Math.floor(e.point.y - point.current[1])),
      ] as [number, number];
      store.map.do.addCallRoomsOnMap({ ...get(), center, wh, id: "", maxNum: maxNum ? maxNum : 10, roomType });
      plane.current?.copy(new PlaneGeometry(5, 5));
      point.current = null;
      await updateMap();
    }
  };
  return (
    <mesh ref={mesh} onClick={handleClick}>
      <planeGeometry ref={plane} args={[5, 5]} />
      <meshBasicMaterial color="#36B3A0" opacity={0.5} transparent />
    </mesh>
  );
};

export const CallRoomList = () => {
  const callRooms = store.map((state) => state.mapForm.callRooms);
  const pointer = store.map.use.pointer();
  const update = store.map.use.updateMap();
  if (!callRooms) return <></>;
  const targets = callRooms.filter((callRoom) => Utils.isIn(pointer, callRoom));
  const handleRemove = async (callRoom: gql.CallRoom) => {
    store.map.do.setCallRoomsOnMap(callRooms.filter((l) => l !== callRoom));
    await update();
  };

  const handleModify = (callRoom: gql.CallRoom): ((maxNum: number, roomType: cnst.RoomType) => void) => {
    return async (maxNum: number, roomType: cnst.RoomType) => {
      store.map.do.setCallRoomsOnMap(
        callRooms.map((c) => {
          if (c !== callRoom) return c;
          return { ...c, maxNum, roomType };
        })
      );
      await update();
    };
  };

  return (
    <>
      {targets.map((callRoom) => (
        <CallRoomItem
          key={callRoom.id}
          callRoom={callRoom}
          onRemove={() => handleRemove(callRoom)}
          onModify={handleModify(callRoom)}
        />
      ))}
    </>
  );
};
interface CallRoomItemProps {
  callRoom: gql.CallRoom;
  onRemove: () => void;
  onModify: (maxNum: number, roomType: cnst.RoomType) => void;
}
export const CallRoomItem = ({ callRoom, onRemove, onModify }: CallRoomItemProps) => {
  return (
    <Card
      title="CallRoom"
      size="small"
      extra={
        <Button icon={<DeleteOutlined />} onClick={onRemove} size="small">
          delete
        </Button>
      }
    >
      <AreaBox color="#36B3A0" wh={callRoom.wh} center={callRoom.center} />
      <EditCallRoom maxNum={callRoom.maxNum} roomType={callRoom.roomType || "call"} onModify={onModify} />
    </Card>
  );
};

export const CallRoomOverlay = () => {
  const callRoom = store.callRoom.use.CALLROOM();
  if (!callRoom) return <></>;
  const offset = 10000;
  const positionZ = 0.0002;
  const boxes = [
    {
      center: Utils.moveCenter(callRoom.center, [callRoom.wh[0] / 2, 0], [offset / 2, 0]),
      wh: [offset, offset],
    },
    {
      center: Utils.moveCenter(callRoom.center, [-callRoom.wh[0] / 2, 0], [-offset / 2, 0]),
      wh: [offset, offset],
    },
    {
      center: Utils.moveCenter(callRoom.center, [0, callRoom.wh[1] / 2], [0, offset / 2]),
      wh: [callRoom.wh[0], offset],
    },
    {
      center: Utils.moveCenter(callRoom.center, [0, -callRoom.wh[1] / 2], [0, -offset / 2]),
      wh: [callRoom.wh[0], offset],
    },
  ];
  return (
    <>
      {boxes.map((box, idx) => (
        <mesh position={[...box.center, positionZ]} key={idx}>
          <planeBufferGeometry attach="geometry" args={box.wh as [number, number]} />
          <meshPhongMaterial attach="material" color={0x000000} opacity={0.4} transparent={true} />
        </mesh>
      ))}
    </>
  );
};
