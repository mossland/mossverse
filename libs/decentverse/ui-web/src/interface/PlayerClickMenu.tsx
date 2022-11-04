import { useEffect, useRef } from "react";
import { store, gql } from "@decentverse/data-access";
import { Socket as Soc } from "socket.io-client";
import styled from "styled-components";

type PlayerClickMenuProps = {
  socket: Soc;
};
export const PlayerClickMenu = ({ socket }: PlayerClickMenuProps) => {
  const modalRef = useRef<HTMLDivElement | null | undefined>();
  const self = store.user.use.self();
  const callRoom = store.callRoom.use.callRoom();
  const otherPlayer = store.world.use.otherPlayer();
  const pointer = store.game.use.pointer();
  const lockKey = store.game.use.lockKey();
  const isRoomInUser = store.callRoom.use.isRoomInUser();
  useEffect(() => {
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  const clickOutside = (e: MouseEvent | any) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      store.world.setState({ otherPlayer: null });
      lockKey(false);
    }
  };
  if (!self || !otherPlayer || !pointer) return <></>;
  const kick = () => {
    socket.emit("adminEvent", { event: "kicked", id: otherPlayer.id });
    store.world.setState({ otherPlayer: null });
    lockKey(false);
  };
  const mute = () => {
    socket.emit("adminEvent", { event: "muted", id: otherPlayer.id, roomId: callRoom.roomId });
    store.world.setState({ otherPlayer: null });
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
