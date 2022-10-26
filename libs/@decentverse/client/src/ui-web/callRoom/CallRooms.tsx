import React, { Suspense, MutableRefObject, useRef, useEffect } from "react";
import { types, mapStore, gossipStore, callRoomStore } from "../../stores";
import { useInterval } from "../../hooks";
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
export interface CallRoomsProp {
  callRooms?: types.CallRoom[] | null;
  interaction?: MutableRefObject<types.InteractionState>;
  player?: MutableRefObject<types.RenderCharacter>;
  socket?: Socket;
}
export const CallRooms = ({ interaction, player, socket, callRooms = mapStore.use.callRooms() }: CallRoomsProp) => {
  const joinCallRoom = callRoomStore.use.joinCallRoom();
  const leaveCallRoom = callRoomStore.use.leaveCallRoom();
  const receiveChat = gossipStore.use.receiveChat();
  useInterval(() => {
    if (!player || !callRooms || !socket || !interaction) return;
    if (interaction.current.callRoom) {
      if (Utils.isInside(player.current.position, interaction.current.callRoom)) return;
      callRoomStore.setState({ CALLROOM: null });
      leaveCallRoom();
      socket.off(`chat:${interaction.current.callRoom.id}`);
      interaction.current.callRoom = null;
    } else {
      for (const callRoom of callRooms) {
        if (!Utils.isInside(player.current.position, callRoom)) continue;
        interaction.current.callRoom = callRoom;
        callRoomStore.setState({ CALLROOM: callRoom });
        joinCallRoom(callRoom.id);
        socket.on(`chat:${interaction.current.callRoom.id}`, (c: types.Chat) => receiveChat("callRoom", c));
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
  callRoom: types.CallRoom;
}
export const CallRoom = React.memo(({ callRoom }: CallRoomProp) => {
  const views = mapStore.use.views();
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
  const maxNum = callRoomStore.use.maxNum();
  const roomType = callRoomStore.use.roomType();

  return (
    <Field.Container>
      <Field.Number label="maxNum" value={maxNum} onChange={(maxNum) => callRoomStore.setState({ maxNum })} />
      <Field.SwitchItem
        label="videoRoom"
        checked={roomType === "video"}
        onChange={(value) => callRoomStore.setState({ roomType: value ? "video" : "call" })}
      />
    </Field.Container>
  );
};

interface CallRoomPreviewProps {
  mouse: MutableRefObject<types.Mouse>;
}
export const CallRoomPreview = ({ mouse }: CallRoomPreviewProps) => {
  const edit = mapStore.use.edit();
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const point = useRef<[number, number] | null>();
  const callRooms = mapStore.use.callRooms();
  const update = mapStore.use.update();
  const get = callRoomStore.use.get();
  const maxNum = callRoomStore.use.maxNum();
  const roomType = callRoomStore.use.roomType();
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
      mapStore.setState({
        callRooms: [...callRooms, { ...get(), center, wh, id: "", maxNum: maxNum ? maxNum : 10, roomType }],
      });
      plane.current?.copy(new PlaneGeometry(5, 5));
      point.current = null;
      await update();
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
  const callRooms = mapStore.use.callRooms();
  const pointer = mapStore.use.pointer();
  const update = mapStore.use.update();
  if (!callRooms) return <></>;
  const targets = callRooms.filter((callRoom) => Utils.isIn(pointer, callRoom));
  const handleRemove = async (callRoom: types.CallRoom) => {
    mapStore.setState({ callRooms: callRooms.filter((l) => l !== callRoom) });
    await update();
  };

  const handleModify = (callRoom: types.CallRoom): ((maxNum: number, roomType: cnst.RoomType) => void) => {
    return async (maxNum: number, roomType: cnst.RoomType) => {
      mapStore.setState({
        callRooms: callRooms.map((c) => {
          if (c !== callRoom) return c;
          return { ...c, maxNum, roomType };
        }),
      });
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
  callRoom: types.CallRoom;
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
  const callRoom = callRoomStore.use.CALLROOM();
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
