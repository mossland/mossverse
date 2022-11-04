import { useEffect, useRef } from "react";
import { callRoomStore, gameStore, userStore, worldStore } from "../../stores";
import { Socket as Soc } from "socket.io-client";
import styled from "styled-components";

type PlayerClickMenuProps = {
  socket: Soc;
};
export const PlayerClickMenu = ({ socket }: PlayerClickMenuProps) => {
  const modalRef = useRef<HTMLDivElement | null | undefined>();
  const self = userStore.use.self();
  const callRoom = callRoomStore.use.callRoom();
  const otherPlayer = worldStore.use.otherPlayer();
  const pointer = gameStore.use.pointer();
  const lockKey = gameStore.use.lockKey();
  const isRoomInUser = callRoomStore.use.isRoomInUser();
  useEffect(() => {
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  const clickOutside = (e: MouseEvent | any) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      worldStore.setState({ otherPlayer: null });
      lockKey(false);
    }
  };
  if (!self || !otherPlayer || !pointer) return <></>;
  const kick = () => {
    socket.emit("adminEvent", { event: "kicked", id: otherPlayer.id });
    worldStore.setState({ otherPlayer: null });
    lockKey(false);
  };
  const mute = () => {
    socket.emit("adminEvent", { event: "muted", id: otherPlayer.id, roomId: callRoom.roomId });
    worldStore.setState({ otherPlayer: null });
    lockKey(false);
  };
  return self.role === "admin" ? (
    <Information ref={modalRef as any} x={pointer[0]} y={pointer[1]}>
      <Menu onClick={kick}>kick user</Menu>
      {callRoom.roomId && isRoomInUser(otherPlayer.id) && (
        <>
          <HoraizontalLine />
          <Menu onClick={mute}>mute user</Menu>
        </>
      )}
    </Information>
  ) : (
    <></>
  );
};

const Information = styled("div")<{ x: number; y: number }>`
  position: absolute;
  display: inline-block;
  vertical-align: middle;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: 100px;
  border-width: 0.1px;
  background-color: white;
  z-index: 10;
`;

const HoraizontalLine = styled.hr`
  position: relative;
  width: auto;
  border-color: #b6b3b3;
  border-width: 0.1px;
  margin-top: 5px;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 5px;
`;

const Menu = styled.button`
  position: relative;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;

  background-color: transparent;
  :hover {
    opacity: 0.5;
    color: white;
    background-color: gray;
  }
`;
